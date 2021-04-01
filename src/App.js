import MessageList from './Components/MessageList';
import MessageInput from './Components/MessageInput';
import { AppBar, Container, makeStyles } from '@material-ui/core';
import './App.css';

const useStyles = makeStyles({
  root: {
    height: '100%',
  },
  app: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  }
});

function App() {
  const classes = useStyles();
  return (
      <Container className={classes.root} maxWidth="sm">
        <div className={classes.app} >
          <MessageList />
          <div><br /><br /></div>
        </div>
        <AppBar className={classes.appBar} position="fixed">
          <MessageInput />
        </AppBar>
      </Container>
  );
}

export default App;
