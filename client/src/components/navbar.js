import React, { Component, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import API from "../utils/API";
import { Dropdown } from 'semantic-ui-react';
import { usePlanContext } from "../utils/GlobalState";

function Navbar(props) {
    const [state, dispatch] = usePlanContext();
    useEffect(() => {
        if(!state.currentUser.email) {
            // there is no user in store, check in session. It can happen on page refresh
            API.getUser().then(response => {
                // check if user is logged in
                if (response.data.user) {
                    dispatch({ type: "initUser", data: response.data.user });
                }
                else {
                    dispatch({ type: "initUser", data: {} });
                }
            }).catch(error => {
                console.log('get user error: ', error);
            });
        }
    }, [])
    function logout(event) {
        event.preventDefault();
        console.log('logging out');
        API.logoutUser().then(response => {
            console.log(response.data);
            if (response.status === 200) {
                dispatch({ type: "initUser", data: {} });
                dispatch({ type: "initPlan", data: {} });
                dispatch({ type: "initMilestone", data: {} });
                dispatch({ type: "initTask", data: {} });
                props.updateUser({
                    loggedIn: false,
                    username: null,
                    planName: null
                });
            }
        }).catch(error => {
            console.log('Logout error')
        })
    }
    function handleAccountSelect(event, data) {
        event.preventDefault();
        console.log("Selected:");
        console.log(data.text);
    }
    function handleClick(event, data) {
        event.preventDefault();
    }
    return (
        <div>
            {state.currentTask.taskName && state.currentMilestone.milestoneName ? (
                <header className="navbar App-header" id="nav-container">
                <section className="navbar-center">
                <h3 className="App-title">{state.currentPlan.title} > {state.currentMilestone.milestoneName}</h3>
                </section>
                <section className="navbar-section">
                    <Link to="/dashboard" className="btn btn-link text-secondary">
                        <span className="text-secondary"><i className="fas fa-chart-bar"></i></span>
                    </Link>
                    <Link to="#" className="btn btn-link text-secondary">
                        <span className="text-secondary"><i class="far fa-bell"></i></span>
                    </Link>
                    <Link to="#" className="btn btn-link text-secondary">
                        <Dropdown text={<i class="far fa-user" />} onClick={handleClick}>
                            <Dropdown.Menu style={{ left: 'auto', right: 0 }}>
                                <Dropdown.Item text='Plan History' onClick={handleAccountSelect} />
                                <Dropdown.Item text='Account' onClick={handleAccountSelect} />
                                <Dropdown.Item text='Logout' onClick={logout} />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Link>
                    <Link to="/" className="btn btn-link text-secondary">
                        <span className="text-secondary"><i className="fas fa-home"></i></span>
                    </Link>
                </section>
            </header>
            )
            : 
            state.currentPlan.title ? (
                <header className="navbar App-header" id="nav-container">
                    <section className="navbar-center">
                        <h3 className="App-title">{state.currentPlan.title}</h3>
                    </section>
                    <section className="navbar-section">
                        <Link to="/dashboard" className="btn btn-link text-secondary">
                            <span className="text-secondary"><i className="fas fa-chart-bar"></i></span>
                        </Link>
                        <Link to="#" className="btn btn-link text-secondary">
                            <span className="text-secondary"><i class="far fa-bell"></i></span>
                        </Link>
                        <Link to="#" className="btn btn-link text-secondary">
                            <Dropdown text={<i class="far fa-user" />} onClick={handleClick}>
                                <Dropdown.Menu style={{ left: 'auto', right: 0 }}>
                                    <Dropdown.Item text='Plan History' onClick={handleAccountSelect} />
                                    <Dropdown.Item text='Account' onClick={handleAccountSelect} />
                                    <Dropdown.Item text='Logout' onClick={logout} />
                                </Dropdown.Menu>
                            </Dropdown>
                        </Link>
                        <Link to="/" className="btn btn-link text-secondary">
                            <span className="text-secondary"><i className="fas fa-home"></i></span>
                        </Link>
                    </section>
                </header>
            ) : (
                    <header className="navbar App-header" id="nav-container">
                        <section className="navbar-center">
                            <h3 className="App-title">Whatsplan</h3>
                        </section>
                        {state.currentUser.email ? (
                            <section className="navbar-section">
                                <Link to="/dashboard" className="btn btn-link text-secondary">
                                    <span className="text-secondary"><i className="fas fa-chart-bar"></i></span>
                                </Link>
                                <Link to="#" className="btn btn-link text-secondary">
                                    <span className="text-secondary"><i class="far fa-bell"></i></span>
                                </Link>
                                <Link to="#" className="btn btn-link text-secondary">
                                    <Dropdown text={<i class="far fa-user" />} onClick={handleClick}>
                                        <Dropdown.Menu style={{ left: 'auto', right: 0 }}>
                                            <Dropdown.Item text='Plan History' onClick={handleAccountSelect} />
                                            <Dropdown.Item text='Account' onClick={handleAccountSelect} />
                                            <Dropdown.Item text='Logout' onClick={logout} />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Link>
                            </section>
                        ) : (
                                <section className="navbar-section">
                                    <Link to="/" className="btn btn-link text-secondary">
                                        <span className="text-secondary"><i className="fas fa-home"></i></span>
                                    </Link>
                                    <Link to="/login" className="btn btn-link text-secondary">
                                        <span className="text-secondary">Login</span>
                                    </Link>
                                    <Link to="/signup" className="btn btn-link">
                                        <span className="text-secondary">Sign up</span>
                                    </Link>
                                </section>
                            )}
                    </header>
                )}
        </div>
    );
}

export default Navbar;