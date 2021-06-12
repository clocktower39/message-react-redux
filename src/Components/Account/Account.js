import React, { useState } from "react";
import { Button, Grid, TextField, makeStyles } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { updateUserInfo } from '../../Redux/actions';

const useStyles = makeStyles({
  root: {
    paddingTop: "100px",
  },
  TextField: {
    "& input": {
        color: "#ccc",
      },
      "& label": {
        color: "#ccc",
      },
      '& label.Mui-focused': {
        color: "#ccc",
      },
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
          borderColor: '#ccc',
        },
      },
  },
});

export default function Account(props) {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [username, setUsername] = useState(user.username);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);

  const classes = useStyles();

  const handleChange = (e, setter) => setter(e.target.value);

  const handleSave = () => {
    //temporary change, need to re-authenticate with new JWT token after any account information update
    dispatch(updateUserInfo({username, firstName, lastName, email}))
  }

  const handleCancel = () => {
      setUsername(user.username);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justify="center">
        <Grid item xs={12}>
          <TextField
            className={classes.TextField}
            label="Username"
            variant="outlined"
            value={username}
            fullWidth
            onChange={(e) => handleChange(e, setUsername)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={classes.TextField}
            label="First Name"
            variant="outlined"
            value={firstName}
            fullWidth
            onChange={(e) => handleChange(e, setFirstName)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={classes.TextField}
            label="Last Name"
            variant="outlined"
            value={lastName}
            fullWidth
            onChange={(e) => handleChange(e, setLastName)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={classes.TextField}
            label="Email"
            variant="outlined"
            value={email}
            fullWidth
            onChange={(e) => handleChange(e, setEmail)}
          />
        </Grid>
        <Grid item container xs={12} justify="center" >
          <Button variant="outlined" 
            onClick={handleCancel}
          >Cancel</Button>
          <Button variant="outlined"
            onClick={handleSave}
          >Save</Button>
        </Grid>
      </Grid>
    </div>
  );
}
