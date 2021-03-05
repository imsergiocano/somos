import mongoose from 'mongoose'

const EnrollmentSchema = new mongoose.Schema({
  plan: {type: mongoose.Schema.ObjectId, ref: 'Plan'},
  updated: Date,
  enrolled: {
    type: Date,
    default: Date.now
  },
  athlete: {type: mongoose.Schema.ObjectId, ref: 'User'},
  sessionStatus: [{
      session: {type: mongoose.Schema.ObjectId, ref: 'Session'}, 
      complete: Boolean}],
  completed: Date
})

export default mongoose.model('Enrollment', EnrollmentSchema)
