import React from 'react'
import MainRouter from './MainRouter'
import {BrowserRouter as Router} from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme'
import { hot } from 'react-hot-loader'
import './Style.css';

const App = () => {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }, [])
  return (
  <Router>
      <ThemeProvider theme={theme}>
        <MainRouter/>
      </ThemeProvider>
  </Router>
)}

export default hot(module)(App)
