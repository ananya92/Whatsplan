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
    // Adding the plan owner to the members as well so that the owner can also be assigned tasks
    const [newPlanState, setnewPlanState] = useState({
        members: []
    });
    const [redirectState, setRedirectState] = useState({
        redirectTo: ""
    })
    useEffect(() => {
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
        setnewPlanState({members: value});
    }
    return (
        <div>
            {redirectState.redirectTo !== "" ?
                <Redirect to={{ pathname: redirectState.redirectTo }} /> :
                loginState.loggedIn == true ?
                    <div>
                        <br/>
                        <h4>Lets get started!</h4>
                        <form className="form-horizontal" onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <div className="col-sm-5 col-md-3 col-lg-3 col-xl-3 col-ml-auto">
                                    <label className="form-label" htmlFor="newPlanName">Plan Name</label>
                                </div>
                                <div className="col-sm-7 col-md-5 col-lg-5 col-xl-5 col-mr-auto">
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
                                <div className="col-sm-5 col-md-3 col-lg-3 col-xl-3 col-ml-auto">
                                    <label className="form-label" htmlFor="newPlanName">Add collaborators</label>
                                </div>
                                <div className="col-sm-7 col-md-5 col-lg-5 col-xl-5 col-mr-auto">
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
