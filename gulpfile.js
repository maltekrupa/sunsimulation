var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
    browserSync.init(["*.html", "css/*.css", "js/*.js"], {
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('default', ['browser-sync']);
