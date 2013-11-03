Module discovery with Require-Lazy using Grunt for building and Bower for web dependency management
===================================================================================================

This extends the module discovery example using [Grunt](http://gruntjs.com/) for building, instead of `build-scripts/build.js`
and [Bower](http://bower.io/) for managing the web dependencies, instead of manual downloading and copying.

Setup
-----

1. Clone the GIT repository: `git clone https://github.com/nikospara/require-lazy.git`
2. Run `npm install` in this directory
3. Make sure Bower is installed (`npm install -g bower`)
4. Run bower to download and install the web dependencies: `bower install`
3. Make sure grunt-cli is installed (see [here](http://gruntjs.com/getting-started) - `npm install -g grunt-cli`)
4. Run `grunt`
5. cd back to this directory and run `node app.js`
6. Hit http://localhost:8110/app.html (the development mode site) or http://localhost:8110/app-built.html (the built site-producton mode); click the links while keeping an eye on the "Net" tab in Firebug
