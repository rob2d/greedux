A modular, clean and modern workflow template for React/Redux development

### Features ###
- Optional live-reload environment
- Easy and declarative folder structure 
- Easily modifiable build code written in gulp; no magical configuration
- Modular React/Redux architecture which lend themselves well to unit testing
- Minimal and clean localization templates  for language selection on welcome template
- Material-UI `@next` and JSS fully supported
- Minimal express server which supports easy switching between HTTP/HTTPS
- Redux and Redux-Router (both `@ next`)
- Flags for giving OS notices when builds are successful or not


### Installation ###

1) install Yeoman by running the following: `npm install -g yo`
2) install the generator: `npm install -g generator-react-redux-gulp`
3) navigate to a folder pointing to your new project and run `yo react-redux-gulp`, which should install all build and server dependencies to get started on your new project!


### Roadmap ###

- Create meaningful README.md to put here for how to run server/build environment
- Trim a few unnecessary build packages for template's npm dependencies
- Remove auto SemVer patch # version bumps in build that were specific to a personal project workflow
- Display an example of easy localization tools
- Fill in actual commonly used Webpack features such as CSS imports
- Create a separate generator to make **material-ui** and associated fonts/files optional


### Important Note ###
This repo is an active work in progress; Please keep that in mind.

With that said, PR Requests are always welcome! Thanks.