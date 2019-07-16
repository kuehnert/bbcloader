import React from 'react'
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import { ThemeProvider } from '@material-ui/styles';

const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: 'dark',
      primary: yellow,
      secondary: red,
    },
    status: {
      danger: 'orange',
    },
  })
);

function Themed(props) {
  return (
    <ThemeProvider theme={theme}>
      {props.children}
    </ThemeProvider>
  )
}

export default Themed;
