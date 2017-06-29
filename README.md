A modular, clean and modern workflow template for React/Redux development!

## Requirements ##
* NodeJS : 6.x.x - Latest Stable Version
* NPM : 3.x or higher (Preferably 5.x)
* Gulp CLI (`npm install -g gulp-cli`)

## Features ##

- Live reloading
- Easy and declarative folder structure 
- Easily modifiable build code written in gulp; no magical configuration (!)
- Modular React/Redux architecture which lend themselves well to unit testing
- Includes simple JSS (via `react-jss`) for optimal/readable React styling
- Easy & declarative multi-language support in your app out of the box
- Minimal deployable Express server which supports easy switching between HTTP/HTTPS
- Redux and Redux-Router
- Flags for giving OS notices when builds are successful or fail


## Installation ##

1) install Yeoman by running the following: `npm install -g yo`
2) install the generator: `npm install -g generator-react-redux-gulp`
3) navigate to a folder pointing to your new project and run `yo react-redux-gulp`, which should install all build and server dependencies to get started on your new project!

## Deployment ##

### Packaging the app ###
simply run `gulp build` , and your server and assets are ready to go.

#### Optional Flags ####
- **success_notice**  : Display an OS-level success notice
- **error_sound** : Whether to play an OS error sound when compile error happens
- **build_js_debug** : Create a production level build, but do not strip debug messages from console.

#### Running the Node/Express Server ####

Note: You must first build the app by calling `gulp build`.

Run `node app` in your root folder after installing; it will list clearly 
how to specify the proper flags for SSL if needed on your server when
booting up as well as which server (default port is `3002`).

Or to simply build and run the app, run `npm start`.

## Developing

#### With Live-Reload Server ###

In CMD, type `gulp` to begin a live reload server at `localhost:8080`. 
Currently, hot reloading only detects JS changes so server must be reset for other static resource changes.

#### Typical Node/Express Development Server ###

If you would like to run without a hot reload server in dev mode, static changes can be detected when refreshing
without re-running the dev server . simply run `gulp dev` and then in another console `node app --dev` 
(port can be specified as param but default is `3002`).

#### Optional Flags ###

- **version_bump** : Bump patch version on successful builds (default false)
- **success_notice**  : Display an OS-level success notice
- **error_sound** : Whether to play an OS error sound when compile error happens
- **build_js_debug** : Create a production level build, but do not strip debug messages from console.

## Build Configuration ##

#### Configuring Module Aliases ####
Modules can be aliased to use as if they were a root npm module by specifying
them within the `aliases.json` located in the `build-config` folder.

#### Configuring Build Paths/Folder Structure ####
Configure the build structure of your app via `paths.json` located in 
the `build-config` folder. This includes where the source files, distribution files
and javascript can be found and built to. Defaults are already specified but can be
overridden.

## Roadmap ##

- npm scripts for developing and launching http/https server simultaneously
- Display an example of easy localization/language tools
- Tests


## *Note* ##
PR Requests are always welcome! 

Thanks.