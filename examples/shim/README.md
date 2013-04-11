Require-Lazy and shimmed packages
=================================

In this example we use the `shim` feature of require.js to specify dependencies for non-AMD modules.
The view is built with jQuery-UI. There are three tabs. The first is eager loaded in `main.js`, the others
are created from lazily loaded modules, `tab-button.js` and `tab-datepicker.js`. Each module depends
on a different jQuery-UI component and all of them depend on jquery-ui-core and jquery-ui-widget.
The bundles created are:

- `main.js` + `jquery-ui-core` + `jquery-ui-widget`
- `tab-button.js` + `jquery-ui-button`
- `tab-datepicker.js` + `jquery-ui-datepicker`

Setup
-----
It is assumed that Node.js is already installed.

1. Clone the GIT repository
1. Run `npm install` in this directory to install the express web framework
1. `cd build-scripts` and `node build.js` (the output goes to the build directory; minification is disabled for the example)
1. cd back to this directory and run `node app.js`
1. Hit http://localhost:8110/app.html (the development mode site) or http://localhost:8110/app-built.html (the built site-producton mode); click the links while keeping an eye on the "Net" tab in Firebug
