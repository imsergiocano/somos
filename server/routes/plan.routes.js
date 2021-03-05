import express from 'express'
import planCtrl from '../controllers/plan.controller'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/plans/published')
  .get(planCtrl.listPublished)

router.route('/api/plans/by/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.isCoach, planCtrl.create)
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, planCtrl.listByCoach)

router.route('/api/plans/photo/:planId')
  .get(planCtrl.photo, planCtrl.defaultPhoto)

router.route('/api/plans/defaultphoto')
  .get(planCtrl.defaultPhoto)

router.route('/api/plans/:planId/session/new')
  .put(authCtrl.requireSignin, planCtrl.isCoach, planCtrl.newSession)

router.route('/api/plans/:planId')
  .get(planCtrl.read)
  .put(authCtrl.requireSignin, planCtrl.isCoach, planCtrl.update)
  .delete(authCtrl.requireSignin, planCtrl.isCoach, planCtrl.remove)

router.param('planId', planCtrl.planByID)
router.param('userId', userCtrl.userByID)

export default router
