import MessageList from './Components/MessageList';
import MessageInput from './Components/MessageInput';
import { Container } from '@material-ui/core';
import './App.css';

function App() {
  return (
      <Container className="app" maxWidth="sm">
        <MessageList />
        <MessageInput />
      </Container>
  );
}

export default App;
