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

        if (fs.existsSync(originPath)) {
          const baseDir = process.cwd();
          process.chdir(outputPath);
          const symlink = path.join(outputPath, option.symlink);
          const origin = path.relative(path.dirname(symlink), originPath);

          if (fs.existsSync(symlink)) fs.unlinkSync(symlink);
          fs.symlinkSync(origin, symlink);

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
