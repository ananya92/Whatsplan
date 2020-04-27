import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import API from "../utils/API";
import { Dropdown } from 'semantic-ui-react';
class Navbar extends Component {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
        this.handleAccountSelect = this.handleAccountSelect.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    logout(event) {
        event.preventDefault();
        console.log('logging out');
        API.logoutUser().then(response => {
            console.log(response.data);
            if (response.status === 200) {
                this.props.updateUser({
                    loggedIn: false,
                    username: null,
                    planName: null
                });
            }
        }).catch(error => {
            console.log('Logout error')
        })
    }
    handleAccountSelect(event, data) {
        event.preventDefault();
        console.log("Selected:");
        console.log(data.text);
    }
    handleClick(event, data) {
        event.preventDefault();
    }
    render() {
        const loggedIn = this.props.loggedIn;
        const isPlanPage = this.props.planName !== null ? true : false;
        return (
            <div>
                {isPlanPage === true ? (
                    <header className="navbar App-header" id="nav-container">
                        <section className="navbar-center">
                            <h3 className="App-title">{this.props.planName}</h3>
                        </section>
                        <section className="navbar-section">
                            <Link to="/dashboard" className="btn btn-link text-secondary">
                                <span className="text-secondary"><i className="fas fa-chart-bar"></i></span>
                            </Link>
                            <Link to="#" className="btn btn-link text-secondary">
                                <span className="text-secondary"><i class="far fa-bell"></i></span>
                            </Link>
                            <Link to="#" className="btn btn-link text-secondary">
                                <Dropdown text={<i class="far fa-user" />} onClick={this.handleClick}>
                                    <Dropdown.Menu style={{ left: 'auto', right: 0 }}>
                                        <Dropdown.Item text='Plan History' onClick={this.handleAccountSelect} />
                                        <Dropdown.Item text='Account' onClick={this.handleAccountSelect} />
                                        <Dropdown.Item text='Logout' onClick={this.logout} />
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
                            {loggedIn ? (
                                <section className="navbar-section">
                                    <Link to="/dashboard" className="btn btn-link text-secondary">
                                        <span className="text-secondary"><i className="fas fa-chart-bar"></i></span>
                                    </Link>
                                    <Link to="#" className="btn btn-link text-secondary">
                                        <span className="text-secondary"><i class="far fa-bell"></i></span>
                                    </Link>
                                    <Link to="#" className="btn btn-link text-secondary">
                                        <Dropdown text={<i class="far fa-user" />} onClick={this.handleClick}>
                                            <Dropdown.Menu style={{ left: 'auto', right: 0 }}>
                                                <Dropdown.Item text='Plan History' onClick={this.handleAccountSelect} />
                                                <Dropdown.Item text='Account' onClick={this.handleAccountSelect} />
                                                <Dropdown.Item text='Logout' onClick={this.logout} />
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
}

export default Navbar;