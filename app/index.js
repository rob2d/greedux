// our base generator file;
// see Yeoman documentation for details:
// http://yeoman.io/authoring/

const GLOB_OPTS = { globOptions : true };

var Generator = require('yeoman-generator');

module.exports = class extends Generator
{
    app ()
    {
        this.copy('./.gitignore', './.gitignore');
        this.copy('./gulpfile.js', './gulpfile.js');
        this.copy('./src/build-config/**/*.*', './src/build-config/**/*.*', GLOB_OPTS);
        this.copy('./src/js/**/*.*', './src/js/**/*.*', GLOB_OPTS);
        this.copy('./dist/src/index.html', './dist/src/index.html', GLOB_OPTS);
        this.copy('./dist/src/css/**/*.*', './dist/src/css/**/*.*', GLOB_OPTS);
        this.copy('./dist/fonts/fonts/**/*.*', './dist/src/fonts/**/*.*', GLOB_OPTS);
    }
};