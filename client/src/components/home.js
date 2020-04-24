import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Button } from 'semantic-ui-react';

import API from "../utils/API";

function Home() {
    const planRef = useRef();
    const [usersState, setUsersState] = useState({
        registeredUsers: []
    });
    const [newPlanState, setnewPlanState] = useState({

    });
    useEffect(() => {
        API.getRegisteredUsers().then(response => {
            console.log("All registered users response:");
            console.log(response);
            var userOptions = response.data.map((user, index) => ({
                key: index,
                text: user.username,
                value: user.username,
            }));
            setUsersState({ registeredUsers: userOptions });
        })
            .catch(error => {
                console.log('Getting registered users error: ')
                console.log(error);
            })
    }, [])
    function handleFormSubmit(event) {
        event.preventDefault();
    }
    return (
        <div>
            <div>
                <br />
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
                                placeholder="What's the plan name?"
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
    )
}

export default Home;
