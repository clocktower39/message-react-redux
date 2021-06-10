import Navbar from './Components/Navbar';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Chat from './Components/Chat/Chat';
import Account from './Components/Account/Account';
import AuthRoute from './Components/AuthRoute';
import { Container, makeStyles } from '@material-ui/core';

import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

const useStyles = makeStyles({
  root: {
    height: '100%',
    backgroundColor: '#2C2F33',
  }
});

function App(props) {
  const classes = useStyles();
  return (
      <Container className={classes.root} maxWidth="sm">
        <Router basename="/message/">
        <Navbar />
          <Switch>
            <AuthRoute exact path="/" component={Chat} socket={props.socket} />
            <AuthRoute exact path="/account" component={Account} props={props} />
            <Route exact path="/login"><Login /></Route>
            <Route exact path="/signup"><SignUp /></Route>
          </Switch>
        </Router>
      </Container>
  );
}

const mapStateToProps = (state) => ({
  messages: [...state.messages],
  user: {...state.user},
})

export default connect(mapStateToProps)(App);
