const { src, dest, watch, series } = require('gulp')

const pug = require('gulp-pug')
const sass = require('gulp-sass')
const prettier = require('gulp-prettier');

const browserSync = require('browser-sync').create()


// Compile pug files into HTML
function pages() {
  return src('src/pug/pages/*.pug')
    .pipe(pug())
    .pipe(prettier({ singleQuote: true }))
    .pipe(dest('dist'))
}

// Compile sass files into CSS
function styles() {
  return src('src/scss/main.scss')
    .pipe(sass({
      includePaths: ['src/scss'],
      errLogToConsole: true,
      outputStyle: 'compressed',
      onError: browserSync.notify
    }))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream())
}

// Copy assets
function assets() {
  return src('src/assets/**/*')
    .pipe(dest('dist/'))
}

// Serve and watch sass/pug files for changes
function watchAndServe() {
  browserSync.init({
    server: 'dist',
  })

  watch('src/scss/**/*.scss', styles)
  watch('src/pug/**/*.pug', pages)
  watch('src/assets/**/*', assets)
  watch('dist/*.html').on('change', browserSync.reload)
}


exports.pages = pages
exports.styles = styles
exports.watch = watchAndServe
exports.default = series(pages, styles, assets, watchAndServe)
