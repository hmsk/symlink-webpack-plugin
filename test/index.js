import { expect } from 'chai';
import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import fse from 'fs-extra'

const SymlinkWebpackPlugin = require('./../dist/index');
const testDir = path.resolve(__dirname, '../test_dist');
const entryFile = path.resolve(__dirname, './helpers/main.js');

const removeWorkingDir = (done) => {
  fse.remove(testDir, (err) => done());
};

const webpackOption = (plugin) => {
  return {
    entry: {
      app: entryFile
    },
    output: {
      path: testDir,
      filename: '[name].js'
    },
    plugins: [plugin]
  };
};

describe('SymlinkWebpackPlugin', () => {
  beforeEach(removeWorkingDir);
  afterEach(removeWorkingDir);

  context('Configure with array', () => {
    const asArray = new SymlinkWebpackPlugin(
      [{ origin: 'app.js', symlink: 'symlink.js' }]
    );

    it('should make symbolic link', (done) => {
      webpack(webpackOption(asArray)).run((err, stats) => {
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

    it('should make symbolic link', (done) => {
      webpack(webpackOption(nonArray)).run((err, stats) => {
        expect(fs.lstatSync(testDir + '/symlinkByNoArray.js').isSymbolicLink()).to.be.true;
        expect(fs.readlinkSync(testDir + '/symlinkByNoArray.js')).to.eq('app.js');
        done();
      });
    });
  });
});
