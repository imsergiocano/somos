import mongoose from 'mongoose'

const SessionSchema = new mongoose.Schema({
  title: String,
  content: String,
  resource_url: String
})
const Session = mongoose.model('Session', SessionSchema)
const PlanSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
  image: {
    data: Buffer,
    contentType: String
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: 'Category is required'
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  coach: {type: mongoose.Schema.ObjectId, ref: 'User'},
  published: {
    type: Boolean,
    default: false
  },
  sessions: [SessionSchema]
})

export default mongoose.model('Plan', PlanSchema)
