// our base generator file;
// see Yeoman documentation for details:
// http://yeoman.io/authoring/

const ENABLE_GLOBBING = { globOptions : true };

var Generator = require('yeoman-generator');

module.exports = class extends Generator
{
    app ()
    {
        let srcPath = this.sourceRoot(),
            destPath = this.destinationPath();

        //TODO : DRY

        this.fs.copy(
            srcPath+'/.gitignore',
            destPath + '/.gitignore'
        );
        this.fs.copy(
            srcPath+'/gulpfile.js',
            destPath+'/gulpfile.js'
        );
        this.fs.copy(
            srcPath+'/build-config/*.*',
            destPath +'/build-config',
            ENABLE_GLOBBING
        );
        this.fs.copy(
            srcPath+'/src/js/**/*.*',
            destPath +'/src/js/',
            ENABLE_GLOBBING
        );
        this.fs.copy(
            srcPath+'/dist/src/index.html',
            destPath + '/dist/src/index.html'
        );
        this.fs.copy(
            srcPath+'/dist/src/css/**/*.*',
            destPath + '/dist/src/css/',
            ENABLE_GLOBBING
        );
        this.fs.copy(
            srcPath+'/dist/src/fonts/**/*.*',
            destPath + '/dist/src/css/fonts ',
            ENABLE_GLOBBING
        );
    }
};