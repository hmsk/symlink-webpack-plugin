import { expect } from 'chai';
import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import fse from 'fs-extra'

const SymlinkWebpackPlugin = require('./../dist/index');
const testDir = path.resolve(__dirname, '../test_dist');

const webpackOption = (plugin, name) => {
  let config = {
    entry: {
    },
    output: {
      path: testDir,
      filename: '[name].js'
    },
    plugins: [plugin]
  };

  // Reuse same webpack instance, updating entry.name manually
  config.entry[name] = path.resolve(__dirname, './helpers/main.js');
  config.output.filename = name + '.js';
  return config;
};

describe('SymlinkWebpackPlugin', () => {
  beforeEach((done) => fse.remove(testDir, (err) => done()));

  context('Configure with array', () => {
    const asArray = new SymlinkWebpackPlugin([
      { origin: 'withArray.js', symlink: 'symlink.js' }
    ]);

    it('should make symbolic link', (done) => {
      webpack(webpackOption(asArray, 'withArray')).run((err, stats) => {
        expect(fs.readlinkSync(testDir + '/symlink.js')).to.eq('withArray.js');
        expect(fs.lstatSync(testDir + '/symlink.js').isSymbolicLink()).to.be.true;
        done();
      });
    });
  });

  context('Configure without array', () => {
    const nonArray = new SymlinkWebpackPlugin(
      { origin: 'noArray.js', symlink: 'symlink.js' }
    );

    it('should make symbolic link', (done) => {
      webpack(webpackOption(nonArray, 'noArray')).run((err, stats) => {
        console.log(stats.compilation);
        expect(fs.readlinkSync(testDir + '/symlink.js')).to.eq('noArray.js');
        expect(fs.lstatSync(testDir + '/symlink.js').isSymbolicLink()).to.be.true;
        done();
      });
    });
  });
});
