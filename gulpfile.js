var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminZopfli = require('imagemin-zopfli');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminGiflossy = require('imagemin-giflossy');
var notifier = require('node-notifier');
var runSequence = require('run-sequence');

var paths = {
  srcIMAGES: "src/**",
  distIMAGES: "dist"
}

gulp.task('optimize', function () {
  return gulp.src(paths.srcIMAGES)
    .pipe(imagemin([
      //png
      imageminPngquant({
        speed: 1,
        quality: 80 //lossy settings
      }),
      imageminZopfli({
        more: true
      }),
      //gif
      // imagemin.gifsicle({
      //     interlaced: true,
      //     optimizationLevel: 3
      // }),
      //gif very light lossy, use only one of gifsicle or Giflossy
      imageminGiflossy({
        optimizationLevel: 3,
        optimize: 3, //keep-empty: Preserve empty transparent frames
        lossy: 2
      }),
      //svg
      imagemin.svgo({
        plugins: [{
          removeViewBox: false
        }]
      }),
      //jpg lossless
      imagemin.jpegtran({
        progressive: true
      }),
      //jpg very light lossy, use vs jpegtran
      imageminMozjpeg({
        quality: 80
      })
    ]))
    .pipe(gulp.dest(paths.distIMAGES))
});


gulp.task('notify', function () {
  notifier.notify({
    title: 'Image Optimization',
    message: 'Assests optimized successfully'
  })
});

gulp.task('default', function (callback) {
  runSequence('optimize', 'notify');
});
