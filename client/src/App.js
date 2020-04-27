import React, { Component } from "react";
import { Route, Link } from 'react-router-dom';
// components
import Signup from './components/sign-up';
import LoginForm from './components/login-form';
import Navbar from './components/navbar';
import Home from './components/home';
import Plan from "./components/plan";
import API from './utils/API';
import "./App.css";
import { PlanContextProvider } from "./utils/GlobalState";

class App extends Component {
  constructor() {
    super()
    this.state = {
      loggedIn: false,
      email: null,
      firstname: null,
      planName: null,
      planId: null
    }

    this.getUser = this.getUser.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.updateUser = this.updateUser.bind(this)
  }

  componentDidMount() {
    this.getUser();
  }

  updateUser(userObject) {
    this.setState(userObject);
  }

  getUser() {
    API.getUser().then(response => {
      console.log('Get user response: ');
      console.log(response.data);
      if (response.data.user) {
        console.log('Get User: There is a user saved in the server session: ');

        this.setState({
          loggedIn: true,
          email: response.data.user.email,
          firstname: response.data.user.firstname
        })
      } else {
        console.log('Get user: no user');
        this.setState({
          loggedIn: false,
          email: null,
          firstname: null
        })
      }
    })
  }
  render() {
    return (
      <div className="App">
        <PlanContextProvider>
        <Navbar updateUser={this.updateUser} loggedIn={this.state.loggedIn} planName={this.state.planName}/>
        {/* greet user if logged in: */}
        {this.state.loggedIn &&
          <p>Welcome {this.state.firstname}!</p>
        }
        {/* Routes to different components */}
        <Route
          exact path="/"
          render={() =>
            <Home
            updateUser={this.updateUser} loggedIn={this.state.loggedIn} email={this.state.email}
            />}
        />
        <Route
          path="/login"
          render={() =>
            <LoginForm
              updateUser={this.updateUser}
            />}
        />
        <Route
          path="/signup"
          render={() =>
            <Signup />}
        />
        <Route
          path="/plan"
          render={() =>
            <Plan planName={this.state.planName}/>}
        />
        </PlanContextProvider>
      </div>
    );
  }
}

export default App;
