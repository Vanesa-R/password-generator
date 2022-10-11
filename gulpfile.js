/* Genéricas */
const { src, dest, series, parallel } = require('gulp');
// const del = require("del");
const plumber = require("gulp-plumber");
// /*Para tareas html */
const htmlmin = require("gulp-htmlmin")
// /*Para tareas  css */
const sass = require("gulp-dart-sass");
const autoprefixer = require ("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
/* Para tareas js*/
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
/* Para assets*/
const imagemin = require("gulp-imagemin");


// HTML
const html = done => {
    src("./index.html")
    .pipe(plumber())
    .pipe(htmlmin({
        collapseWhitespace: true 
    }))
    .pipe(dest("dist"));
    done()
}

// CSS
const css = done => {
    src("app/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(cssnano())
    .pipe(rename({
        suffix: ".min",
        extname: ".css"
    }))
    .pipe(dest("dist/css"));
    done()
};

// JAVASCRIPT
const js = done => {
    src("app/js/*.js")
    .pipe(plumber())
    .pipe(concat("app.js"))
    .pipe(babel())
    .pipe(terser())
    .pipe(dest("dist/js"));
    done() 
}

// IMÁGENES
const images = done => {
    src("app/images/**/*")
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(dest("dist/images"))
    done();
}


//Borrar ficheros no definitivos de la carpeta dist
// gulp.task("clean", function(){
//     return del("dist");
// });



// PROCESO COMPLETO AUTOMATIZADO

// gulp.task("package", 
//     gulp.series("clean", 
//     gulp.parallel ("html", "css", "js"), 
//     "images"));


exports.package = series(parallel(html, css, js), images)