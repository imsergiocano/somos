import express from 'express'
import enrollmentCtrl from '../controllers/enrollment.controller'
import planCtrl from '../controllers/plan.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/enrollment/enrolled')
  .get(authCtrl.requireSignin, enrollmentCtrl.listEnrolled)

router.route('/api/enrollment/new/:planId')
  .post(authCtrl.requireSignin, enrollmentCtrl.findEnrollment, enrollmentCtrl.create)

router.route('/api/enrollment/stats/:planId')
  .get(enrollmentCtrl.enrollmentStats)

router.route('/api/enrollment/complete/:enrollmentId')
  .put(authCtrl.requireSignin, enrollmentCtrl.isAthlete, enrollmentCtrl.complete)

router.route('/api/enrollment/:enrollmentId')
  .get(authCtrl.requireSignin, enrollmentCtrl.isAthlete, enrollmentCtrl.read)
  .delete(authCtrl.requireSignin, enrollmentCtrl.isAthlete, enrollmentCtrl.remove)

router.param('planId', planCtrl.planByID)
router.param('enrollmentId', enrollmentCtrl.enrollmentByID)

export default router
