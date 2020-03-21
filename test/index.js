const { resolve } = require('path');
const { existsSync, lstatSync, mkdirSync, readlinkSync, symlinkSync } = require('fs');
const { expect } = require('chai');
const webpack = require('webpack');
const { remove } = require('fs-extra');

const SymlinkWebpackPlugin = require('./../index');
const testDir = resolve(__dirname, '../test_dist');
const entryFile = resolve(__dirname, './helpers/main.js');

const removeWorkingDir = done => {
  remove(testDir, () => done());
};

const webpackOption = plugin => ({
  entry: {
    app: entryFile
  },
  output: {
    path: testDir,
    filename: '[name].js'
  },
  plugins: [plugin]
});

describe('SymlinkWebpackPlugin', () => {
  beforeEach(removeWorkingDir);
  afterEach(removeWorkingDir);

  context('Configure with array', () => {
    const asArray = new SymlinkWebpackPlugin([{ origin: 'app.js', symlink: 'symlink.js' }]);

    it('should make symbolic link', done => {
      webpack(webpackOption(asArray), () => {
        expect(lstatSync(testDir + '/symlink.js').isSymbolicLink()).to.be.true;
        expect(readlinkSync(testDir + '/symlink.js')).to.eq('app.js');
        done();
      });
    });
  });

  context('Configure without array', () => {
    const nonArray = new SymlinkWebpackPlugin({
      origin: 'app.js',
      symlink: 'symlinkByNoArray.js'
    });

    it('should make symbolic link', done => {
      webpack(webpackOption(nonArray), () => {
        expect(lstatSync(testDir + '/symlinkByNoArray.js').isSymbolicLink()).to.be.true;
        expect(readlinkSync(testDir + '/symlinkByNoArray.js')).to.eq('app.js');
        done();
      });
    });

    it('should remove existing link', done => {
      mkdirSync(testDir);
      symlinkSync('unknown.js', testDir + '/symlinkByNoArray.js');
      expect(readlinkSync(testDir + '/symlinkByNoArray.js')).to.eq('unknown.js');

      webpack(webpackOption(nonArray), () => {
        expect(lstatSync(testDir + '/symlinkByNoArray.js').isSymbolicLink()).to.be.true;
        expect(readlinkSync(testDir + '/symlinkByNoArray.js')).to.eq('app.js');
        done();
      });
    });
  });

  it('should not pollute process.cwd()', done => {
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
      force: true
    });

    it('should make symbolic link even if the destination does not exist', done => {
      webpack(webpackOption(config), () => {
        expect(lstatSync(testDir + '/forcedForMissing.js').isSymbolicLink()).to.be.true;
        expect(existsSync(testDir + '/missing.js')).to.eq(false);
        expect(readlinkSync(testDir + '/forcedForMissing.js')).to.eq('missing.js');
        done();
      });
    });

    it('should remove existing link', done => {
      mkdirSync(testDir);
      symlinkSync('app.js', testDir + '/forcedForMissing.js');
      expect(readlinkSync(testDir + '/forcedForMissing.js')).to.eq('app.js');

      webpack(webpackOption(config), () => {
        expect(readlinkSync(testDir + '/forcedForMissing.js')).to.eq('missing.js');
        done();
      });
    });
  });
});
