const { existsSync, readlinkSync, symlinkSync, unlinkSync } = require('fs');
const { dirname, join, relative } = require('path');

class SymlinkWebpackPlugin {
  constructor(config = []) {
    if (config instanceof Array) {
      this.targets = config;
    } else {
      this.targets = [config];
    }
  }

  apply({ hooks, options }) {
    const outputPath = options.output.path;

    const makeSymbolicLink = (target) => {
      const originPath = join(outputPath, target.origin);

      if (target.force || existsSync(originPath)) {
        const baseDir = process.cwd();
        process.chdir(outputPath);
        const symlink = join(outputPath, target.symlink);
        const origin = relative(dirname(symlink), originPath);

        try {
          readlinkSync(symlink); // Raises if symlink doesn't exist
          unlinkSync(symlink);
        } catch (e) {
          // symlink doesn't exist
        } finally {
          symlinkSync(origin, symlink);
        }

        process.chdir(baseDir);
      }
    };

    hooks.afterEmit.tap('Symlink', () => {
      this.targets.forEach(makeSymbolicLink);
    });
  }
}

module.exports = SymlinkWebpackPlugin;
