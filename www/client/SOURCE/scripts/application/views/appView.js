// Generated by CoffeeScript 1.4.0
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['jquery', 'backbone', 'application/models/slide', 'application/views/slideScreen', 'application/collections/slides', 'application/models/organisation', 'application/views/organisationView', 'application/models/conference', 'application/views/conferenceView'], function($, Backbone, Slide, SlideView, Slides, Organisation, OrganisationView, Conference, ConferenceView) {
  var appView;
  return appView = (function(_super) {

    __extends(appView, _super);

    function appView() {
      return appView.__super__.constructor.apply(this, arguments);
    }

    appView.prototype.el = '#header';

    appView.prototype.template = _.template($('#app-template').html());

    /*--events:
      'click #previous' : 'previous'
      'click #next' : 'next'
    */


    appView.prototype.initialize = function() {
      var _this = this;
      this.slides = new Slides();
      this.render();
      this.on('newSlide', function(data) {
        return _this.newSlide(data);
      });
      this.on('ServerConnection', function(data) {
        return _this.connectNotif(data);
      });
      this.on('reseting', function(data) {
        console.log("reseting");
        _this.slides.reset();
        _this.slides.position = 0;
        return _this.navigationMode = false;
      });
      this.on('organisations', function(data) {
        return _this.fullFillOrgList(data);
      });
      this.on('conferences', function(data) {
        return _this.fullFillConfList(data);
      });
      this.on('slides', function(data) {
        return _this.restore(data);
      });
      this.on('sremove', function(data) {
        return _this.removeSlide(data);
      });
      this.slides.fetch();
      $('#appcontainer').delegate('.org-item', 'click', function(e) {
        var txt;
        console.log(e.target);
        txt = $(e.target).attr('id');
        console.log(txt);
        return _this.trigger('organisationChoosed', txt);
      });
      $('#appcontainer').delegate('.conf-item', 'click ', function(e) {
        var txt;
        txt = $(e.target).attr('id');
        _this.conference = $(e.target).attr('id');
        console.log(txt);
        return _this.trigger('conferenceChoosed', txt);
      });
      $('#suivant').click(function(e) {
        e.preventDefault();
        _this.suivant();
        return console.log("pushed next bt");
      });
      $('#precedent').click(function(e) {
        e.preventDefault();
        _this.precedent();
        return console.log("pushed previous bt");
      });
      return console.log("appView built");
    };

    appView.prototype.connectNotif = function(data) {
      return $('.js-status').removeClass('disconnected').addClass('connected');
    };

    appView.prototype.render = function() {
      return this.$el.html(this.template());
    };

    appView.prototype.precedent = function() {
      var newPosSlide, previous, slide, slideView;
      console.log(this.slides.position);
      if (this.slides.position > 0) {
        $('.far-future').remove();
        $('.future').removeClass('future').addClass('far-future');
        $('.current').removeClass('current').addClass('future');
        $('.past').removeClass('past').addClass('current');
        $('.far-past').removeClass('far-past').addClass('past');
        this.slides.position = this.slides.position - 1;
        previous = this.slides.at(this.slides.position);
        this.navigationMode = true;
        if (this.slides.position > 1) {
          newPosSlide = this.slides.position - 2;
          slide = this.slides.at(newPosSlide);
          slideView = new SlideView({
            model: slide
          });
          $('#SlideList').append(slideView.render().el);
          $('.new').removeClass('new').addClass('far-past');
        }
      }
      console.log("Mode navigation?: ", this.navigationMode);
      return console.log("ma position: ", this.slides.position);
    };

    appView.prototype.suivant = function() {
      var newPosSlide, previous, slide, slideView;
      if (this.slides.position < (this.slides.length - 1)) {
        console.log("I am in");
        $('.far-past').remove();
        $('.past').removeClass('past').addClass('far-past');
        $('.current').removeClass('current').addClass('past');
        $('.future').removeClass('future').addClass('current');
        $('.far-future').removeClass('far-future').addClass('future');
        this.slides.position = this.slides.position + 1;
        previous = this.slides.at(this.slides.position);
        if (this.slides.position === (this.slides.length - 1)) {
          this.navigationMode = false;
        }
        if (this.slides.position < (this.slides.length - 2)) {
          newPosSlide = this.slides.position + 2;
          slide = this.slides.at(newPosSlide);
          slideView = new SlideView({
            model: slide
          });
          $('#SlideList').append(slideView.render().el);
          $('.new').removeClass('new').addClass('far-future');
        }
      }
      console.log("Mode navigation?: ", this.navigationMode);
      return console.log("ma position: ", this.slides.position);
    };

    appView.prototype.newSlide = function(data) {
      var obj, slide, slideView;
      obj = $.parseJSON(data.JsonData);
      slide = new Slide(obj);
      slide.set("conf", data._conf);
      slideView = new SlideView({
        model: slide
      });
      this.slides.add(slide);
      slide.save();
      this.slides.fetch();
      /*slide = new Slide data
      slideView = new SlideView ({model : slide })
      @slides.add slide
      slide.save()
      @slides.fetch()
      */

      if (this.navigationMode) {
        if (this.slides.position === this.slides.length - 3) {
          $('#SlideList').append(slideView.render().el);
          $('.new').removeClass('new').addClass('far-future');
        }
      } else {
        this.slides.position = this.slides.length - 1;
        $('#SlideList').append(slideView.render().el);
        this.last();
      }
      console.log("Mode navigation?: ", this.navigationMode);
      return console.log("ma position: ", this.slides.position);
    };

    appView.prototype.removeSlide = function(data) {
      var id, index, obj, slide;
      console.log(data);
      obj = $.parseJSON(data.JsonData);
      slide = new Slide(obj);
      slide.set("conf", data._conf);
      index = this.slides.indexOf(this.slides.get(obj.id));
      this.slides.localStorage.destroy(this.slides.get(obj.id));
      this.slides.remove(this.slides.get(obj.id));
      this.slides.fetch();
      id = '#' + obj.id;
      console.log("la position en index of: ", index);
      console.log("la position en position: ", this.slides.position);
      if (index < this.slides.position) {
        this.slides.position = this.slides.position - 1;
      }
      if ($(id).parent().hasClass('far-future')) {
        $(id).parent().remove();
        return this.hasNext();
      } else if ($(id).parent().hasClass('future')) {
        $(id).parent().slideUp(function() {
          return $(id).parent().remove();
        });
        $('.far-future').removeClass('far-future').addClass("future");
        this.hasNext();
        return this.setNavigationMode();
      } else if ($(id).parent().hasClass('current')) {
        $(id).parent().slideUp(function() {
          return $(id).parent().remove();
        });
        if (this.navigationMode) {
          console.log("c'est pcq je suis en mode navigation");
          $('.future').removeClass('future').addClass('current');
          $('.far-future').removeClass('far-future').addClass('future');
          this.hasNext();
          return this.setNavigationMode();
        } else {
          console.log("c pcq je ne suis pas en mode navigation");
          $('.past').removeClass('past').addClass('current');
          $('.far-past').removeClass('far-past').addClass('past');
          this.slides.position = this.slides.position - 1;
          return this.navigationMode = false;
        }
      } else if ($(id).parent().hasClass('past')) {
        $(id).parent().slideUp(function() {
          return $(id).parent().remove();
        });
        $('.far-past').removeClass('far-past').addClass("past");
        return this.hasPrevious();
      } else if ($(id).parent().hasClass('far-past')) {
        $(id).parent().remove();
        return this.hasPrevious();
      }
    };

    appView.prototype.fullFillOrgList = function(data) {
      var len, organisation, organisationView, x, _i;
      $(".organisationsList").children().remove();
      len = data.length - 1;
      console.log(len);
      for (x = _i = 0; 0 <= len ? _i <= len : _i >= len; x = 0 <= len ? ++_i : --_i) {
        organisation = new Organisation(data[x]);
        console.log(organisation);
        organisationView = new OrganisationView({
          model: organisation
        });
        $('.organisationsList').append(organisationView.render().el);
      }
      $("#loading").fadeOut();
      return $("#wrap").fadeIn();
    };

    appView.prototype.fullFillConfList = function(data) {
      var confView, confs, len, x, _i, _results;
      $(".confList").children().remove();
      len = data.length - 1;
      _results = [];
      for (x = _i = 0; 0 <= len ? _i <= len : _i >= len; x = 0 <= len ? ++_i : --_i) {
        console.log(data[x]);
        confs = new Conference(data[x]);
        confView = new ConferenceView({
          model: confs
        });
        console.log(confView.render().el);
        _results.push($('.confList').append(confView.render().el));
      }
      return _results;
    };

    appView.prototype.showLast = function() {
      var lastSlide;
      this.slides.each(function(slide) {
        var id;
        id = '#' + slide.id;
        return $(id).hide();
      });
      lastSlide = this.slides.at(this.slides.length - 1);
      if (lastSlide) {
        $('#' + lastSlide.id).show();
      }
      if (this.slides.length === 0) {
        return this.slides.position = 0;
      } else {
        return this.slides.position = this.slides.length - 1;
      }
    };

    appView.prototype.restore = function(data) {
      var len, max, num, obj, slide, slideView, sv, taille, x, _i;
      $('#SlideList').children().remove();
      taille = this.slides.length;
      len = data.length - 1;
      console.log("restore la conference d'id: ", this.conference);
      this.navigationMode = false;
      console.log(this.navigationMode);
      if (data[0]._conf !== this.conference || taille > data.length) {
        this.slides.reset();
        localStorage.clear();
        this.slides.fetch();
        console.log("j'ai reseté");
      }
      if (len >= 0) {
        sv = data[0]._conf;
        for (x = _i = 0; 0 <= len ? _i <= len : _i >= len; x = 0 <= len ? ++_i : --_i) {
          obj = $.parseJSON(data[x].JsonData);
          slide = new Slide(obj);
          slide.set("conf", sv);
          slideView = new SlideView({
            model: slide
          });
          this.slides.add(slide);
          slide.save();
          this.slides.fetch();
        }
      }
      max = 3;
      num = 0;
      console.log('taille', taille);
      while (max > 0 && taille > 0) {
        taille--;
        slide = this.slides.at(taille);
        console.log(slide.get('conf'));
        if (slide.get('conf') === this.conference) {
          slideView = new SlideView({
            model: slide
          });
          $('#SlideList').append(slideView.render().el);
          max--;
          num++;
        }
        switch (num) {
          case 1:
            $('.new').removeClass('new').addClass('current');
            break;
          case 2:
            $('.new').removeClass('new').addClass('past');
            break;
          case 3:
            $('.new').removeClass('new').addClass('far-past');
        }
      }
      if (this.slides.length === 0) {
        this.slides.position = 0;
      } else {
        this.slides.position = this.slides.length - 1;
      }
      $('.confBlock').fadeOut();
      $('.slides').fadeIn();
      console.log("Mode navigation?: ", this.navigationMode);
      return console.log("ma position: ", this.slides.position);
    };

    appView.prototype.last = function() {
      $('.new').removeClass('new').addClass('far-future');
      $('.far-future').hide();
      $('.far-future').fadeIn();
      $('.far-past').remove();
      $('.past').removeClass('past').addClass('far-past');
      $('.current').removeClass('current').addClass('past');
      $('.far-future').removeClass('far-future').addClass('current');
      return console.log("my position ", this.slides.position);
    };

    appView.prototype.hasNext = function() {
      var newPosSlide, slide, slideView;
      if (this.slides.position <= (this.slides.length - 3)) {
        console.log("je verifie mon tableau");
        newPosSlide = this.slides.position + 2;
        slide = this.slides.at(newPosSlide);
        slideView = new SlideView({
          model: slide
        });
        $('#SlideList').append(slideView.render().el);
        return $('.new').removeClass('new').addClass('far-future');
      }
    };

    appView.prototype.hasPrevious = function() {
      var newPosSlide, slide, slideView;
      if (this.slides.position > 1) {
        newPosSlide = this.slides.position - 2;
        slide = this.slides.at(newPosSlide);
        slideView = new SlideView({
          model: slide
        });
        $('#SlideList').append(slideView.render().el);
        return $('.new').removeClass('new').addClass('far-past');
      }
    };

    appView.prototype.setNavigationMode = function() {
      if (this.slides.position === this.slides.length - 1) {
        this.navigationMode = false;
      } else {
        if (this.slides.position < this.slides.length - 1) {
          this.navigationMode = true;
        }
      }
      return console.log("mode navigation: ", this.navigationMode);
    };

    return appView;

  })(Backbone.View);
});
