module.exports = function (grunt) {
    grunt.initConfig({
        watch: {
            css: {
                files: 'scss/**/*.scss',
                tasks: ['sass']
            },
            js: {
                files: 'js/*.js',
                tasks: ['concat']
            }
        },
        sass: {
            dev: {
                files: {
                    'css/main.css': 'scss/main.scss'
                }
            }
        },
        concat: {
            dist: {
                src: ['./js/*.js'],
                dest: './app.js',
            },
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'css/*.css',
                        '*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: '.'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');

    grunt.registerTask('default', ['browserSync', 'watch']);
};