const { resolve } = require('path');
const { existsSync, lstatSync, mkdirSync, readlinkSync, symlinkSync } = require('fs');
const { expect } = require('chai');
const webpack = require('webpack');
const { remove } = require('fs-extra');
const generateHookInspectPlugin = require('./helpers/WebpackHookInspectPlugin');

const SymlinkWebpackPlugin = require('../index');
const testDir = resolve(__dirname, '../test_dist');
const entryFile = resolve(__dirname, './helpers/main.js');

const removeWorkingDir = (done) => {
  remove(testDir, () => done());
};

const webpackOption = (plugin) => ({
  entry: {
    app: entryFile,
  },
  output: {
    path: testDir,
    filename: '[name].js',
  },
  plugins: plugin instanceof Array ? plugin : [plugin],
});

describe('SymlinkWebpackPlugin', () => {
  beforeEach(removeWorkingDir);
  afterEach(removeWorkingDir);

  context('by afterEmit hook (as default)', () => {
    context('Configure with array', () => {
      const asArray = new SymlinkWebpackPlugin([{ origin: 'app.js', symlink: 'symlink.js' }]);

      it('should make a symbolic link', (done) => {
        webpack(webpackOption(asArray), () => {
          expect(lstatSync(testDir + '/symlink.js').isSymbolicLink()).to.be.true;
          expect(readlinkSync(testDir + '/symlink.js')).to.eq('app.js');
          done();
        });
      });
    });

    context('Configure without array', () => {
      [
        { title: 'hook is not given', config: { origin: 'app.js', symlink: 'symlinkByNoArray.js' } },
        { title: 'hook is given', config: { origin: 'app.js', symlink: 'symlinkByNoArray.js', hook: 'afterEmit' } },
      ].forEach(({ title, config }) => {
        context(title, () => {
          const plugin = new SymlinkWebpackPlugin(config);

          it('should make a symbolic link', (done) => {
            webpack(webpackOption(plugin), () => {
              expect(lstatSync(testDir + '/symlinkByNoArray.js').isSymbolicLink()).to.be.true;
              expect(readlinkSync(testDir + '/symlinkByNoArray.js')).to.eq('app.js');
              done();
            });
          });

          it('should remove an existing link', (done) => {
            mkdirSync(testDir);
            symlinkSync('unknown.js', testDir + '/symlinkByNoArray.js');
            expect(readlinkSync(testDir + '/symlinkByNoArray.js')).to.eq('unknown.js');

            webpack(webpackOption(plugin), () => {
              expect(lstatSync(testDir + '/symlinkByNoArray.js').isSymbolicLink()).to.be.true;
              expect(readlinkSync(testDir + '/symlinkByNoArray.js')).to.eq('app.js');
              done();
            });
          });
        });
      });
    });

    it('should not change process.cwd() eventually', (done) => {
      const cwd = process.cwd();

      const plugin = new SymlinkWebpackPlugin([{ origin: 'app.js', symlink: 'symlink.js' }]);
      webpack(webpackOption(plugin), () => {
        expect(process.cwd()).to.eq(cwd);
        done();
      });
    });

    context('force option is true', () => {
      const config = new SymlinkWebpackPlugin({
        origin: 'missing.js',
        symlink: 'forcedForMissing.js',
        force: true,
      });

      it('should make a symbolic link even if the destination file does not exist', (done) => {
        webpack(webpackOption(config), () => {
          expect(lstatSync(testDir + '/forcedForMissing.js').isSymbolicLink()).to.be.true;
          expect(existsSync(testDir + '/missing.js')).to.eq(false);
          expect(readlinkSync(testDir + '/forcedForMissing.js')).to.eq('missing.js');
          done();
        });
      });

      it('should remove an existing link', (done) => {
        mkdirSync(testDir);
        symlinkSync('app.js', testDir + '/forcedForMissing.js');
        expect(readlinkSync(testDir + '/forcedForMissing.js')).to.eq('app.js');

        webpack(webpackOption(config), () => {
          expect(readlinkSync(testDir + '/forcedForMissing.js')).to.eq('missing.js');
          done();
        });
      });

      it('should make a symbolic link with making new directories, and a created link has a relative path for a destination', (done) => {
        webpack(
          webpackOption(
            new SymlinkWebpackPlugin({
              origin: 'missing.js',
              symlink: 'one/two/forcedForMissingFromDeepness.js',
              force: true,
            })
          ),
          () => {
            expect(lstatSync(testDir + '/one/two/forcedForMissingFromDeepness.js').isSymbolicLink()).to.be.true;
            expect(readlinkSync(testDir + '/one/two/forcedForMissingFromDeepness.js')).to.eq('../../missing.js');
            done();
          }
        );
      });
    });
  });

  context('by entryOption hook', () => {
    context('force option is true', () => {
      const config = new SymlinkWebpackPlugin({
        origin: 'missingInEntryOption.js',
        symlink: 'forcedForMissing.js',
        force: true,
        hook: 'entryOption',
      });

      it('should not find anything before an intentional hook runs', (done) => {
        const results = {};
        // immediate before entryOption hook
        const inspector = generateHookInspectPlugin('afterEnvironment', () => {
          results.isCreatedSymlink = lstatSync(testDir + '/forcedForMissing.js').isSymbolicLink();
          results.symlinkDestination = readlinkSync(testDir + '/forcedForMissing.js');
        });

        webpack(webpackOption([config, new inspector()]), () => {
          expect(results.isCreatedSymlink).to.eq(undefined);
          done();
        });
      });

      it('should find a symbolic link after an intentional hook runs', (done) => {
        const results = {};
        // immediate after entryOption hook
        const inspector = generateHookInspectPlugin('afterPlugins', () => {
          results.isCreatedSymlink = lstatSync(testDir + '/forcedForMissing.js').isSymbolicLink();
          results.symlinkDestination = readlinkSync(testDir + '/forcedForMissing.js');
        });

        webpack(webpackOption([config, new inspector()]), () => {
          expect(results.isCreatedSymlink).to.eq(true);
          expect(results.symlinkDestination).to.eq('missingInEntryOption.js');
          done();
        });
      });
    });
  });
});
