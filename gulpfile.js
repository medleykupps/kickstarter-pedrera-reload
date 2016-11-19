var gulp=require('gulp');
var sass=require('gulp-sass');
var inject=require('gulp-inject');
var wiredep=require('wiredep').stream;
var del=require('del');
var watch=require('gulp-watch');
var batch=require('gulp-batch');
var server=require('gulp-server-livereload');

gulp.task('clean', function(cb) {
    del(['static'], cb);
});

gulp.task('styles', function() {
    var injectFiles=gulp.src('src/css/_*.scss', {read:false});
    var transform = function(filepath) { return '@import "' + filepath + '";'; };
    return gulp.src('src/css/main.scss')
        .pipe(wiredep())
        .pipe(
            inject(
                gulp.src('src/css/global/*.scss', {read:false}), {
                    transform: transform,
                    starttag: '// inject:global',
                    endtag: '// endinject',
                    addRootSlash: false
                }
            )
        )
        .pipe(
            inject(
                injectFiles, {
                    transform: transform,
                    starttag: '// inject:app',
                    endtag: '// endinject',
                    addRootSlash: false
                }
            )
        )
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

gulp.task('watch', function() {
    watch('./src/**/*.*', batch(function(events, done) {
        gulp.start('html', done);
    }));
});

gulp.task('webserver', ['watch'], function() {
    gulp.src('static')
        .pipe(server({            
            livereload: true,
            directoryListing: false,
            open: true
        }));
});

gulp.task('default', ['clean', 'html']);
