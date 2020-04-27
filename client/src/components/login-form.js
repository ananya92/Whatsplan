import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import API from "../utils/API";
import { Button } from 'semantic-ui-react';
class LoginForm extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            errMsg: '',
            redirectTo: null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
  
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            errMsg: ""
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('handleSubmit');

        API.loginUser({
                username: this.state.username,
                password: this.state.password
            })
            .then(response => {
                console.log('login response: ');
                console.log(response)
                if(response.data.status !== null && response.data.status === "error") {
                    this.setState({ errMsg: response.data.message});
                }
                else {
                    // update App.js state
                    this.props.updateUser({
                        loggedIn: true,
                        email: response.data.email,
                        firstname: response.data.firstname
                    })
                    // update the state to redirect to home
                    this.setState({
                        redirectTo: '/'
                    })
                }
            }).catch(error => {
                console.log('login error: ')
                console.log(error);
            })
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />
        } else {
            return (
                <div>
                    <h4>Login</h4>
                    <form className="form-horizontal" onSubmit={this.handleSubmit}>
						<div className="form-group">
							<div className="col-sm-5 col-md-3 col-lg-2 col-xl-2 col-ml-auto">
								<label className="form-label" htmlFor="username">Username</label>
							</div>
							<div className="col-sm-7 col-md-5 col-lg-3 col-xl-3 col-mr-auto">
								<input className="form-input"
									type="text"
									id="username"
									name="username"
									placeholder="johndoe"
									value={this.state.username}
									onChange={this.handleChange}
								/>
							</div>
						</div>
						<div className="form-group">
							<div className="col-sm-5 col-md-3 col-lg-2 col-xl-2 col-ml-auto">
								<label className="form-label" htmlFor="lastname">Password</label>
							</div>
							<div className="col-sm-7 col-md-5 col-lg-3 col-xl-3 col-mr-auto">
								<input className="form-input"
									type="password"
									id="password"
									name="password"
									placeholder="******"
									value={this.state.password}
									onChange={this.handleChange}
								/>
							</div>
						</div>
                        <p className="errMsg">{this.state.errMsg}</p>
                        <div className="form-group ">
							<div className="col-sm-5 col-md-3 col-lg-2 col-xl-2 col-ml-auto"></div>
							<div className="col-sm-7 col-md-5 col-lg-3 col-xl-3 col-mr-auto">
								<div style={{ textAlign: "left" }} className="col-3 col-mr-auto">
									<Button compact size='tiny' color='purple' type="submit">Login</Button>
								</div>
							</div>
						</div>
                    </form>
                </div>
            )
        }
    }
}

export default LoginForm
