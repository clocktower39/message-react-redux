import React, { useState } from "react";
import { Grid, TextField, makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";

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

  const [username, setUsername] = useState(user.username);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);

  const classes = useStyles();

  const handleChange = (e, setter) => setter(e.target.value);

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
      </Grid>
    </div>
  );
}
