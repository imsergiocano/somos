import React, {useState, useEffect}  from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Edit from '@material-ui/icons/Edit'
import PeopleIcon from '@material-ui/icons/Group'
import CompletedIcon from '@material-ui/icons/VerifiedUser'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import {read, update} from './api-plan.js'
import {enrollmentStats} from './../enrollment/api-enrollment'
import {Link, Redirect} from 'react-router-dom'
import auth from './../auth/auth-helper'
import DeletePlan from './DeletePlan'
import Divider from '@material-ui/core/Divider'
import NewSession from './NewSession'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Enroll from './../enrollment/Enroll'

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        maxWidth: 800,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(12)
      }),
  flex:{
    display:'flex',
    marginBottom: 20
  },
  card: {
    padding:'24px 40px 40px'
  },
  subheading: {
    margin: '10px',
    color: theme.palette.openTitle
  },
  details: {
    margin: '16px',
  },
  sub: {
    display: 'block',
    margin: '3px 0px 5px 0px',
    fontSize: '0.9em'
  },
  media: {
    height: 190,
    display: 'inline-block',
    width: '100%',
    marginLeft: '16px'
  },
  icon: {
    verticalAlign: 'sub'
  },
  category:{
    color: '#5c5c5c',
    fontSize: '0.9em',
    padding: '3px 5px',
    backgroundColor: '#dbdbdb',
    borderRadius: '0.2em',
    marginTop: 5
  },
  action: {
    margin: '10px 0px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  statSpan: {
    margin: '7px 10px 0 10px',
    alignItems: 'center',
    color: '#616161',
    display: 'inline-flex',
    '& svg': {
      marginRight: 10,
      color: '#b6ab9a'
    }
  },
  enroll:{
    float: 'right'
  }
}))

export default function Plan ({match}) {
  const classes = useStyles()
  const [stats, setStats] = useState({})
  const [plan, setPlan] = useState({coach:{}})
  const [values, setValues] = useState({
      redirect: false,
      error: ''
    })
  const [open, setOpen] = useState(false)
  const jwt = auth.isAuthenticated()
    useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
  
      read({planId: match.params.planId}, signal).then((data) => {
        if (data.error) {
          setValues({...values, error: data.error})
        } else {
          setPlan(data)
        }
      })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.planId])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    enrollmentStats({planId: match.params.planId}, {t:jwt.token}, signal).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setStats(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.planId])
  const removePlan = (plan) => {
    setValues({...values, redirect:true})
  }
  const addSession = (plan) => {
    setPlan(plan)
  }
  const clickPublish = () => {
    if(plan.sessions.length > 0){    
      setOpen(true)
    }
  }
  const publish = () => {
    let planData = new FormData()
      planData.append('published', true)
      update({
          planId: match.params.planId
        }, {
          t: jwt.token
        }, planData).then((data) => {
          if (data && data.error) {
            setValues({...values, error: data.error})
          } else {
            setPlan({...plan, published: true})
            setOpen(false)
          }
      })
  }
  const handleClose = () => {
    setOpen(false)
  }
  if (values.redirect) {
    return (<Redirect to={'/coach/plans'}/>)
  }
    const imageUrl = plan._id
          ? `/api/plans/photo/${plan._id}?${new Date().getTime()}`
          : '/api/plans/defaultphoto'
    return (
        <div className={classes.root}>
              <Card className={classes.card}>
                <CardHeader
                  title={plan.name}
                  subheader={<div>
                        <Link to={"/user/"+plan.coach._id} className={classes.sub}>By {plan.coach.name}</Link>
                        <span className={classes.category}>{plan.category}</span>
                      </div>
                    }
                  action={<>
             {auth.isAuthenticated().user && auth.isAuthenticated().user._id == plan.coach._id &&
                (<span className={classes.action}>
                  <Link to={"/train/plan/edit/" + plan._id}>
                    <IconButton aria-label="Edit" color="secondary">
                      <Edit/>
                    </IconButton>
                  </Link>
                {!plan.published ? (<>
                  <Button color="secondary" variant="outlined" onClick={clickPublish}>{plan.sessions.length == 0 ? "Add atleast 1 session to publish" : "Publish"}</Button>
                  <DeletePlan plan={plan} onRemove={removePlan}/>
                </>) : (
                  <Button color="primary" variant="outlined">Published</Button>
                )}
                </span>)
             }
                {plan.published && (<div>
                  <span className={classes.statSpan}><PeopleIcon /> {stats.totalEnrolled} enrolled </span>
                  <span className={classes.statSpan}><CompletedIcon/> {stats.totalCompleted} completed </span>
                  </div>
                  )}
                
                </>
            }
                />
                <div className={classes.flex}>
                  <CardMedia
                    className={classes.media}
                    image={imageUrl}
                    title={plan.name}
                  />
                  <div className={classes.details}>
                    <Typography variant="body1" className={classes.subheading}>
                        {plan.description}<br/>
                    </Typography>
                    
              {plan.published && <div className={classes.enroll}><Enroll planId={plan._id}/></div>} 
                    
                    
                  </div>
                </div>
                <Divider/>
                <div>
                <CardHeader
                  title={<Typography variant="h6" className={classes.subheading}>Sesiones</Typography>
                }
                  subheader={<Typography variant="body1" className={classes.subheading}>{plan.sessions && plan.sessions.length} sesiones</Typography>}
                  action={
             auth.isAuthenticated().user && auth.isAuthenticated().user._id == plan.coach._id && !plan.published &&
                (<span className={classes.action}>
                  <NewSession planId={plan._id} addSession={addSession}/>
                </span>)
            }
                />
                <List>
                {plan.sessions && plan.sessions.map((session, index) => {
                    return(<span key={index}>
                    <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                        {index+1}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={session.title}
                    />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    </span>)
                }
                )}
                </List>
                </div>
              </Card>
              <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Publish plan</DialogTitle>
                <DialogContent>
                  <Typography variant="body1">Publishing your plan will make it live to athletes for enrollment. </Typography><Typography variant="body1">Make sure all sessions are added and ready for publishing.</Typography></DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary" variant="contained">
                  Cancel
                </Button>
                <Button onClick={publish} color="secondary" variant="contained">
                  Publish
                </Button>
              </DialogActions>
             </Dialog>   
        </div>)
}
