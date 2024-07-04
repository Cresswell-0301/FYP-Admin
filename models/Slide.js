import {model, Schema, models} from "mongoose";

const SlideSchema = new Schema({
  slides: [{type:String}],
})

export const Slide = models.Slide || model('Slide', SlideSchema);