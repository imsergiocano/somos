import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import {Link} from 'react-router-dom'
import auth from './../auth/auth-helper'
import Enroll from './../enrollment/Enroll'

const useStyles = makeStyles(theme => ({
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  },
  media: {
    minHeight: 400
  },
  gridList: {
    width: '100%',
    minHeight: 200,
    padding: '16px 0 0px'
  },
  tile: {
    textAlign: 'center',
    border: '1px solid #cecece',
    backgroundColor:'#04040c'
  },
  image: {
    height: '100%'
  },
  tileBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    textAlign: 'left'
  },
  tileTitle: {
    fontSize:'1.1em',
    marginBottom:'5px',
    color:'#fffde7',
    display:'block'
  },
  action:{
    margin: '0 10px'
  }
}))

export default function Plans(props){
  const classes = useStyles()
  const findCommon = (plan) => {
    return !props.common.find((enrolled)=>{return enrolled.plan._id == plan._id})
  }
    return (
        <GridList cellHeight={220} className={classes.gridList} cols={2}>
          {props.plans.map((plan, i) => {
            return (
            findCommon(plan) &&
              <GridListTile className={classes.tile} key={i} style={{padding:0}}>
                <Link to={"/plan/"+plan._id}><img className={classes.image} src={'/api/plans/photo/'+plan._id} alt={plan.name} /></Link>
                <GridListTileBar className={classes.tileBar}
                  title={<Link to={"/plan/"+plan._id} className={classes.tileTitle}>{plan.name}</Link>}
                  subtitle={<span>{plan.category}</span>}
                  actionIcon={
                    <div className={classes.action}>
                    {auth.isAuthenticated() ? <Enroll planId={plan._id}/> : <Link to="/signin">Sign in to Enroll</Link>}
                    </div>
                  }
                />
              </GridListTile>)
              }
          )}
        </GridList>
    )
}

Plans.propTypes = {
  plans: PropTypes.array.isRequired
}
