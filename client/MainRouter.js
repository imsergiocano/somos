import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'
import Plan from './plan/Plan'
import NewPlan from './plan/NewPlan'
import EditPlan from './plan/EditPlan'
import Enrollment from './enrollment/Enrollment'
import MyPlans from './plan/MyPlans'

const MainRouter = () => {
    return (<div>
      <Menu/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/users" component={Users}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/signin" component={Signin}/>
        <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
        <Route path="/user/:userId" component={Profile}/>
        <Route path="/plan/:planId" component={Plan}/>
        <PrivateRoute path="/train/plans" component={MyPlans}/>

        <PrivateRoute path="/train/plan/new" component={NewPlan}/>
        <PrivateRoute path="/train/plan/edit/:planId" component={EditPlan}/>
        <PrivateRoute path="/train/plan/:planId" component={Plan}/>
        <PrivateRoute path="/learn/:enrollmentId" component={Enrollment}/>
      </Switch>
    </div>)
}

export default MainRouter
