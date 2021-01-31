const { existsSync, readlinkSync, symlinkSync, unlinkSync } = require('fs');
const { dirname, join, relative } = require('path');

/*
  target: { origin: string, symlink: string, force: boolean = false, hook: string = 'afterEmit' }
*/
class SymlinkWebpackPlugin {
  constructor(config = []) {
    const configs = (config instanceof Array ? config : [config]).map(c => ({
      force: false,
      hook: 'afterEmit',
      ...c
    }));

    this.configsPerHook = configs.reduce((perHook, config) => {
      if (perHook[config.hook]) {
        perHook[config.hook].push(config)
      } else {
        perHook[config.hook] = [config]
      }
      return perHook
    }, {})
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

    Object.entries(this.configsPerHook).forEach(([hook, configs]) => {
      hooks[hook].tap(`SymlinkWebpackPlugin on ${hook}`, () => {
        configs.forEach(makeSymbolicLink);
      });
    });
  }
}

module.exports = SymlinkWebpackPlugin;
