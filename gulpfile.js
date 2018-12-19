const gulp = require("gulp");
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const notifier = require('node-notifier');





sass.compiler = require('node-sass');

function showError(err) {
    notifier.notify({
        title: 'Błąd SASS',
        message: err.messageFormatted
    });
      
    console.log(err.messageFormatted);
    this.emit("end");
}

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./development"
        },
        notify: false, //czy pokazywać tooltipa
        //host: "192.168.0.24", //IPv4 Address Wirless LAN adapter WiFi from ipconfig
        //port: 3000, //port na którym otworzy
        //browser: "google chrome" //jaka przeglądarka ma być otwierana - zaleznie od systemu - https://stackoverflow.com/questions/24686585/gulp-browser-sync-open-chrome-only
    });
});


gulp.task('sass', function () {
    //funkcja zadeklarowana wyzej. Nawiasy klamrowe bo beda jakies opcje w srodku
    return gulp.src('./development/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "expanded"
        }).on('error', showError)) 
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('./development/css'))
        .pipe(browserSync.stream()); 
});

gulp.task("watch", function () {
    gulp.watch("./development/scss/**/*.scss", ['sass']);
    gulp.watch("./development/*.html").on('change', browserSync.reload);
    gulp.watch("./development/js/*.js").on('change', browserSync.reload);
});

gulp.task("default", function () {
    console.log("<========Zaczynam rzeźbić==========!@#$$%%");
    gulp.start(["browser-sync", "sass", "watch"]);
});