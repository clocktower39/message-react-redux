import Login from './Components/Login';
import Chat from './Components/Chat/Chat';
import { AppBar, Container, makeStyles, Typography } from '@material-ui/core';

import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

const useStyles = makeStyles({
  root: {
    height: '100%',
  },
  AppBar: {
    textAlign: 'center',
    padding: '15px',
  }
});

function App(props) {
  const classes = useStyles();
  return (
      <Container className={classes.root} maxWidth="sm">
        <AppBar className={classes.AppBar} >
          <Typography variant='h4'>Bonfire</Typography>
        </AppBar>
        <Router>
          <Switch>
            <Route exact path="/">
              {(!props.user.username)?<Login/>:<Chat />}
            </Route>
          </Switch>
        </Router>
      </Container>
  );
}

const mapStateToProps = (state) => ({
  messages: [...state.messages],
  user: {...state.user},
})

export default connect(mapStateToProps, null)(App);
