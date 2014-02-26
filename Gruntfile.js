module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      core: {
        files: 'core/models/**',
        tasks: ['copy:core'],
        options: {dot: true}
      },
      pkg: {
        files: 'core/scripts/pkg/quill.js',
        tasks: ['copy:pkg']
      },
      lib: {
        files: 'core/scripts/lib/*.js',
        tasks: ['concat']
      },
    },

    copy: {
      core: {
        files: [
          {expand: true, src: ['core/models/**'], dot: true, dest: 'quill/'},
          {expand: true, src: ['core/models/**'], dot: true, dest: 'api/'}
        ]
      },
      pkg: {
        files: [
          {
            src: ['core/scripts/pkg/quill.js'],
            dest: 'quill/app/assets/javascripts/quill.js'
          },
          {
            src: ['core/scripts/pkg/quill.js'], 
            dest: 'questions-module/app/assets/javascripts/quill.js'
          }
        ]
      }
    },

    concat: {
      lib: {
        files: [{
          src: ['core/scripts/lib/*.js'],
          dest: 'core/scripts/pkg/quill.js'
        }]
      }
    },

  });

  grunt.registerTask('build', ['concat','copy:pkg']);
  grunt.registerTask('default', ['build','copy']);

  grunt.event.on('watch', function (action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });
};
