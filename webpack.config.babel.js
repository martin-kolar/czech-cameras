import webpack from 'webpack';
import RevisionPlugin from 'manifest-revision-webpack-plugin';

try {
  var local = require('./src/local.js');
}
catch(err) {
  // default nastaveni pro server, kde nebude local.js
  var local = {
    production: true
  }
}

let webpackPlugins = [];

webpackPlugins.push(new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(cs)$/));

if (local.production) {
  webpackPlugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: !local.production,
    output: {
      comments: !local.production,
      beautify: !local.production
    }
  }));
}

webpackPlugins.push(new RevisionPlugin('./js/js-manifest.json', {
  rootAssetPath: './js/webpack/'
}));


module.exports = {
  entry: {
    bundle: [__dirname + '/js/webpack/scripts.js'] // 'babel-polyfill'
  },
  output: {
    path: __dirname + '/js/webpack/preload/',
    publicPath: 'js/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].bundle.js'
  },
  devtool: 'source-map',
  plugins: webpackPlugins
};
