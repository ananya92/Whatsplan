import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import API from "../utils/API";
import { usePlanContext } from "../utils/GlobalState";
import history from "../utils/history";
import { urlencoded } from 'body-parser';

function Home(props) {
    const planRef = useRef();
    const [state, dispatch] = usePlanContext();
    const [usersState, setUsersState] = useState({
        registeredUsers: []
    });
    const [newPlanState, setnewPlanState] = useState({
        members: []
    });
    const [currentPlansState, setCurrentPlansState] = useState({
        currentPlans: []
    });

    useEffect(() => {
        // setting the planName state to null when home page is loaded so that the title bar shows Whatsplan instead of the plan name
        props.updateUser({ planName: null });
        dispatch({ type: "initPlan", data: null });
        dispatch({ type: "initTask", data: null });
        dispatch({ type: "initMilestone", data: null });
        if (state.currentUser) {
            API.getRegisteredUsers().then(response => {
                console.log("All registered users response:");
                console.log(response);
                // Removing the logged in user from the collaborators dropdown
                var filteredResponse = response.data.filter((user) => {
                    return user.email !== state.currentUser.email;
                })
                var userOptions = filteredResponse.map((user, index) => ({
                    key: index,
                    text: `${user.firstname} ${user.lastname} (${user.username})`,
                    value: user.email,
                }));
                // Fetching all the current plans of the user
                API.getCurrentPlans().then(response => {
                    console.log("Current plans of user response: ", response);
                    setCurrentPlansState({ currentPlans: response.data });
                    setUsersState({ registeredUsers: userOptions });
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
        }
    }, []);

    function handleFormSubmit(event) {
        event.preventDefault();
        var planMembers = newPlanState.members;
        planMembers.push(state.currentUser.email);
        API.newPlan({
            title: planRef.current.value,
            owner: state.currentUser._id,
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
                });
                // Saving the new created plan as the current plan in Global store
                dispatch({ type: "initPlan", data: response.data });
                history.push("/plan");
            }).catch(error => {
                console.log('plan creation error: ', error);
            });
    }

    function handleChange(e, { value }) {
        console.log(value);
        setnewPlanState({ members: value });
    }

    //function to redirect to plan page when a plan is clicked
    function handlePlanClick(e, plan) {
        e.preventDefault();
        console.log(plan);
        props.updateUser({ planName: plan.title });
        // Saving the selected plan as the current plan in Global store
        dispatch({ type: "initPlan", data: plan });
        history.push("/plan");
    }
    return (
        state.currentUser ?
            <div className="columns" style={{ marginBottom: "30px", overflow: "visible" }}>
                <br />
                <div style={{ marginRight: "10px" }} className="panel col-4 col-xs-12 col-sm-12 col-ml-auto">
                    <div className="panel-header">
                        <div className="panel-title text-bold" style={{textAlign: "left" }}><h4 style={{fontSize: "large"}}>Your current plans:</h4></div>
                    </div>
                    <div class="panel-body">
                        <form>
                            {currentPlansState.currentPlans.map(plan => (
                                <div className="tile" style={{ padding: "6px 0" }}>
                                    <div className="tile-icon">
                                        <span style={{ color: "purple" }}><i class="far fa-paper-plane"></i></span>
                                    </div>
                                    <div className="tile-content" style={{ textAlign: "left" }}>
                                        <button value={plan.title} className="btn btn-link" style={{ fontSize: "1rem", textAlign: "left" }} onClick={(e) => handlePlanClick(e, plan)}>{plan.title}</button>
                                    </div>
                                </div>
                            ))}
                        </form>
                    </div>
                </div>
                <div style={{ marginLeft: "10px", overflow: "visible" }} className="col-7 col-xs-12 col-sm-12 col-mr-auto">
                    <div style={{ overflow: "visible" }} className="panel">
                        <div className="panel-header">
                            <div className="panel-title text-bold"><h4 style={{fontSize: "large"}} >Lets get started!</h4></div>
                        </div>
                        <div class="panel-body" style={{ overflow: "visible" }}>
                            <form className="form-horizontal" onSubmit={handleFormSubmit} style={{ overflow: "visible" }}>
                                <div className="form-group">
                                    <div className="col-4 col-xs-5 col-sm-5 col-ml-auto">
                                        <label className="form-label" htmlFor="newPlanName">Plan Name</label>
                                    </div>
                                    <div className="col-7 col-xl-6 col-mr-auto">
                                        <input className="form-input"
                                            type="text"
                                            id="newPlanName"
                                            name="newPlanName"
                                            placeholder="What are you planning?"
                                            ref={planRef}
                                        />
                                    </div>
                                </div>
                                <div className="form-group" style={{ overflow: "visible" }}>
                                    <div className="col-4 col-xs-5 col-sm-5 col-ml-auto">
                                        <label className="form-label" htmlFor="newPlanName">Add collaborators</label>
                                    </div>
                                    <div className="col-7 col-xl-6 col-mr-auto" style={{ overflow: "visible" }}>
                                        <Dropdown
                                            clearable
                                            placeholder='Search..'
                                            fluid
                                            multiple
                                            search
                                            selection
                                            options={usersState.registeredUsers}
                                            fullTextSearch
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-4 col-xs-5 col-sm-5 col-ml-auto" />
                                    <div className="col-7 col-xl-6 col-mr-auto">
                                        <div style={{ textAlign: "left", marginBottom: "15px" }} className="col-2 col-mr-auto">
                                            <Button compact size='tiny' color='purple' type="submit">Submit</Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            :
            <div style={{ width: '100%', height: "100%", background: 'url(/images/snip.jpg) center / cover' }}>
                <h4>Welcome to Whatsplan app!</h4>
                <p>Please <a style={{ color: "purple", fontWeight: 700 }} href="/login">Login</a> or <a style={{ color: "purple", fontWeight: 700 }} href="/signup">Sign up</a> to continue!</p>
            </div>
    )
}

export default Home;
