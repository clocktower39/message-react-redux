import React, { useState } from "react";
import {
  Avatar,
  Box,
  Container,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Input,
  Stack,
  TextField,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { updateUserInfo, uploadProfilePicture, removeProfilePicture, serverURL, } from "../../Redux/actions";

export default function Account() {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [profilePicture, setProfilePicture] = useState(user.profilePicture || null);
  const [profilePictureDialog, setProfilePictureDialog] = useState(false);

  const [username, setUsername] = useState(user.username);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);

  const handleOpenProfilePictureDialog = () => setProfilePictureDialog(prev => !prev);

  const handleChange = (e, setter) => setter(e.target.value);

  const handlePhoto = (e) => {
    e.preventDefault();
    setProfilePicture(e.target.files[0]);
  };

  const handlePhotoSubmit = () => {
    const formData = new FormData();
    formData.append("file", profilePicture);
    dispatch(uploadProfilePicture(formData));
  }

  const handlePhotoRemove = () => {
    dispatch(removeProfilePicture());
  }

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
    <Container maxWidth="md" sx={{ paddingTop: '100px' }}>
      <Stack spacing={3}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton onClick={handleOpenProfilePictureDialog}>
            <Avatar sx={{ height: "5em", width: "5em" }} src={user.profilePicture ? `${serverURL}/user/image/${user.profilePicture}` : null} />
          </IconButton>
        </Box>
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          fullWidth
          onChange={(e) => handleChange(e, setUsername)}
        />
        <TextField
          label="First Name"
          variant="outlined"
          value={firstName}
          fullWidth
          onChange={(e) => handleChange(e, setFirstName)}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          value={lastName}
          fullWidth
          onChange={(e) => handleChange(e, setLastName)}
        />
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          fullWidth
          onChange={(e) => handleChange(e, setEmail)}
        />
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
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
        </Stack>
      </Stack>

      <Dialog open={profilePictureDialog} onClose={handleOpenProfilePictureDialog} >
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          <Input
            type="file"
            accept=".png, .jpg, .jpeg"
            name="photo"
            onChange={handlePhoto}
          />
        </DialogContent>
        <DialogActions>
          <Grid container sx={{ justifyContent: 'center', }}>
            <Button
              variant="outlined"
              onClick={handlePhotoRemove}
            >
              Remove Current
            </Button>
            <Button
              variant="outlined"
              onClick={handlePhotoSubmit}
            >
              Upload
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
