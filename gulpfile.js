'use strict';

// Плагины
const gulp         = require('gulp'),
      autoprefixer = require('autoprefixer'),
      postcss      = require('gulp-postcss'),
      pug          = require('gulp-pug'),
      plumber      = require('gulp-plumber'),
      del          = require('del'),
      rename       = require("gulp-rename"),
      sass         = require('gulp-sass'),
      cleanCSS     = require('gulp-clean-css'),
      csscomb      = require('gulp-csscomb'),
      browserSync  = require('browser-sync'),
      reload       = browserSync.reload;


// Настройки путей
const path = {
  build: {
      html: 'build/',
      css: 'build/css/',
      style: ['build/css/*.css', '!build/css/*.min.css']
  },
  src: {
      html: 'src/index.pug',
      style: 'src/style/*.scss'
  },
  watch: {
      html: 'src/**/*.pug',
      style: 'src/style/**/*.scss'
  },
  clean: 'build'
};

const configServer = {
  server: {
    baseDir: "./build"
  },
  tunnel: false,
  notify: false,
  host: 'localhost',
  port: 9000,
  logPrefix: "Frontend"
};


// Запуск BrowserSync
function webserver(done) {
  browserSync(configServer);
  done();
}

// Очищаем папки
function clean(done) {
  del.sync(path.clean);
  done();
}

// Собираем HTML
function html(done) {
  gulp.src(path.src.html)
  .pipe(plumber())
  .pipe(pug())
  .pipe(gulp.dest(path.build.html))
  .pipe(reload({stream: true}));

  done();
}

// Собираем CSS
function css(done) {
  gulp.src(path.src.style)
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([ autoprefixer() ]))
  .pipe(csscomb())
  .pipe(gulp.dest(path.build.css))
  .pipe(reload({stream: true}));

  done();
}

function cssMin(done) {
  gulp.src(path.src.style)
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([ autoprefixer() ]))
  .pipe(cleanCSS())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest(path.build.css))
  .pipe(reload({stream: true}));

  done();
}

// Следим за изменениями
function watchFiles(done) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.style], css);

  done();
}


const start = gulp.series(clean, html, css, webserver, watchFiles);
const build = gulp.series(clean, html, css, cssMin);

exports.default = start;
exports.build = build;
