import Navbar from './Components/Navbar';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Chat from './Components/Chat/Chat';
import Account from './Components/Account/Account';
import AuthRoute from './Components/AuthRoute';
import { Container, ThemeProvider } from '@mui/material';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { theme } from './theme';


function App(props) {
  return (
    <ThemeProvider theme={theme} >
      <Container sx={{
        height: '100%',
        backgroundColor: '#2C2F33',
      }} maxWidth="sm">
        <Router basename="/message/">
          <Navbar />
          <Switch>
            <AuthRoute exact path="/" component={Chat} socket={props.socket} />
            <AuthRoute exact path="/account" component={Account} />
            <Route exact path="/login"><Login /></Route>
            <Route exact path="/signup"><SignUp /></Route>
          </Switch>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;
