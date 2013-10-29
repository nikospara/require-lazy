Module discovery with Require-Lazy using Grunt for building
===========================================================

This extends the module discovery example using [Grunt](http://gruntjs.com/) for building, instead of `build-scripts/build.js`.

Setup
-----
For the time being `require-lazy-grunt` has not been uploaded to the npm registry; you will have to:

1. Clone its repository:

        git clone https://github.com/nikospara/require-lazy-grunt.git

2. Run `npm link` from the cloned directory.
3. Switch to this directory and run `npm link require-lazy-grunt`.

The above should be executed *before* step 2 below:

1. Clone the GIT repository
2. Run `npm install` in this directory
3. Make sure grunt-cli is installed (see [here](http://gruntjs.com/getting-started))
4. Run `grunt`
5. cd back to this directory and run `node app.js`
6. Hit http://localhost:8110/app.html (the development mode site) or http://localhost:8110/app-built.html (the built site-producton mode); click the links while keeping an eye on the "Net" tab in Firebug
