// Generated by CoffeeScript 1.4.0

requirejs.config({
  paths: {
    jquery: 'vendors/jquery/jquery',
    underscore: 'vendors/underscore/underscore',
    backbone: 'vendors/backbone/backbone',
    backbonels: 'vendors/backbone/backbone.localStorage',
    bootstrap: 'vendors/bootstrap/bootstrap',
    text: 'vendors/require/text'
  },
  shim: {
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    underscore: {
      exports: '_'
    },
    bootstrap: {
      deps: ['jquery']
    }
  },
  wait: '5s'
});

require(['backbone', 'backbonels', 'jquery', 'application/models/application', 'bootstrap'], function(Backbone, Backbonels, $, App, Bs) {
  return $(function() {
    console.log("Alors?");
    App = new App();
    App.init();
    return console.log("launched");
  });
});
