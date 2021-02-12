import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import styles from "./App.module.css";
import { fetchData } from "./api";
import { Cards, Header, SignUp, LogIn } from "./components";
import { getFromStorage, setInStorage } from "./util/storage";

import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { themeFile } from "./util/theme";

const theme = createMuiTheme(themeFile);

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isLoggedIn: false,
      userSession: "",
      loginData: {
        email: "",
        password: "",
        errors: {},
        loading: false,
        token: "",
      },
    };
  }

  async componentDidMount() {
    // Check if there is a new_user token generated in signup page
    const newUser = sessionStorage;
    const key = Object.keys(newUser)[0];

    if (newUser.length === 1 && key === "new_user") {
      this.setState({
        isLoggedIn: true,
      });
    }

    // Check if the token is correct when logging in second time or later
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj;
      const response = await fetch(`/api/users/verify?token=${token}`);
      const status = await response.json();

      if (status.success) {
        this.setState({
          isLoggedIn: true,
          userSession: obj,
        });
      } else {
        this.setState({
          isLoggedIn: false,
        });
      }
    }
    console.log(this);

    const fetchedData = await fetchData();
    this.setState({ data: fetchedData });
  }

  componentDidUpdate(prevProps) {
    console.log(prevProps);
    console.log(this.state.loginData);
    // if (this.state.loginData !== prevProps.loginData) {
    //   this.setState({ loginData: this.state.loginData });
    // }
  }

  async login(e) {
    if (typeof e == "undefined") e = window.event;
    e.preventDefault();
    const { email, password } = this.state.loginData;

    this.setState({
      loading: true,
    });

    try {
      const type = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      };
      const response = await fetch("/api/users/login", type);
      const status = await response.json();

      if (status.success) {
        setInStorage("the_main_app", { token: status.token });
        this.setState({
          loginData: {
            email: "",
            password: "",
            errors: status.message,
            loading: false,
            token: status.token,
          },
        });
        // return (window.location = "/");
      } else {
        this.setState({
          loginData: {
            errors: status.message,
            loading: false,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  handleChange = (e) => {
    if (typeof e == "undefined") e = window.event;
    e.preventDefault();
    console.log(e);
    console.log(this);
    this.setState({
      loginData: {
        [e.target.name]: e.target.value,
      },
    });
  };

  async logout(e) {
    const newUser = sessionStorage;
    const key = Object.keys(newUser)[0];
    if (newUser.length === 1 && key === "new_user") {
      this.setState({
        isLoggedIn: false,
      });
      sessionStorage.removeItem("new_user");
      window.location.pathname = "/login";
    }

    const obj = getFromStorage("the_main_app");
    console.log("logout");
    if (obj && obj.token) {
      const { token } = obj;
      const response = await fetch(`/api/users/logout?token=${token}`);
      const status = await response.json();
      if (status.success) {
        this.setState({
          isLoggedIn: false,
        });
        localStorage.removeItem("the_main_app");
        window.location.pathname = "/login";
      } else {
        this.setState({
          isLoggedIn: false,
        });
      }
    }
  }
  render() {
    const { data, isLoggedIn, userSession, loginData } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <div className={styles.container}>
          <Router>
            <Header
              loginStatus={isLoggedIn}
              token={userSession}
              logoutAction={(e) => this.logout(e)}
            />
            <Route exact path="/" render={() => <Cards data={data} />} />
            <Route path="/signup" component={SignUp} />
            <Route
              path="/login"
              render={() => (
                <LogIn
                  loginAction={(e) => this.login(e)}
                  formChange={this.handleChange}
                  data={loginData}
                />
              )}
            />
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
