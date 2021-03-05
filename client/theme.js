import { createMuiTheme } from '@material-ui/core/styles'
import { pink } from '@material-ui/core/colors'

const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
      fontFamily: "'Montserrat', sans-serif",
      boxSizing: "border-box",
      margin: "0",
      padding: "0",
    },
    palette: {
      primary: {
      light: '#4dabf5',
      main: '#2196f3',
      dark: '#1769aa',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ab003c',
      main: '#f50057',
      dark: '#f73378',
      contrastText: '#000',
    },
      openTitle: '#3f4771',
      protectedTitle: pink['400'],
      type: 'light'
    }
  })

  export default theme