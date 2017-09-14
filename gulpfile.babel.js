import gulp from 'gulp';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import chalk from 'chalk';
import notifier from 'node-notifier';
import plumber from 'gulp-plumber';
import precss from 'precss';
import postcssMixins from 'postcss-mixins';
import nano from 'gulp-cssnano';
import lec from 'gulp-line-ending-corrector';
import postcssCssNext from 'postcss-cssnext';
import run from 'run-sequence';
import rimraf from 'rimraf';
import gutil from 'gulp-util';
import browserSync from 'browser-sync';
import watch from 'gulp-watch';
import rev from 'gulp-rev';
import babel from 'gulp-babel';
import webpackConfig from './webpack.config.babel';
import webpack from 'webpack';
import gulpif from 'gulp-if';

try {
  var local = require('./src/local.js');
}
catch(err) {
  // default nastaveni pro server, kde nebude local.js
  var local = {
    production: false
  }
}

const paths = {
  watch: {
    css: './src/css/**/*.css',
    js: './src/js/**/*.js'
  },
  compile: {
    css: './src/css/*.css',
  },
  destination: {
    css: './css',
    js: './js/webpack'
  }
};

// default task
gulp.task('default', cb => {
  run('build:css', 'build:js', 'watch', cb);
});

// build task
gulp.task('build', cb => {
  run('build:css', 'build:js', cb);
});

// kompilace CSS
gulp.task('build:css', cb => {
  run('clean:css', 'compile:styles', cb);
});

gulp.task('clean:css', cb => {
  rimraf(paths.destination.css, cb);
});

gulp.task('compile:styles', () => {
  let processors = [
    precss,
    postcssMixins,
  ];

  // produkcni kompilace CSS
  if (local.production) {
    processors.push(postcssCssNext);
  }

  gulp.src(paths.compile.css)
    .pipe(plumber({errorHandler: swallowError}))
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(plumber.stop())
    .pipe(gulpif(local.production, nano()))
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.destination.css))
    .pipe(rev.manifest('css-manifest.json'))
    .pipe(gulp.dest(paths.destination.css))
    .pipe(browserSync.stream())
    .pipe(lec({eolc: 'LF', encoding: 'utf8'}));
});

// kompilace JS
gulp.task('server', cb => {
  run('build:js', 'webpack-dev-server', cb);
});

gulp.task('build:js', cb => {
  run('clean:js', 'babel', 'webpack', cb);
});

gulp.task('clean:js', cb => {
  rimraf(paths.destination.js, cb);
});

gulp.task('babel', () => {
  return gulp.src(paths.watch.js)
    .pipe(plumber({errorHandler: swallowError}))
    .pipe(babel())
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.destination.js));
});

gulp.task('webpack', cb => {
  let config = Object.create(webpackConfig);

  webpack(config, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    gutil.log('[webpack]', stats.toString({
      colors: true,
      progress: true
    }));

    cb();
    browserSync.reload();
  });
});

gulp.task('webpack-dev-server', cb => {
  let myConfig = Object.create(webpackConfig);
  myConfig.devtool = 'eval';
  myConfig.debug = true;

  new webpackDevServer(webpack(myConfig), {
    publicPath: '/' + myConfig.output.publicPath,
    stats: {
      colors: true
    },
    hot: true
  }).listen(8080, 'localhost', err => {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }

    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
  });
});

// watch task
gulp.task('watch', () => {
  watch(paths.watch.css, () => {
    gulp.start('build:css');
  });

  watch(paths.watch.js, () => {
    gulp.start('build:js');
  });

  // livepreview
  if (!local.production) {
    browserSync.create();
    browserSync.init({proxy: local.browsersync.url});
  }
});

// pomocne funkce
let swallowError = error => {
  gutil.log(error.message);
  // notify.onError(`Error: ${error.message}`);
  sendNotify('Gulp ERROR:', chalk.stripColor(error.message));
}

let sendNotify = (title, message) => {
  notifier.notify({ title, message });
}

let getNotifyTime = () => {
  var d = new Date;

  return [d.getHours(), d.getUTCMinutes() < 10 ? ('0' + d.getUTCMinutes()) : d.getUTCMinutes(), d.getUTCSeconds() < 10 ? ('0' + d.getUTCSeconds()) : d.getUTCSeconds()].join(':');
}
