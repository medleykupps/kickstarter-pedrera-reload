var gulp=require('gulp');
var sass=require('gulp-sass');
var inject=require('gulp-inject');
var wiredep=require('wiredep').stream;

gulp.task('styles', function() {
    var injectFiles=gulp.src('src/css/_*.scss', {read:false});
    return gulp.src('src/css/main.scss')
        .pipe(wiredep())
        .pipe(inject(injectFiles, {
            transform: function(filepath) {
                return '@import "' + filepath + '";';
            },
            starttag: '// inject:app',
            endtag: '// endinject',
            addRootSlash: false
        }))
        .pipe(sass())
        .pipe(gulp.dest('static/css'));
});

gulp.task('html', ['styles'], function() {
    var injectFiles=gulp.src(['static/css/main.css']);    
    return gulp.src('src/index.html')
        .pipe(inject(injectFiles, {
            addRootSlash: false,
            ignorePath: ['src','static']
        }))
        .pipe(gulp.dest('static'));
});
