var gulp = require("gulp");
var plugins = require("gulp-load-plugins")({
    pattern:['gulp-*', 'gulp.*'],
    camelize: true,
    replaceString:/^gulp(-|\.)/,
    rename:{
        
    }
});

var assetsDev = 'public/assets/';
var assetsProd = 'public/src/';

var appDev = 'public/dev/';
var appProd = 'public/app/';

var tsProject = plugins.typescript.createProject('tsconfig.json');

gulp.task('build-css', function(){
    return gulp.src(assetsDev + 'scss/*.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.scss({}).on('error', plugins.scss.logError))
        .pipe(plugins.sourcemaps.write())
        .pipe(plugins.autoprefixer({
            browsers:['last 3 versions'],
            cascade: false
        }))
        .pipe(plugins.cleanCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(assetsProd + 'css/');
});

gulp.task('build-ts', function(){
    return gulp.src(appDev + '**/*.ts')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.typescript(tsProject))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(appProd));
});

gulp.task('bundle-ts', ['build-ts'], function(){
    var path = require('path');
    var Builder = require('systemjs-builder');
    
    var builder = new Builder('', 'systemjs.config.js');
    
    builder
        .buildStatic('app/boot.js', 'app/bundle.js', {minify:true, sourceMap:true})
        .then(function(){
            console.log('Build completed');
        })
        .catch(function(error){
            console.log('Build Error');
            console.log(error);
        })
});

gulp.task('watch', function(){
    
});

gulp.task('default',['watch', 'build-ts', 'bundle-ts', 'build-css']);