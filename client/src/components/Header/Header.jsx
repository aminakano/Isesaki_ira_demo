import React from 'react';
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, IconButton, Typography, Grid } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import styles from "./Header.module.css";
import img from "../../images/icon.png";

const Header = ({ loginStatus }) => {
  const loginBtn = <Link to="/login">Login</Link>;
  const signupBtn = <Link to="/signup">Sign Up</Link>;
  const logoutBtn = <Link to="/">Logout</Link>;
  const path = window.location.pathname;
  const isLoggedIn = loginStatus;

  let btn;
  if(path === "/login") {
    btn = signupBtn;
  } else if(path === "/signup") {
    btn = loginBtn
  }

  const handleClick = e => {
    window.location.pathname = "/"
  }
  // Todo: implement logout function
  return (
    <AppBar position="static" className={styles.header}>
      <Toolbar className={styles.toolbar}>
        <Grid container alignItems="center" onClick={handleClick} className={styles.logo}>
          <Grid item>
            <img src={img} alt="logo" className={styles.img} />
          </Grid>
          <Grid item >
            <Typography variant="h5" className={styles.title} noWrap>Dashboard</Typography>
          </Grid>
        </Grid>
        <Grid container></Grid>
        <Grid container></Grid>
        <Grid container></Grid>
        <Grid container></Grid>
        <Grid container justify="flex-end">
          {isLoggedIn ? <Button className={styles.button}>
            {logoutBtn} </Button> 
            : <Button className={styles.button}>{btn}</Button>
          }
          <Grid item>
            <IconButton>
              <MenuIcon className={styles.menu}/>
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default Header
