module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      core: {
        files: 'Compass-Common/models/**',
        tasks: ['copy:core'],
        options: {dot: true}
      },
      pkg: {
        files: 'Compass-Common/scripts/pkg/quill.js',
        tasks: ['copy:pkg']
      },
      lib: {
        files: 'Compass-Common/scripts/lib/*.js',
        tasks: ['concat']
      },
    },

    copy: {
      core: {
        files: [
          {expand: true, cwd: 'Compass-Common/', src: ['**'], dot: true, dest: 'Compass/core/'},
          {expand: true, cwd: 'Compass-Common/', src: ['**'], dot: true, dest: 'Compass-API/core/'}
        ]
      },
      pkg: {
        files: [
          {
            src: ['Compass-Common/scripts/pkg/quill.js'],
            dest: 'Compass/app/assets/javascripts/quill.js'
          },
          {
            src: ['Compass-Common/scripts/pkg/quill.js'],
            dest: 'Quill-Lessons/app/assets/javascripts/quill.js'
          }
        ]
      }
    },

    concat: {
      lib: {
        files: [{
          src: ['Compass-Common/scripts/lib/*.js'],
          dest: 'Compass-Common/scripts/pkg/quill.js'
        }]
      }
    }

  });

  grunt.registerTask('build', ['concat','copy:pkg']);
  grunt.registerTask('default', ['build','copy']);

  grunt.event.on('watch', function (action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });
};
