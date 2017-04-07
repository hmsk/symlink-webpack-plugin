import { expect } from 'chai';
import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import fse from 'fs-extra'

const SymlinkWebpackPlugin = require('./../dist/index');
const testDir = path.resolve(__dirname, '../test_dist');

const webpackOption = (plugin) => {
  return {
    entry: {
      app: './test/helpers/main.js'
    },
    output: {
      path: testDir,
      filename: '[name].js'
    },
    plugins: [plugin]
  }
};

context('With typical setting', () => {
  beforeEach((done) => fse.remove(testDir, (err) => done()));

  const typical = new SymlinkWebpackPlugin([
    { origin: 'app.js', symlink: 'symlink.js' }
  ]);


  it('should make symbolic link', (done) => {
    webpack(webpackOption(typical)).run((err, stats) => {
      expect(fs.readlinkSync(testDir + '/symlink.js')).to.eq('app.js');
      expect(fs.lstatSync(testDir + '/symlink.js').isSymbolicLink()).to.be.true;
      done();
    });
  });
});
