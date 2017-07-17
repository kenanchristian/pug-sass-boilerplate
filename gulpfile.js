var ngrok = require('ngrok');
var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var pug = require('gulp-pug');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

gulp.task('templates', function() {
  return gulp.src(['./src/templates/*.pug','!./src/templates/_*.pug'])
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('template-watch',['templates'], function(){
  browserSync.reload();
  return;
});

gulp.task('templates-prod', function() {
  return gulp.src(['./src/templates/*.pug','!./src/templates/_*.pug'])
    .pipe(plumber())
    .pipe(pug({
      pretty: false
    }))
    .pipe(gulp.dest('./dist/'))
});

//STYLE
gulp.task('style', function () {
  return gulp
    .src(['./src/sass/*.sass'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
        errLogToConsole: true,
        outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
        browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    }))
    .pipe(gulp.dest('./dist/assets/css/'))
    .pipe(browserSync.stream());
});

gulp.task('style-prod',function(){
      return gulp.src(['./src/sass/*.sass'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle:compressed
    }))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/assets/css/'));
});


gulp.task('script', function () {
  return gulp.src('src/js/*.js')
    .pipe(plumber())
    .pipe(gulp.dest('./dist/assets/js/'))
});

gulp.task('script-watch',['script'], function(){
  browserSync.reload();
  return;
});

//SCRIPTS
gulp.task('script-prod', function () {
  return gulp.src('src/js/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/js/'))
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        },
        reloadDelay: 500
    },function(err,bs){
      if(err){
        console.log(err);
      }
      ngrok.connect(bs.options.get('port'), function (err, url) {
        console.log("[NGROK] Ngrok URL: "+url);
      });
    });
});

gulp.task('watch', function() {
  gulp.watch([ 'src/templates/**/*.pug', 'src/templates/*.pug' ], ['template-watch']);
  gulp.watch(['src/sass/*.sass', 'src/sass/**/*.sass'], ['style']);
  gulp.watch(['src/js/*.js'], ['script-watch']);
});

gulp.task('default',['templates','style','script','browser-sync','watch']);
