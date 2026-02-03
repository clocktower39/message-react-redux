import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Logout as LogoutIcon, Settings } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { serverURL, logoutUser } from "../Redux/actions";

export const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    dispatch(logoutUser()).then(() => handleClose());
  };

  return (
    <AppBar
      sx={{
        backgroundColor: "rgba(21, 25, 34, 0.92)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            component={Link}
            to="/"
            variant="h5"
            sx={{
              display: "flex",
              textDecoration: "none",
              color: "var(--accent)",
              fontFamily: "Poppins",
              fontWeight: 700,
              letterSpacing: "-0.4px",
            }}
          >
            Campground
            <img
              src={"/message/img/BonfireLogo.png"}
              alt="Bonfire logo"
              style={{ height: "25px", width: "25px", display: "flex", alignSelf: "center" }}
            />
          </Typography>
        </Box>

        {!user.username ? (
          location.pathname === "/signup" ? (
            <Typography component={Link} to="/">
              <Button variant="contained">Login</Button>
            </Typography>
          ) : (
            <Typography component={Link} to="/signup">
              <Button variant="contained">Sign Up</Button>
            </Typography>
          )
        ) : (
          <Box>
            <IconButton sx={{ color: "white" }} onClick={handleClick}>
              <Avatar
                src={user.profilePicture ? `${serverURL}/user/image/${user.profilePicture}` : null}
              />
            </IconButton>
          </Box>
        )}
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              color: "#fff",
              bgcolor: "var(--bg-1)",
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "var(--bg-1)",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem component={Link} to="/account">
          <Avatar
            src={user.profilePicture ? `${serverURL}/user/image/${user.profilePicture}` : null}
          />{" "}
          My account
        </MenuItem>
        <MenuItem component={Link} to="/channels">
          <ListItemIcon>
            <Settings fontSize="small" sx={{ color: "#fff" }} />
          </ListItemIcon>
          Manage channels
        </MenuItem>
        <MenuItem component={Link} to="/friends">
          <ListItemIcon>
            <Settings fontSize="small" sx={{ color: "#fff" }} />
          </ListItemIcon>
          Friends
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "#fff" }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
