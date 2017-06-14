A modular, clean and modern workflow template for React/Redux development!

## Requirements ##
* NodeJS : 6.x.x - Latest Stable Version
* NPM : 3.x or higher (Preferably 5.x)
* Gulp CLI (`npm install -g gulp-cli`)

## Features ##

- Optional live-reload environment
- Easy and declarative folder structure 
- Easily modifiable build code written in gulp; no magical configuration
- Modular React/Redux architecture which lend themselves well to unit testing
- Minimal and clean localization templates  for language selection on welcome template
- Material-UI `@next` and JSS fully supported
- Minimal express server which supports easy switching between HTTP/HTTPS
- Redux and Redux-Router (both `@ next`)
- Flags for giving OS notices when builds are successful or not


## Installation ##

1) install Yeoman by running the following: `npm install -g yo`
2) install the generator: `npm install -g generator-react-redux-gulp`
3) navigate to a folder pointing to your new project and run `yo react-redux-gulp`, which should install all build and server dependencies to get started on your new project!

## Deployment ##

#### Packaging the app ###
simply run `gulp build` , and your server and assets are ready to go.

#### Optional Flags ###
- **success_notice**  : Display an OS-level success notice
- **error_sound** : Whether to play an OS error sound when compile error happens
- **build_js_debug** : Create a production level build, but do not strip debug messages from console.

## Developing

#### With Live-Reload Server ###

In CMD, type `gulp` to begin a live reload server at `localhost:8080`. 
Currently, hot reloading only detects JS changes so server must be reset for other static resource changes.

#### Typical Node/Express Development Server ###

If you would like to run without a hot reload server in dev mode, static changes can be detected when refreshing
without re-running the dev server . simply run `gulp dev` and then in another console `node app --dev` 
[port can be specified as param but default is 3030].

(note: currently Live Reload still runs. Disabling this is in roadmap below)

#### Optional Flags ###

- **version_bump** : Bump patch version on successful builds (default false)
- **success_notice**  : Display an OS-level success notice
- **error_sound** : Whether to play an OS error sound when compile error happens
- **build_js_debug** : Create a production level build, but do not strip debug messages from console.


## Roadmap ##

- Create meaningful README.md to put here for how to run server/build environment
- Remove auto SemVer patch # version bumps in build that were specific to a personal project workflow
- Make LiveServer optional while developing
- Display an example of easy localization tools
- Fill in actual commonly used Webpack features such as CSS imports
- Create a separate generator to make **material-ui** and associated fonts/files optional
- Tests


## *Important Note* ##
This repo is an active work in progress; Please keep that in mind.

With that said, PR Requests are always welcome! 

Thanks.