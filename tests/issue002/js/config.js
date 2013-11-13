/*global require */

require.config({

    deps: ['main', 'jquery', 'backbone'],

    shim: {
        'main': {
            deps: [
                'jquery',
                'backbone'
            ]
        },
        'jquery': {
            exports: '$'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            exports: 'Backbone',
            deps: [
                'underscore',
                'jquery'
            ]
        }
    },

    paths: {
        'main': './main',
        "lazy": "./../bower_components/require-lazy/lazy",
        "lazy-builder": "./../bower_components/require-lazy/lazy-builder",
        "promise-adaptor": "./../bower_components/require-lazy/promise-adaptor-jquery",
        'underscore': './../bower_components/lodash/dist/lodash',
        'jquery': './../bower_components/jquery/jquery',
        'backbone': './../bower_components/backbone/backbone'
    },

    baseUrl: "/js"

});
