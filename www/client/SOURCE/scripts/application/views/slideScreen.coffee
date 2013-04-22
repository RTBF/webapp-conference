define [
  'jquery'
  'backbone'
  'application/views/conferenceView'
  ],($,Backbone,ConferenceView)->

    class slideScreen extends Backbone.View
      tagName : 'li'
      className: "slide"

      template : _.template($('#slide-template').html())

      initialize : ()->
        @listenTo @model, 'change', @render
        console.log  "slideScreen initilized"

      render: ()-> 
        console.log 'render called'
        #@.$el.html @template(@model.toJSON())
        modelId = '#'+@model.get('id')
        if $(modelId).parent().hasClass('slide')
          console.log "lol"
          #@.$el.html @template(@model.toJSON())    
        else
          console.log 'je suis là'
          if @model.get('state') != 'out'
            $('#SlideList').append(@.$el.html @template(@model.toJSON()))
        
        $(modelId).parent().removeClass().addClass("slide").addClass(@model.get('state'))
        if @model.get('state') is 'out'
          $(modelId).parent().remove()
        #@
      
      new:()->
        modelId = '#'+@model.get('id')
        $('#SlideList').append(@.$el.html @template(@model.toJSON()))
        $(modelId).parent().removeClass().addClass("slide").addClass(@model.get('state'))
        $(modelId).hide()
        $(modelId).fadeIn ()=>
          @model.set 'state', 'current'
        
