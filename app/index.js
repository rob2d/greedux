// our base generator file;
// see Yeoman documentation for details on configuration:
// http://yeoman.io/authoring/
var path  = require('path');
var fs = require('fs');
var Generator = require('yeoman-generator');

const ENABLE_GLOBBING = { globOptions : true };


/**
 * A class extended directly from
 * a generator but not imported;
 * contains our helpful methods
 *
 * [just an opinionated alternative
 * to prefixing helpers with _s]
 */
class BaseGenerator extends Generator
{
    constructor(args, opts)
    {
        super(args, opts);

        this.sourceRoot(path.join(__dirname, 'templates'));
    }
    copyFromTemplate (filePattern, useGlob)
    {
        let globOptions = Object.assign({}, { dot : true }, useGlob ? ENABLE_GLOBBING : {});

        if(!useGlob)
        {
            this.fs.copy(
                this.templatePath(filePattern),
                this.destinationPath(filePattern),
                globOptions
            );
        }
        else
        {
            //  cut off globs at last major folder
            // (may change the rules here later)

            let destPattern = filePattern.lastIndexOf('/**') != -1 ?
                                filePattern.substr(0, filePattern.lastIndexOf('/**')) :
                                filePattern;

            if(destPattern.lastIndexOf('/*.*') != -1)
            {
                destPattern = destPattern.substr(0, destPattern.lastIndexOf('/*.*'));
            }

            this.fs.copy(
                this.templatePath(filePattern),
                this.destinationPath(destPattern),
                globOptions
            );
        }
    }
}

module.exports = class extends BaseGenerator
{
    copyFiles ()
    {
        // TODO (1) make recursive function with array
        // TODO ...  and auto-glob detection

        // TODO (2) check for package.json in destination
        // TODO ... path and do not overwrite anything
        // TODO ...  in it except for scripts

        this.copyFromTemplate('package.json');

        this.fs.copy(
            this.templatePath('_gitignore'),
            this.destinationPath('.gitignore'),
            { dot : true }
        );

        this.copyFromTemplate('gulpfile.js');
        this.copyFromTemplate('app.js');
        this.copyFromTemplate('build-config/*.*', true);
        this.copyFromTemplate('src/js/**/*.*', true);
        this.copyFromTemplate('dist/dev/index.html');
        this.copyFromTemplate('dist/dev/css/**/*.*', true);
        this.copyFromTemplate('dist/dev/css/*.*', true);
        this.copyFromTemplate('dist/dev/fonts/**/*.*', true);

        if (!fs.existsSync('dist/prod')){
            fs.mkdirSync('dist/prod');
        }
    }
    installBuildDependencies ()
    {
        // TODO : trim the fat

        this.npmInstall([
            'babel-core@^6.24.0',
            'babel-plugin-add-module-exports@^0.2.1',
            'babel-plugin-transform-decorators-legacy@^1.3.4',
            'babel-plugin-transform-object-assign@^6.22.0',
            'babel-plugin-transform-remove-strict-mode@^0.0.2',
            'babel-polyfill@^6.23.0',
            'babel-preset-es2015@^6.9.0',
            'babel-preset-react@^6.23.0',
            'babel-preset-stage-0@^6.22.0',
            'babelify@^7.2.0',
            'browserify@^14.1.0',
            'events@^1.1.1',
            'figlet@^1.2.0',
            'gulp@^3.9.1',
            'gulp-clean-css@^3.0.3',
            'gulp-if@2.0.1',
            'gulp-imagemin@^3.0.1',
            'gulp-replace@^0.5.4',
            'gulp-server-livereload@^1.9.2',
            'gulp-streamify@^1.0.0',
            'gulp-strip-debug@^1.1.0',
            'gulp-uglify@^2.0.1',
            'gulp-useref@^3.1.0',
            'history@^4.6.1',
            'jss-theme-reactor@^0.11.1',
            'livereactload@^4.0.0-beta.2',
            'material-ui@1.0.0-alpha.16',
            'node-notifier@^5.0.2',
            'react@^15.6.1',
            'react-dom@^15.6.1',
            'react-hot-loader@^3.0.0-beta.6',
            'react-localization@^0.0.16',
            'react-redux@^5.0.5',
            'react-router-dom@^4.1.1',
            'react-router-redux@^5.0.0-alpha.4',
            'react-tap-event-plugin@^2.0.1',
            'reactify@^1.1.1',
            'recompose@^0.22.0',
            'redux@^3.6.0',
            'redux-logger@^3.0.1',
            'redux-promise-middleware@^4.2.0',
            'redux-thunk@^2.2.0',
            'run-sequence@^1.2.1',
            'vinyl-buffer',
            'vinyl-source-stream@^1.1.0',
            'watchify@^3.3.1'
        ], { 'save-dev': true });
    }

    installServerDependencies ()
    {
        this.npmInstall([
            'cli-table@^0.3.1',
            'colors@^1.1.2',
            'ejs@^2.3.4',
            'envify@^4.0.0',
            'express@^4.15.2',
            'yargs@^8.0.1'
        ], {'save' : true });
    }
};