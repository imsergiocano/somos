import Plan from '../models/plan.model'
import extend from 'lodash/extend'
import fs from 'fs'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import defaultImage from './../../client/assets/images/default.png'

const create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      })
    }
    let plan = new Plan(fields)
    plan.coach = req.profile
    if(files.image){
        plan.image.data = fs.readFileSync(files.image.path)
        plan.image.contentType = files.image.type
    }
    try {
      let result = await plan.save()
      res.json(result)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

/**
 * Load plan and append to req.
 */
const planByID = async (req, res, next, id) => {
  try {
    let plan = await Plan.findById(id).populate('coach', '_id name')
    if (!plan)
      return res.status('400').json({
        error: "Plan not found"
      })
    req.plan = plan
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve plan"
    })
  }
}

const read = (req, res) => {
  req.plan.image = undefined
  return res.json(req.plan)
}

const list = async (req, res) => {
  try {
    let plans = await Plan.find().select('name email updated created')
    res.json(plans)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }
    let plan = req.plan
    plan = extend(plan, fields)
    if(fields.sessions){
      plan.sessions = JSON.parse(fields.sessions)
    }
    plan.updated = Date.now()
    if(files.image){
      plan.image.data = fs.readFileSync(files.image.path)
      plan.image.contentType = files.image.type
    }
    try {
      await plan.save()
      res.json(plan)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const newSession = async (req, res) => {
  try {
    let session = req.body.session
    let result = await Plan.findByIdAndUpdate(req.plan._id, {$push: {sessions: session}, updated: Date.now()}, {new: true})
                            .populate('coach', '_id name')
                            .exec()
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let plan = req.plan
    let deletePlan = await plan.remove()
    res.json(deletePlan)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isCoach = (req, res, next) => {
    const isCoach = req.plan && req.auth && req.plan.coach._id == req.auth._id
    if(!isCoach){
      return res.status('403').json({
        error: "User is not authorized"
      })
    }
    next()
}

const listByCoach = (req, res) => {
  Plan.find({coach: req.profile._id}, (err, plans) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(plans)
  }).populate('coach', '_id name')
}

const listPublished = (req, res) => {
  Plan.find({published: true}, (err, plans) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(plans)
  }).populate('coach', '_id name')
}

const photo = (req, res, next) => {
  if(req.plan.image.data){
    res.set("Content-Type", req.plan.image.contentType)
    return res.send(req.plan.image.data)
  }
  next()
}
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd()+defaultImage)
}


export default {
  create,
  planByID,
  read,
  list,
  remove,
  update,
  isCoach,
  listByCoach,
  photo,
  defaultPhoto,
  newSession,
  listPublished
}
