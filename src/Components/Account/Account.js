import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Grid,
  TextField,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { updateUserInfo } from "../../Redux/actions";

export default function Account() {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [username, setUsername] = useState(user.username);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);

  const handleChange = (e, setter) => setter(e.target.value);

  const handleSave = () => {
    //temporary change, need to re-authenticate with new JWT token after any account information update
    dispatch(updateUserInfo({ username, firstName, lastName, email }));
  };

  const handleCancel = () => {
    setUsername(user.username);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
  };

  return (
    <Box sx={{ paddingTop: '100px'}}>
      <Grid container spacing={3} sx={{ justifyContent: "center"}} >
        <Grid container item xs={12} sx={{ justifyContent: "center"}} >
          <IconButton>
            <Avatar sx={{ height: "5em",     width: "5em", }} />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            fullWidth
            onChange={(e) => handleChange(e, setUsername)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="First Name"
            variant="outlined"
            value={firstName}
            fullWidth
            onChange={(e) => handleChange(e, setFirstName)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Last Name"
            variant="outlined"
            value={lastName}
            fullWidth
            onChange={(e) => handleChange(e, setLastName)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            fullWidth
            onChange={(e) => handleChange(e, setEmail)}
          />
        </Grid>
        <Grid item container xs={12} sx={{ justifyContent: "center"}} >
          <Button
            variant="outlined"
            onClick={handleCancel}
          >
            Reset
          </Button>
          <Button
            variant="outlined"
            onClick={handleSave}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
