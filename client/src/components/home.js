import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import API from "../utils/API";
import { Redirect } from 'react-router-dom';

function Home(props) {
    const planRef = useRef();
    const [usersState, setUsersState] = useState({
        registeredUsers: []
    });
    const [loginState, setLoginState] = useState({
        loggedIn: false
    });
    const [newPlanState, setnewPlanState] = useState({
        members: []
    });
    const [currentPlansState, setCurrentPlansState] = useState({
        currentPlans: []
    });
    const [redirectState, setRedirectState] = useState({
        redirectTo: ""
    })
    useEffect(() => {
        // setting the planName state to null when home page is loaded so that the titlte bar shows Whatsplan instead of the plan name
        props.updateUser({ planName: null });
        API.getRegisteredUsers().then(response => {
            console.log("All registered users response:");
            console.log(response);
            // Removing the logged in user from the collaborators dropdown
            var filteredResponse = response.data.filter((user) => {
                return user.email !== props.email;
            })
            var userOptions = filteredResponse.map((user, index) => ({
                key: index,
                text: `${user.firstname} ${user.lastname} (${user.username})`,
                value: user.email,
            }));
            setUsersState({ registeredUsers: userOptions });
            // Fetching all the current plans of the user
            API.getCurrentPlans(props.email).then(response => {
                console.log("Current plans of user response: ", response);
                setCurrentPlansState({ currentPlans: response.data });
            })
                .catch(error => {
                    console.log('Getting current plans error: ')
                    console.log(error);
                })
        })
            .catch(error => {
                console.log('Getting registered users error: ')
                console.log(error);
            })
    }, [])

    useEffect(() => {
        setLoginState({ loggedIn: props.loggedIn });
    }, [props.loggedIn]);

    function handleFormSubmit(event) {
        event.preventDefault();
        var planMembers = newPlanState.members;
        planMembers.push(props.email);
        API.getUserByEmail(props.email).then(response => {
            API.newPlan({
                title: planRef.current.value,
                owner: response.data._id,
                members: planMembers,
                status: "Pending"
            })
                .then(response => {
                    // setting the plan name state so that the title in navbar shows the plan name when plan is loaded
                    props.updateUser({ planName: response.data.title });
                    console.log('successfully created new plan: ', response);
                    // Add the created plan to all the collaborator's plan array
                    planMembers.map(member => {
                        API.addPlanToUser(member, response.data._id)
                            .then(response1 => {
                                console.log("Added plan to user:", response1);
                            }).catch(error => {
                                console.log("Error while adding plan to user: ", error);
                            });
                    })
                    setRedirectState({
                        redirectTo: '/plan'
                    })
                }).catch(error => {
                    console.log('plan creation error: ', error);
                });
        }).catch(error => {
            console.log('get user by email error: ', error);
        });
    }
    function handleChange(e, { value }) {
        console.log(value);
        setnewPlanState({ members: value });
    }
    return (
        <div>
            {redirectState.redirectTo !== "" ?
                <Redirect to={{ pathname: redirectState.redirectTo }} /> :
                loginState.loggedIn == true ?
                    <div className="columns" style={{marginBottom: "30px"}}>
                        <br />
                        <div style={{marginRight: "10px"}} className="panel col-sm-12 col-md-4 col-lg-4 col-xl-4 col-ml-auto">
                            <div className="panel-header">
                                <div className="panel-title text-bold" style={{ textAlign: "left" }}><h4>Your current plans:</h4></div>
                            </div>
                            <div class="panel-body">
                                {currentPlansState.currentPlans.map(plan => (
                                    <div style={{ padding: "10px 0" }} className="tile">
                                        <div className="tile-icon">
                                            <span style={{ color: "purple" }}><i class="far fa-paper-plane"></i></span>
                                        </div>
                                        <div className="tile-content">
                                            <p className="tile-title" style={{ textAlign: "left" }}>{plan.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{marginLeft: "10px"}} className="panel col-sm-12 col-md-7 col-lg-7 col-xl-7 col-mr-auto">
                            <div className="panel-header">
                                <div className="panel-title text-bold" style={{}}><h4>Lets get started!</h4></div>
                            </div>
                            <div class="panel-body">
                                <form className="form-horizontal" onSubmit={handleFormSubmit}>
                                    <div className="form-group">
                                        <div className="col-sm-5 col-md-4 col-lg-4 col-xl-4 col-ml-auto">
                                            <label className="form-label" htmlFor="newPlanName">Plan Name</label>
                                        </div>
                                        <div className="col-sm-7 col-md-7 col-lg-7 col-xl-6 col-mr-auto">
                                            <input className="form-input"
                                                type="text"
                                                id="newPlanName"
                                                name="newPlanName"
                                                placeholder="What are you planning?"
                                                ref={planRef}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-sm-5 col-md-4 col-lg-4 col-xl-4 col-ml-auto">
                                            <label className="form-label" htmlFor="newPlanName">Add collaborators</label>
                                        </div>
                                        <div className="col-sm-7 col-md-7 col-lg-7 col-xl-6 col-mr-auto">
                                            <Dropdown
                                                clearable
                                                placeholder='Search..'
                                                fluid
                                                multiple
                                                search
                                                selection
                                                options={usersState.registeredUsers}
                                                fullTextSearch='true'
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-sm-5 col-md-3 col-lg-3 col-xl-3 col-ml-auto" />
                                        <div className="col-sm-7 col-md-5 col-lg-5 col-xl-5 col-mr-auto">
                                            <div className="col-2 col-mr-auto">
                                                <Button compact size='tiny' color='blue' type="submit">Submit</Button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div> :
                    <div>
                        <h4>Welcome to Whatsplan app!</h4>
                        <p>Please <a href="/login">login</a> or <a href="/signup">Sign up</a> to continue!</p>
                    </div>

            }
        </div>
    )
}

export default Home;
