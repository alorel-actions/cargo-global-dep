const {getInput, getBooleanInput, setFailed, info, notice} = require('@actions/core');
const {spawnSync} = require('node:child_process');

try {
  const name = getInput('name', {required: true});
  const version = getInput('version');
  const release = getBooleanInput('release');

  const alreadyInstalled = getInstalledVersion(name);

  if (version && alreadyInstalled && alreadyInstalled === version) {
    info(`Already installed ${name}@${alreadyInstalled}`);
    return;
  }

  const args = ['install', name];
  if (version) {
    args.push('--version', version);
  }

  if (!release) {
    args.push('--debug');
  }

  if (alreadyInstalled) {
    notice(`Upgrading ${name}@${alreadyInstalled} to ${version}`);

    args.push('--force');
  }

  const res = spawnSync('cargo', args, {
    env: process.env,
    stdio: 'inherit',
  });
  if (res.status === 0) {
    info(`Installed ${name}@${version}`);
  } else {
    setFailed(`Failed to install ${name}@${version}`);
  }
} catch (e) {
  setFailed(e);
}

function getInstalledVersion(pkg) {
  let app;
  const args = ['--version'];
  if (pkg.match(/^cargo-[\w-_]+$/)) {
    app = 'cargo';
    args.unshift(pkg.slice('cargo-'.length));
  } else {
    app = pkg;
  }

  const res = spawnSync(app, args, {
    encoding: 'utf8',
    env: process.env,
    stdio: ['ignore', 'pipe', 'inherit'],
  });

  if (res.status !== 0) {
    return;
  }

  return res.stdout.match(/\d+\.\d+\.\d+(-\w+\.\d+)?/)?.[0];
}
