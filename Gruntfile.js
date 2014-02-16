module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      core: {
        files: 'core/**',
        tasks: ['copy'],
        options: {
          dot: true
        }
      }
    },

    copy: {
      copycore: {
        files: [
          {expand: true, src: ['core/**'], dot: true, dest: 'quill/'},
          {expand: true, src: ['core/**'], dot: true, dest: 'api/'},
          {expand: true, cwd: 'core/scripts', src: 'quill.js', dest:            'quill/app/assets/javascripts', filter: 'isFile'},
          {expand: true, cwd: 'core/scripts', src: 'quill.js', dest: 'questions-module/app/assets/javascripts', filter: 'isFile'}
        ]
      }
    }
  });

  grunt.event.on('watch', function (action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });
};
