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

    hooks.afterEmit.tapAsync('Symlink', (compilation, done) => {
      this.targets.forEach(target => {
        let origin, symlink;
        const originPath = join(outputPath, target.origin);
        const baseDir = process.cwd();

        if (target.force || existsSync(originPath)) {
          process.chdir(outputPath);
          symlink = join(outputPath, target.symlink);
          origin = relative(dirname(symlink), originPath);

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
      });

      done();
    });
  }
}

module.exports = SymlinkWebpackPlugin;
