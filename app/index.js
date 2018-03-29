// our base generator file;
// see Yeoman documentation for details on configuration:
// http://yeoman.io/authoring/

var path  = require('path');
var fs = require('fs');
var Generator = require('yeoman-generator');
var npmDevDeps = require('./package.json').devDependencies;
var npmServerDeps = require('./package.json').dependencies;

// Create Yeoman-specific list of
// server and build dep string arrays
// for automated npm install

const templateBuildDeps = Object.keys(npmDevDeps).map(
    (dep)=>(`${dep}@${npmDevDeps[dep]}`)
);

const templateServerDeps = Object.keys(npmServerDeps).map(
    (dep)=>(`${dep}@${npmServerDeps[dep]}`)
);

// options object for globbing
const ENABLE_GLOBBING_OPTS = { globOptions : true };

/**
 * A class extended directly from
 * a generator but not imported;
 * contains our helpful methods
 *
 * [just an opinionated alternative
 * to prefixing helpers with _s]
 */
class BaseGenerator extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.argument('appname', { type: String, required: false })
        this.sourceRoot(path.join(__dirname, 'templates'));
    }
    copyFromTemplate (filePattern, useGlob) {
        let globOptions = Object.assign({}, { dot : true }, useGlob ? ENABLE_GLOBBING_OPTS : {});

        if(!useGlob) {
            this.fs.copy(
                this.templatePath(filePattern),
                this.destinationPath(filePattern),
                globOptions
            );
        }
        else {
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

module.exports = class extends BaseGenerator {
    copyFiles () {
        // TODO (1) make recursive function with array
        // TODO ...  and auto-glob detection

        // TODO (2) check for package.json in destination
        // TODO ... path and do not overwrite anything
        // TODO ...  in it except for scripts
        if (this.options.appname) {
          fs.mkdirSync(this.options.appname);
          this.destinationRoot(this.options.appname)
        }

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

        if (!fs.existsSync(this.destinationPath('dist'))) {
            fs.mkdirSync(this.destinationPath('dist'));
        }

        if (!fs.existsSync(this.destinationPath('dist/prod'))) {
            fs.mkdirSync(this.destinationPath('dist/prod'));
        }
    }
    installBuildDependencies () {
        this.npmInstall(templateBuildDeps, { 'save-dev': true });
    }

    installServerDependencies () {
        this.npmInstall(templateServerDeps, {'save' : true });
    }
};