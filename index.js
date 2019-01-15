const fs = require('fs');
const path = require('path');

function SymlinkWebpackPlugin (config = []) {
  let options;
  if (config instanceof Array) {
    options = config;
  } else {
    options = [config];
  }

  const apply = (compiler) => {
    compiler.plugin('after-emit', (compilation, callback) => {
      const makeSymlinks = (option) => {
        const outputPath = compiler.options.output.path;
        const originPath = path.join(outputPath, option.origin);

        if (option.force || fs.existsSync(originPath)) {
          const baseDir = process.cwd();
          process.chdir(outputPath);
          const symlink = path.join(outputPath, option.symlink);
          const origin = path.relative(path.dirname(symlink), originPath);

          try {
            fs.readlinkSync(symlink); // Raises if symlink doesn't exist
            fs.unlinkSync(symlink);
          } catch (e) {
            // symlink doesn't exist
          } finally {
            fs.symlinkSync(origin, symlink);
          }

          process.chdir(baseDir);
        }
      };

      options.forEach(makeSymlinks);
      callback();
    });
  };

  return {
    apply
  };
}

module.exports = SymlinkWebpackPlugin;
