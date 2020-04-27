import React, { Component } from 'react';
import API from '../utils/API';
import { Redirect } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
class Signup extends Component {
	constructor() {
		super()
		this.state = {
			username: '',
			password: '',
			firstname: '',
			lastname: '',
			email: '',
			confirmPassword: '',
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
		console.log('sign-up handleSubmit');
		event.preventDefault();
		if (this.state.password === this.state.confirmPassword) {
			if(this.state.errMsg === "") {
				API.registerUser({
					firstname: this.state.firstname,
					lastname: this.state.lastname,
					email: this.state.email,
					username: this.state.username,
					password: this.state.password
				})
				.then(response => {
					console.log(response);
					if (!response.data.error) {
						console.log('successful signup');
						this.setState({
							redirectTo: '/login'
						})
					} else {
						console.log(response.data.error);
						this.setState({ errMsg: response.data.error});
					}
				}).catch(error => {
					console.log('signup error: ')
					console.log(error)
				})
			}
		}
		else {
			console.log('Passwords does not match');
			this.setState({ errMsg: "Passwords do not match." });
		}
	}

	render() {
		if (this.state.redirectTo) {
			return <Redirect to={{ pathname: this.state.redirectTo }} />
		} else {
			return (
				<div className="SignupForm">
					<h4>Sign up</h4>
					<form className="form-horizontal" onSubmit={this.handleSubmit}>
						<div className="form-group">
							<div className="col-sm-5 col-md-3 col-lg-2 col-xl-2 col-ml-auto">
								<label className="form-label" htmlFor="firstname">First Name</label>
							</div>
							<div className="col-sm-7 col-md-5 col-lg-3 col-xl-3 col-mr-auto">
								<input className="form-input"
									type="text"
									id="firstname"
									name="firstname"
									placeholder="John"
									value={this.state.firstname}
									onChange={this.handleChange}
								/>
							</div>
						</div>
						<div className="form-group">
							<div className="col-sm-5 col-md-3 col-lg-2 col-xl-2 col-ml-auto">
								<label className="form-label" htmlFor="lastname">Last Name</label>
							</div>
							<div className="col-sm-7 col-md-5 col-lg-3 col-xl-3 col-mr-auto">
								<input className="form-input"
									type="text"
									id="lastname"
									name="lastname"
									placeholder="Doe"
									value={this.state.lastname}
									onChange={this.handleChange}
								/>
							</div>
						</div>
						<div className="form-group">
							<div className="col-sm-5 col-md-3 col-lg-2 col-xl-2 col-ml-auto">
								<label className="form-label" htmlFor="email">Email</label>
							</div>
							<div className="col-sm-7 col-md-5 col-lg-3 col-xl-3 col-mr-auto">
								<input className="form-input"
									type="text"
									id="email"
									name="email"
									placeholder="example@email.com"
									value={this.state.email}
									onChange={this.handleChange}
								/>
							</div>
						</div>
						<div className="form-group">
							<div className="col-sm-5 col-md-3 col-lg-2 col-xl-2 col-ml-auto">
								<label className="form-label" htmlFor="username">Username</label>
							</div>
							<div className="col-sm-7 col-md-5 col-lg-3 col-xl-3 col-mr-auto">
								<input className="form-input"
									type="text"
									id="username"
									name="username"
									placeholder="Username"
									value={this.state.username}
									onChange={this.handleChange}
								/>
							</div>
						</div>
						<div className="form-group">
							<div className="col-sm-5 col-md-3 col-lg-2 col-xl-2 col-ml-auto">
								<label className="form-label" htmlFor="password">Password</label>
							</div>
							<div className="col-sm-7 col-md-5 col-lg-3 col-xl-3 col-mr-auto">
								<input className="form-input"
									placeholder="******"
									type="password"
									name="password"
									value={this.state.password}
									onChange={this.handleChange}
								/>
							</div>
						</div>
						<div className="form-group">
							<div className="col-sm-5 col-md-3 col-lg-2 col-xl-2 col-ml-auto">
								<label className="form-label" htmlFor="confirmPassword">Confirm password</label>
							</div>
							<div className="col-sm-7 col-md-5 col-lg-3 col-xl-3 col-mr-auto">
								<input className="form-input"
									placeholder="******"
									type="password"
									name="confirmPassword"
									value={this.state.confirmPassword}
									onChange={this.handleChange}
								/>
								<p className="errMsg">{this.state.errMsg}</p>
							</div>
						</div>
						<div className="form-group ">
							<div className="col-sm-5 col-md-3 col-lg-2 col-xl-2 col-ml-auto"></div>
							<div className="col-sm-7 col-md-5 col-lg-3 col-xl-3 col-mr-auto">
								<div style={{ textAlign: "left" }} className="col-3 col-mr-auto">
									<Button compact size='tiny' color='purple' type="submit">Submit</Button>
								</div>
							</div>
						</div>
					</form>
				</div>
			)
		}
	}
}

export default Signup;
