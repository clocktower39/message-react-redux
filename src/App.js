import MessageList from './Components/MessageList';
import MessageInput from './Components/MessageInput';
import { Container, makeStyles } from '@material-ui/core';
import './App.css';

const useStyles = makeStyles({
  root: {
    height: '100%',
  },
  app: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflowY: 'auto',
  }
});

function App() {
  const classes = useStyles();
  return (
      <Container className={classes.root} maxWidth="sm">
        <div className={classes.app} >
          <MessageList />
          <MessageInput />
        </div>
      </Container>
  );
}

export default App;
