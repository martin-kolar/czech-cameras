var local = require('./local');

module.exports = {
  postcssenabled: true,
  compassenabled: false,
  webpackenabled: true,
  paths: {
    watch: {
      css: './../src/css/**/*.css',
      js: './../src/js/**/*.js',
      svg: './../../src/svg-orig/*.svg',
      critical: './../../src/critical/'
    },
    dest: {
      css: './../dest/css',
      js: './../dest/js/webpack',
      images: './../images/sprites',
      svg: './../src/svg'
    },
    absolutePath: local.absolutePath
  },
  browsersync: {
    enable: true,
    url: local.domain
  },
  spritesGroup: function(image) {
    return Promise.reject();
  },
  compass: {
    config_file: '',
    css: '',
    sass: '',
    image: '',
    sourcemap: true
  },
  webpack: {
    entry: '/../../dest/js/webpack/scripts.js',
    output: {
      path: __dirname + '/../dest/js/webpack/preload/',
      publicPath: 'js/',
      filename: '[name].[hash].js',
      chunkFilename: '[id].bundle.js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader?-babelrc,+cacheDirectory,presets[]=latest,presets[]=stage-0'
        }
      ]
    },
    plugins: {
      ContextReplacementPlugin: true,
      UglifyJsPlugin: true,
      UglifyJsPluginSourceMaps: true,
      RevisionPlugin: true,
      RevisionPluginDir: '/../../dest/js-manifest.json',
      rootAssetPath: '/../../dest/js/webpack/preload/'
    }
  }
};
