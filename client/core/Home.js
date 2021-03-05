import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import {listPublished} from './../plan/api-plan'
import {listEnrolled, listCompleted} from './../enrollment/api-enrollment'
import Typography from '@material-ui/core/Typography'
import auth from './../auth/auth-helper'
import Plans from './../plan/Plans'
import Enrollments from '../enrollment/Enrollments'
import {Link} from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { MdArrowForward, MdKeyboardArrowRight  } from 'react-icons/md'

const useStyles = makeStyles(theme => ({
  heroContainer: {
    background: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 30px',
    height: '800px',
    position: 'relative',
    zIndex: '1',
  },
  heroContent: {
    zIndex: "3",
    maxWidth: "1200px",
    position: "absolute",
    padding: "8px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  heroP: {
    marginTop: "24px",
    color: "#050505",
    fontSize: "20px",
    textAlign: "center",
    maxWidth: "600px"
  },
  heroBtnWrapper: {
    marginTop: "32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  ArrowForward: {
    marginLeft: "8px",
    fontSize: "20px"
  },
  ArrowRight: {
    marginLeft: "8px",
    fontSize: "20px"
  },


  card: {
    width:'90%',
    margin: 'auto',
    marginTop: 20,
    marginBottom: theme.spacing(2),
    padding: 20,
    backgroundColor: '#ffffff' 
  },
  extraTop: {
    marginTop: theme.spacing(12)
  },
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
    padding: '16px 0 10px'
  },
  tile: {
    textAlign: 'center'
  },
  image: {
    height: '100%'
  },
  tileBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    textAlign: 'left'
  },
  enrolledTitle: {
    color:'#efefef',
    marginBottom: 5
  },
  action:{
    margin: '0 10px'
  },
  enrolledCard: {
    backgroundColor: '#616161',
  },
  divider: {
    marginBottom: 16,
    backgroundColor: 'rgb(157, 157, 157)'
  },
  noTitle: {
    color: 'lightgrey',
    marginBottom: 12,
    marginLeft: 8
  }
}))

export default function Home(){
  const classes = useStyles()
  const [hover, setHover] = useState(false);
  const jwt = auth.isAuthenticated()
  const [plans, setPlans] = useState([])
  const [enrolled, setEnrolled] = useState([])

    const onHover = () => {
        setHover(!hover);
    };

    useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
      listEnrolled({t: jwt.token}, signal).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          setEnrolled(data)
        }
      })
      return function cleanup(){
        abortController.abort()
      }
    }, [])

    useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
      listPublished(signal).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          setPlans(data)
        }
      })
      return function cleanup(){
        abortController.abort()
      }
    }, [])


    return (
      <>
       {!auth.isAuthenticated().user && (
      <div id="home" className={classes.heroContainer}>
       
        <div className={classes.heroContent}>
          <p className={classes.heroP}>Organiza tus planes con SOMOS.</p>
          <h1>planes</h1>
          <h1>&metas</h1>
          <div className={classes.heroBtnWrapper}>
            <Link to="/signin">
                <Button color="primary" autoFocus="autoFocus" variant="contained" onMouseEnter={onHover} onMouseLeave={onHover}>
                        Iniciar sesión {hover ? <MdArrowForward className={classes.ArrowForward}/> : <MdKeyboardArrowRight className={classes.ArrowRight}/>}
              </Button>
            </Link>
          </div>
        </div>
        
      </div>
      )}
      <div className={classes.extraTop}>
        {auth.isAuthenticated().user && (
        <Card className={`${classes.card} ${classes.enrolledCard}`}>
          <Typography variant="h6" component="h2" className={classes.enrolledTitle}>
              Plans you are enrolled in
          </Typography>
          {enrolled.length != 0 ? (<Enrollments enrollments={enrolled}/>)
                              : (<Typography variant="body1" className={classes.noTitle}>No plans.</Typography>)
          }
        </Card>
      )}
      <Card className={classes.card}>
        <Typography variant="h5" component="h2">
            All Plans
        </Typography>
        {(plans.length != 0 && plans.length != enrolled.length) ? (<Plans plans={plans} common={enrolled}/>) 
                            : (<Typography variant="body1" className={classes.noTitle}>No new plans.</Typography>)
        }
      </Card>
      </div>
    </>
    )
}

