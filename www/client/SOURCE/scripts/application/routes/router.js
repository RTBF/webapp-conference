// Generated by CoffeeScript 1.4.0
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'backbone', 'application/views/mainView', 'application/models/app'], function($, Backbone, MainView, App) {
  var Router;
  return Router = (function(_super) {

    __extends(Router, _super);

    Router.prototype.routes = {
      'organisation': 'organisationScreen',
      'conference/:orgid': 'conferenceScreen',
      'slide': 'slideScreen',
      '*actions': 'organisationScreen'
    };

    function Router() {
      Router.__super__.constructor.call(this, this.routes);
    }

    Router.prototype.initialize = function() {
      var _this = this;
      this.trigger('orgRoute');
      this.app = new App();
      this.mainView = new MainView({
        model: this.app
      });
      this.mainView.on('organisationChoosed', function(data) {
        console.log('router organisation choosed: ', data);
        return _this.trigger('confRoute', data);
      });
      this.mainView.on('conferenceChoosed', function(data) {
        console.log('router conference choosed: ', data);
        return _this.trigger('slideRoute', data);
      });
      Backbone.history.start();
      return console.log(" The Route Initialized");
    };

    Router.prototype.organisationScreen = function() {
      $('.slides').fadeOut();
      $('.confBlock').removeClass('onshow');
      return $('.organisationsBlock').addClass('onshow');
    };

    Router.prototype.conferenceScreen = function(orgid) {
      $('.slides').fadeOut();
      $('.organisationsBlock').removeClass('onshow');
      return $('.confBlock').show(function() {
        return $('.confBlock').addClass('onshow');
      });
    };

    Router.prototype.slideScreen = function() {
      $('.organisationsBlock').removeClass('onshow');
      return $('.confBlock').fadeOut(function() {
        return $('.slides').fadeIn();
      });
    };

    return Router;

  })(Backbone.Router);
});
