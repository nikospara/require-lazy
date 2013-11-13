/*jslint browser: true, nomen: true, unparam: true */
/*globals define, Backbone, $, window, app:true, _ */

define([
    'lazy!views/posicao'
], function (
    viewsPosicao
) {
    'use strict';

    app.Router = Backbone.Router.extend({
        routes: {
            'posicao': 'posicao'
        },

        posicao: function (start, end, graphType) {
            viewsPosicao.get().done(function () {
                app.start = start || app.start || undefined;
                app.end = end || app.end || undefined;
                app.grafico = graphType || 'total';
                app.views.posicao = app.views.posicao || new app.views.Posicao();
                app.views.posicao.render(start, end, graphType);
            });
        }

    });
});
