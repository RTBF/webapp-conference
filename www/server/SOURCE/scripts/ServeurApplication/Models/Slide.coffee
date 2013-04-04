mongoose = require  "mongoose"
Schema = mongoose.Schema


SlideSchema = Schema 
    _conf:
      type: Schema.Types.ObjectId 
      ref: 'Conference'
      required: true
    Type: 
      type: String
      required : true
    Order: 
      type: Number
      required: true
    JsonData: 
      type: String
      required: true

SlideSchema.methods.TOJSON = () ->
  console.log "into toJSON methode"
  JSON.stringify @




module.exports= mongoose.model 'Slide', SlideSchema , 'slides'