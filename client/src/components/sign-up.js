import React, { Component } from 'react'
import API from '../utils/API';
import { Redirect } from 'react-router-dom'

class Signup extends Component {
	constructor() {
		super()
		this.state = {
			username: '',
			password: '',
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
		console.log('sign-up handleSubmit, username: ');
		console.log(this.state.username);
		event.preventDefault();

		API.registerUser({
			username: this.state.username,
			password: this.state.password
		})
			.then(response => {
				console.log(response);
				if (!response.data.error) {
					console.log('successful signup')
					this.setState({ 
						redirectTo: '/login'
					})
				} else {
					console.log('username already taken')
					this.setState({ errMsg: "Username already taken."});
				}
			}).catch(error => {
				console.log('signup error: ')
				console.log(error)

			})
	}

render() {
	if (this.state.redirectTo) {
		return <Redirect to={{ pathname: this.state.redirectTo }} />
	} else {
		return (
			<div className="SignupForm">
				<h4>Sign up</h4>
				<form className="form-horizontal">
					<div className="form-group">
						<div className="col-1 col-ml-auto">
							<label className="form-label" htmlFor="username">Username</label>
						</div>
						<div className="col-3 col-mr-auto">
							<input className="form-input"
								type="text"
								id="username"
								name="username"
								placeholder="Username"
								value={this.state.username}
								onChange={this.handleChange}
							/>
							<p className="errMsg">{this.state.errMsg}</p>
						</div>
					</div>
					<div className="form-group">
						<div className="col-1 col-ml-auto">
							<label className="form-label" htmlFor="password">Password: </label>
						</div>
						<div className="col-3 col-mr-auto">
							<input className="form-input"
								placeholder="password"
								type="password"
								name="password"
								value={this.state.password}
								onChange={this.handleChange}
							/>
						</div>
					</div>
					<div className="form-group ">
						<div className="col-7"></div>
						<button
							className="btn btn-primary col-1 col-mr-auto"
							onClick={this.handleSubmit}
							type="submit"
						>Sign up</button>
					</div>
				</form>
			</div>
		)	
	}
}
}

export default Signup
