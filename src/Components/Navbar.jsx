import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../Redux/actions";

export const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.removeItem("username");
    dispatch(logoutUser());
  };

  return (
    <AppBar
      sx={{
        backgroundColor: "#23272a",
      }}
    >
      <Toolbar
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography
          component={Link}
          to="/"
          variant="h4"
          sx={{ display: "flex", textDecoration: "none", color: "#FF5900" }}
        >
          Bonfire
          <img
            src={'/img/BonfireLogo.png'}
            alt="Bonfire logo"
            style={{ height: "25px", width: "25px", display: "flex", alignSelf: "center" }}
          />
        </Typography>

        {!user.username ? (
          location.pathname === "/signup" ? (
            <Typography component={Link} to="/" >
              <Button variant="contained">Login</Button>
            </Typography>
          ) : (
            <Typography component={Link} to="/signup">
              <Button variant="contained">Sign Up</Button>
            </Typography>
          )
        ) : (
          <div>
            <Link to="/account">
              <IconButton
                sx={user.username === "GUEST" ? { display: "none" } : { color: "white" }}
              >
                <Settings />
              </IconButton>
            </Link>
            <Button variant="contained" onClick={(e) => handleLogout()}>
              Logout
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
