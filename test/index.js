const { expect } = require('chai');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

const SymlinkWebpackPlugin = require('./../index');
const testDir = path.resolve(__dirname, '../test_dist');
const entryFile = path.resolve(__dirname, './helpers/main.js');

const removeWorkingDir = done => {
  fse.remove(testDir, () => done());
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
    const asArray = new SymlinkWebpackPlugin(
      [{ origin: 'app.js', symlink: 'symlink.js' }]
    );

    it('should make symbolic link', done => {
      webpack(webpackOption(asArray), () => {
        expect(fs.lstatSync(testDir + '/symlink.js').isSymbolicLink()).to.be.true;
        expect(fs.readlinkSync(testDir + '/symlink.js')).to.eq('app.js');
        done();
      });
    });
  });

  context('Configure without array', () => {
    const nonArray = new SymlinkWebpackPlugin(
      { origin: 'app.js', symlink: 'symlinkByNoArray.js' }
    );

    it('should make symbolic link', done => {
      webpack(webpackOption(nonArray), () => {
        expect(fs.lstatSync(testDir + '/symlinkByNoArray.js').isSymbolicLink()).to.be.true;
        expect(fs.readlinkSync(testDir + '/symlinkByNoArray.js')).to.eq('app.js');
        done();
      });
    });

    it('should remove existing link', done => {
      fs.mkdirSync(testDir);
      fs.symlinkSync('unknown.js', testDir + '/symlinkByNoArray.js');
      expect(fs.readlinkSync(testDir + '/symlinkByNoArray.js')).to.eq('unknown.js');

      webpack(webpackOption(nonArray), () => {
        expect(fs.lstatSync(testDir + '/symlinkByNoArray.js').isSymbolicLink()).to.be.true;
        expect(fs.readlinkSync(testDir + '/symlinkByNoArray.js')).to.eq('app.js');
        done();
      });
    });
  });

  it('should not pollute process.cwd()', done => {
      const cwd = process.cwd();

      const plugin = new SymlinkWebpackPlugin(
        [{ origin: 'app.js', symlink: 'symlink.js' }]
      );
      webpack(webpackOption(plugin), () => {
        expect(process.cwd()).to.eq(cwd);
        done();
      });
  });

  context('force option is true', () => {
    const config = new SymlinkWebpackPlugin(
      { origin: 'missing.js', symlink: 'forcedForMissing.js', force: true }
    );

    it('should make symbolic link even if the destination does not exist', done => {
      webpack(webpackOption(config), () => {
        expect(fs.lstatSync(testDir + '/forcedForMissing.js').isSymbolicLink()).to.be.true;
        expect(fs.existsSync(testDir + '/missing.js')).to.eq(false);
        expect(fs.readlinkSync(testDir + '/forcedForMissing.js')).to.eq('missing.js');
        done();
      });
    });

    it('should remove existing link', done => {
      fs.mkdirSync(testDir);
      fs.symlinkSync('app.js', testDir + '/forcedForMissing.js');
      expect(fs.readlinkSync(testDir + '/forcedForMissing.js')).to.eq('app.js');

      webpack(webpackOption(config), () => {
        expect(fs.readlinkSync(testDir + '/forcedForMissing.js')).to.eq('missing.js');
        done();
      });
    });
  });
});
