'use strict';

module.exports = function(grunt) {
 //  var hljs = require('highlight.js');
	// hljs.LANGUAGES['scss'] = require('./lib/scss.js')(hljs);	
	
	grunt.loadNpmTasks('assemble');
  require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		app: 'app',
		dist: 'dist',

		sass: {
			options: {
				includePaths: ['<%= app %>/bower_components/foundation/scss']
			},
			dist: {
				options: {
					outputStyle: 'extended'
				},
				files: {
					'<%= app %>/css/app.css': '<%= app %>/scss/app.scss'
				}
			}
		},


		assemble: {
		  options: {
        // marked: {
        //   highlight: function(code, lang) {
        //     if (lang === undefined) lang = 'bash';
        //     if (lang === 'html') lang = 'xml';
        //     if (lang === 'js') lang = 'javascript';
        //     return '<div class="code-container">' + hljs.highlight(lang, code).value + '</div>';
        //   }
        // },		  	
		    assets: '<%= app %>/templates/assets',
		    partials: ['<%= app %>/templates/partials/**/*.hbs'],
		    layout: 'default.hbs',
		    layoutdir: '<%= app %>/templates/layouts'
		  },
		  dist: {
		  	expand: true,
		  	cwd: '<%= app %>/templates/pages',
		    src: '**/*.hbs',
		    dest: 'app'		  	
		  }
		},
		

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'<%= app %>/js/**/*.js'
			]
		},

		clean: {
			dist: {
				src: ['<%= dist %>/*']
			},
		},
		copy: {
			dist: {
				files: [{
					expand: true,
					cwd:'<%= app %>/',
					src: ['fonts/**', '**/*.html', '!**/*.scss', '!bower_components/**'],
					dest: '<%= dist %>/'
				} , {
					expand: true,
					flatten: true,
					src: ['<%= app %>/bower_components/font-awesome/fonts/**'],
					dest: '<%= dist %>/fonts/',
					filter: 'isFile'
				} ]
			},
		},

		imagemin: {
			target: {
				files: [{
					expand: true,
					cwd: '<%= app %>/images/',
					src: ['**/*.{jpg,gif,svg,jpeg,png}'],
					dest: '<%= dist %>/images/'
				}]
			}
		},

		uglify: {
			options: {
				preserveComments: 'some',
				mangle: false
			}
		},

		useminPrepare: {
			html: ['<%= app %>/index.html'],
			options: {
				dest: '<%= dist %>'
			}
		},

		usemin: {
			html: ['<%= dist %>/**/*.html', '!<%= app %>/bower_components/**'],
			css: ['<%= dist %>/css/**/*.css'],
			options: {
				dirs: ['<%= dist %>']
			}
		},

		watch: {
			grunt: {
				files: ['Gruntfile.js'],
				tasks: ['sass']
			},
			sass: {
				files: '<%= app %>/scss/**/*.scss',
				tasks: ['sass']
			},
		  assemble: {
		   files: ['<%= app %>/templates/**/*.hbs'],
		   tasks: ['assemble']
		  },
			livereload: {
				files: ['<%= app %>/**/*.html', '!<%= app %>/bower_components/**', '<%= app %>/js/**/*.js', '<%= app %>/css/**/*.css', '<%= app %>/images/**/*.{jpg,gif,svg,jpeg,png}'],
				options: {
					livereload: true
				}
			}
		},

		connect: {
			app: {
				options: {
					port: 9000,
					base: '<%= app %>/',
					open: true,
					livereload: true,
					hostname: '127.0.0.1'
				}
			},
			dist: {
				options: {
					port: 9001,
					base: '<%= dist %>/',
					open: true,
					keepalive: true,
					livereload: false,
					hostname: '127.0.0.1'
				}
			}
		},

		wiredep: {
			target: {
				src: [
					'<%= app %>/**/*.hbs'
				],
				exclude: [
					'modernizr',
					'font-awesome',
					'jquery-placeholder',
					'foundation'
				]
			}
		}

	});

	
	grunt.registerTask('compile-sass', ['sass']);
	grunt.registerTask('bower-install', ['wiredep']);
	
	grunt.registerTask('default', ['compile-sass', 'bower-install', 'connect:app', 'watch', 'assemble']);
	grunt.registerTask('validate-js', ['jshint']);
	grunt.registerTask('server-dist', ['connect:dist']);
	
	grunt.registerTask('publish', ['compile-sass', 'clean:dist', 'validate-js', 'useminPrepare', 'copy:dist', 'newer:imagemin', 'concat', 'cssmin', 'uglify', 'usemin']);

	grunt.registerTask('ass', ['assemble']);

};
