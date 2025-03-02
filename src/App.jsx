import Navbar from './Components/Navbar';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Chat from './Components/Chat/Chat';
import Account from './Components/Account/Account';
import AuthRoute from './Components/AuthRoute';
import NotFoundPage from "./Components/NotFoundPage";
import { Container, ThemeProvider } from '@mui/material';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import { theme } from './theme';


function App({ socket }) {
  return (
    <ThemeProvider theme={theme} >
      <Container sx={{
        height: '100%',
        backgroundColor: '#2C2F33',
      }} maxWidth="sm">
        <Router>
          <Navbar />
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<SignUp />} />

            <Route exact path="/" element={<AuthRoute />}>
              <Route exact path="/" element={<Chat socket={socket} />} />
            </Route>
            <Route exact path="/account" element={<AuthRoute />}>
              <Route exact path="/account" element={<Account />} />
            </Route>

            <Route exact path="/*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;
