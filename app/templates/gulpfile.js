'use strict'

// TODO -> come up with cleaner way of keeping track
// TODO... of update count, preventing bump-version, etc
var _global = { DEV_MODE : false };

var gulp          = require('gulp'),
    uglify        = require('gulp-uglify'),
    pkg           = require('./package.json'),
    source        = require('vinyl-source-stream'),
    buffer        = require('vinyl-buffer'),
    browserify    = require('browserify'),
    watchify      = require('watchify'),
    babelify      = require('babelify'),
    streamify     = require('gulp-streamify'),
    envify        = require('envify/custom'),
    fs            = require('fs'),
    colors        = require('colors'),
    imagemin      = require('gulp-imagemin'),
    useref        = require('gulp-useref'),
    gulpIf        = require('gulp-if'),
    cleanCss      = require('gulp-clean-css'),
    replace       = require('gulp-replace'),
    runSequence   = require('run-sequence'),
    notifier      = require('node-notifier'),
    gulpUtil      = require('gulp-util'),
    stripDebug    = require('gulp-strip-debug'),
    argv          = require('yargs').argv,
    figlet        = require('figlet'),
    Table         = require('cli-table'),
    liveReactLoad = require('livereactload'),
    liveReload    = require('gulp-server-livereload');


const Flags =
{
    version_bump      :
    {
        defaultValue : true,
        description  : 'Whether or not to bump versions on successive updates when building'
    },
    success_notice    :
    {
        defaultValue : true,
        description  : 'Displays a success notice in the OS when build is successful'
    },
    error_notice :
    {
        defaultValue : true,
        description  : 'Displays an error notice in the OS when a build fails'
    },
    error_sound       :
    {
        defaultValue : false,
        description  : 'Play a sound when there is an error'
    },
    build_js_debug    :
    {
        defaultValue : false,
        description  : 'Whether or not to include source maps in Javascript release builds'
    }
};

// assign flag values based on Flags
let FlagValues = {};
Object.keys(Flags).forEach((flag)=>
{
    if(typeof argv[flag] === 'undefined')
    {
        FlagValues[flag] = Flags[flag].defaultValue;
    }
    else
    {
        FlagValues[flag] = argv[flag];
    }
});

const path =
{
    HTML           : 'src/index.html',
    MINIFIED_OUT   : 'build.min.js',
    BUILDJS_OUT    : 'build.js',
    DEST           : 'build',
    DEST_BUILD     : 'dist/build',
    DEST_SRC       : 'dist/src',
    DIST_SRC_FILES :
    [
        './dist/src/**/*',
        '!dist/src/index.html',
        '!./**/*.js',
        '!./dist/src/css/**/*.css',
        '!./**/*.+(png|jpg|gif|svg)'
    ],
    ENTRY_POINT         : './src/js/clientApp.js',
    ENTRY_FOLDER        : 'src/js',
    VERSION_CONFIG_FILE : 'src/js/versionInfo.js',
    VERSION_CONFIG_DIR  : 'src/js/'
},
BABELIFY_CONFIG =
{
    extensions : [ '.js', '.jsx' ],
    presets    : [ 'es2015', 'react', 'stage-2', 'stage-3' ],
    plugins :
    [
        'transform-remove-strict-mode',
        'transform-decorators-legacy',
        'add-module-exports',
        'react-hot-loader/babel'
    ]
},
WATCHIFY_CONFIGURATION =
{
    poll  : true,
    ignoreWatch: ['**/node_modes/**']
};

let versionFileContent = fs.readFileSync(path.VERSION_CONFIG_FILE, 'utf8'),
    updateCount  = 0,
    successNoticeCount = 0,
    timeProcessedCount = 0,
    latestVersion = '---',
    latestVersionBuilt = versionFileContent.match(/VERSION[\s]*:[\s]*'([\d]+)[\.]([\d]+)[\.]([\d]+)'/gi)[0];

let getLatestVersionStrInFile = ()=>
{
    let fileContent = fs.readFileSync(path.VERSION_CONFIG_FILE, 'utf8');
    if(fileContent !== null && fileContent.match(/VERSION[\s]*:[\s]*'([\d]+)[\.]([\d]+)[\.]([\d]+)'/gi))
    {
        return fileContent.match(/VERSION[\s]*:[\s]*'([\d]+)[\.]([\d]+)[\.]([\d]+)'/gi)[0];
    }
};

let Notices =
{
    buildSuccess (p)
    {
        notifier.notify({ title : 'Build Successful', message : p.message, sound : false });
    },
    /**
     * @param p
     * @param p.message
     */
    errorBuilding (p)
    {
        if(FlagValues.error_notices)
        {
            notifier.notify(
            {
                title   : 'Error Building',
                message : p.message,
                sound   : FlagValues.error_sound
            });
        }
    },
    watchingFiles ()
    {
        notifier.notify(
        {
            title   : 'Watching ' + path.DEST_SRC,
            message : 'Ready to watch for file changes to build into ' + path.DEST_BUILD,
            sound : false
        });
    }
};

/** various logging functions */
let Log =
{
    updateBuild (files, updateCountShown)
    {
        if(!Array.isArray(files)) { files = Array.from([files]); }
        files = files.map((file,i)=>
        {
            let dirNameIndex = file.toLowerCase().indexOf(__dirname.toLowerCase());
            return '['+(i+1)+'] '+((dirNameIndex!=-1) ?
                    file.substr(dirNameIndex+__dirname.length+1+path.ENTRY_FOLDER.length) :
                    file).bold.magenta;
        });
        console.log('\nFile changes detected ->\n', files.join('\n'), '\n');

        var updatedAt = new Date(),
            updatedAtDisplay = `[${updatedAt.getHours()}:${updatedAt.getMinutes()}:${(updatedAt.getMilliseconds()+'').substr(0,2)}]`.gray;

        if(updateCountShown)
        {
            console.log(updatedAtDisplay + 'Updated source files ' +
                (++updateCount + '').bold.magenta + ' time' +
                ((updateCount == 1) ? '' : 's') + '. \n');
        }
    },
    watchStarted ()
    {
        console.log(`Getting ready to watching for file changes to build to 
                [${path.DEST_BUILD.bold}]\n`);
    },
    startNotice (mode)
    {
        let appPrintOut = '\n' + figlet.textSync(pkg.name,
        {
            font: 'Slant',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        });


        console.log(appPrintOut);
        console.log(`\t\tSource Code Builder\n`);
        console.log(`> Running in ${mode == 'build' ? 'Build':'Dev'} Mode\n`);
        console.log('[ gulp tasks: build \u2022 dev-server (default) \u2022 dev ]\n');

        Log.listFlags();

        if(mode != 'build')
        {
            console.log('Note : Initial build may take a bit of time on the first run before cache-ing...\n');
        }
    },
    buildMessage (message)
    {
        if(latestVersionBuilt == getLatestVersionStrInFile())
        {
            console.log(message + '\n');
        }
    },
    errorWhileRebuilding (err)
    {
        var errorAt = new Date(),
            errorAtDisplay = `${errorAt.getHours()}:${errorAt.getMinutes()}.${errorAt.getMilliseconds()}`;
        console.log(`${errorAtDisplay} ${`error occurred during build:\n\t${err.message.red.bold}\n`}`);
        console.log(`Even though building may have finished successfully, ${''
            }there was an error compiling the app sourcecode. ${''
            }This may lead to errors\n`);
    },
    listFlags ()
    {
        let flagTable = new Table(
            {
                head : ['flag'.gray, 'status'.gray, 'description'.gray],
                colWidths: [20, 10, 60]
            });


        for(var flagName in FlagValues)
        {
            let flagValue       = FlagValues[flagName],
                flagDescription = Flags[flagName].description;

            if(flagValue)
            {
                flagValue= flagValue.toString();
            }
            else
            {
                flagValue = flagValue.toString();
            }

            flagTable.push([flagName, flagValue, flagDescription]);
        }
        console.log(flagTable.toString().gray);
        console.log('\n');
    }
};

let Events =
{
    codebaseUpdated (ms)
    {
        if(updateCount == 0)    // fix for initial build
        {
            latestVersionBuilt = getLatestVersionStrInFile();
            updateCount++;
        }
        if((latestVersionBuilt == getLatestVersionStrInFile()) && successNoticeCount <= updateCount)
        {
            successNoticeCount += 1;
            let version = getLatestVersionStrInFile().match(/([\d]+)[\.]([\d]+)[\.]([\d]+)/gi)[0];
            let getMessage = (osNotice)=>
            {
                let seconds = ((parseInt(ms)/1000) + ''),
                    printedVersion = version;

                if(!osNotice)
                {
                    seconds = seconds.yellow.bold;
                    printedVersion = printedVersion.yellow.bold;
                    return `Successfully compiled source files in ${seconds} seconds.${''+
                    ' '}Build file now on version ${printedVersion}`;
                }
                else { return `v${printedVersion} (${seconds}s)`; }
            };

            Log.buildMessage(getMessage(false));
            if(FlagValues.success_notice)
            {
                notifier.notify({ title : 'Successful build', message : getMessage(true), sound : false });
            }
        }
    }
};

/**
 *  Builds our javascript code into output; can pass watch var depending on build or dev mode
 *
 * @param p
 * @param p.watch true - dev mode; will continuously watch. false - build mode; builds once
 */
function scripts(p)
{
    let watch = typeof p.watch != 'undefined' ? p.watch : true;

    //set up our watcher
    let b = browserify(
        {
            extensions   : ['.js', '.json', '.es6', '.jsx'],
            entries      : [path.ENTRY_POINT],
            global       : true,
            debug        : _global.DEV_MODE,
            cache        : {},
            packageCache : {},
            plugin       : watch ? [ liveReactLoad ] : []
        }).transform(babelify.configure(BABELIFY_CONFIG)).transform(envify({ NODE_ENV: 'development' }));

    // wrap in watchify
    if(watch) { b = watchify(b, WATCHIFY_CONFIGURATION); }

    b.on('error', (err)=>
    {
        if(watch) { Log.errorWhileRebuilding(err); }
        else      { Log.errorBuilding(err);        }
        Notices.errorBuilding({ message : err.message })
    });

    // add a timeout so that updated version registers
    b.on('time',Events.codebaseUpdated);

    /**
     *  sets up the actual js file-bundling logic
     */
    let getBuildStream = function(rebuild)
    {
        var stream = b.bundle();
        stream.on('error', (err)=>
        {
            if(watch) { Log.errorWhileRebuilding(err); }
            else      { Log.errorBuilding(err); }
            Notices.errorBuilding({ message : err.message });
        });;

        stream = stream.pipe(source(path.BUILDJS_OUT)); //bundle files into build.js

        if(watch && rebuild)
        {
            return stream.pipe(gulp.dest(path.DEST_SRC));
        }
        else
        {
            return stream;
        }
    };

    if(watch)
    {
        b.on('update', function(files)
        {
            // first make sure version actually changed before building
            // if version already bumped, build the files
            // otherwise, simply re-set up bundler to watch again
            let versionAlreadyBumped = ((latestVersionBuilt != getLatestVersionStrInFile()));
            Log.updateBuild(files,versionAlreadyBumped);

            if(versionAlreadyBumped)
            {
                latestVersionBuilt = getLatestVersionStrInFile();
                return getBuildStream(true);
            }
            else
            {
                runSequence('check-for-version-bump', ()=>(getBuildStream(updateCount === 0)));
            }
        });
    }

    if(watch)
    {
        return runSequence('check-for-version-bump', ()=>
        {
            return getBuildStream(true)
        });
    }
    else { return getBuildStream(true); }
};

gulp.task('dev', function()
{
    global.DEV_MODE = true;
    Log.startNotice('dev');
    return scripts({ watch : true });
});

gulp.task('dev-server', ['dev'], function()
{
    global.DEV_MODE = true;
    Log.startNotice('dev');
    return gulp.src(path.DEST_SRC)
        .pipe(liveReload(
        {
            host: '0.0.0.0',
            port: 8080
            // TODO | configure live reload
            // TODO | to react to CSS/static asset
            // TODO | changes. currently just JS
        }));
});

gulp.task('html-ref-and-concat-css', function()
{
    return gulp.src(path.DEST_SRC + '/index.html')
        .pipe(gulpIf('*.css', cleanCss()))  // minify css files
        .pipe(useref())                     // for html build file markup
        .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('minify-images', function()
{
    return gulp.src(path.DEST_SRC + '/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('copy-extra-to-build', function()
{
    return gulp.src(path.DIST_SRC_FILES)
        .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('check-for-version-bump', function()
{
    // first make sure version built is up to date before bumping twice
    let versionFileContent = fs.readFileSync(path.VERSION_CONFIG_FILE, 'utf8');
    let versionShouldBeBumped = (versionFileContent.indexOf(latestVersionBuilt) != -1) && FlagValues.version_bump;
    if(versionShouldBeBumped)
    {
        return gulp.src([path.VERSION_CONFIG_FILE])
            .pipe(replace(/VERSION[\s]*:[\s]*'([\d]+)[\.]([\d]+)[\.]([\d]+)'/gi,
                (vString, major, minor, patch)=>
                {
                    let nextVersion = `VERSION : '${major}.${minor}.${parseInt(patch)+1}'`;
                    return (latestVersion = nextVersion, nextVersion);
                })).pipe(gulp.dest(path.VERSION_CONFIG_DIR));
    }
    else return;
});

gulp.task('apply-prod-environment', function()
{
    process.env.NODE_ENV = 'production';
});
gulp.task('welcome-build-notice', function()
{
    Log.startNotice('build');
});

gulp.task('welcome-dev-notice', function()
{
    Log.startNotice('dev');
});

gulp.task('build',
[
    'welcome-build-notice','apply-prod-environment', 'copy-extra-to-build',
    'html-ref-and-concat-css', 'minify-images'
],()=>
{
    global.DEV_MODE = false;
    if(FlagValues.build_js_debug)
    {
        return scripts({ watch : false })
            .pipe(buffer())
            .pipe(uglify().on('error', gulpUtil.log))
            .pipe(gulp.dest(path.DEST_BUILD));
    }
    else
    {
        return scripts({ watch : false })
            .pipe(buffer())
            .pipe(uglify().on('error', gulpUtil.log))
            .pipe(stripDebug())                         //remove console logging
            .pipe(gulp.dest(path.DEST_BUILD));
    }
});

gulp.task('default', ['dev-server']);