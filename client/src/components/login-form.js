import React, { useState } from 'react';
import API from "../utils/API";
import { Button } from 'semantic-ui-react';
import { usePlanContext } from "../utils/GlobalState";
import history from "../utils/history";

function LoginForm(props) {
    const [state, dispatch] = usePlanContext();
    const [loginState, setLoginState] = useState({
        username: '',
        password: '',
        errMsg: ''
    });

    function handleChange(event) {
        setLoginState({
            ...loginState,
            [event.target.name]: event.target.value,
            errMsg: ""
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log('handleSubmit');

        API.loginUser({
            username: loginState.username,
            password: loginState.password
        })
            .then(response => {
                console.log('login response: ');
                console.log(response);
                if (response.data.status !== null && response.data.status === "error") {
                    setLoginState({ ...loginState, errMsg: response.data.message });
                }
                else {
                    // update App.js state
                    props.updateUser({
                        loggedIn: true,
                        email: response.data.email,
                        firstname: response.data.firstname
                    })
                    dispatch({ type: "initUser", data: response.data });
                    // redirect to home
                    history.push("/");      
                }
            }).catch(error => {
                console.log('login error: ')
                console.log(error);
            })
    }

    return (
            <div>
                <h4>Login</h4>
                <form className="form-horizontal" onSubmit={handleSubmit}>
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
                                value={loginState.username}
                                onChange={handleChange}
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
                                value={loginState.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <p className="errMsg">{loginState.errMsg}</p>
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

export default LoginForm;
