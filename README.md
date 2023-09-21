Installs a global `cargo` dependency if it isn't already installed.

# Inputs

- **name** (required): Package to install
- **version**: Version to install, defaults to latest
- **release**: Boolean, set to true to install a release version instead of debug
- **force-version**: Boolean, set to true to force the given version if a different version is installed
- **binary-name**: If the binary name is different from the package name, specify it here (used for version checks)
