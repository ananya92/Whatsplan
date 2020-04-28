import React, { useEffect, useState, useRef } from "react";
import API from "../utils/API";
import Task from "./task";
import { Dropdown, Button } from 'semantic-ui-react';
import { usePlanContext } from "../utils/GlobalState";

function Milestone(props) {
    const taskRef = useRef();
    const descRef = useRef();
    const [state, dispatch] = usePlanContext();
    const [milestoneState, setMilestoneState] = useState({
        milestone: null
    });
    const [assignOptionsState, setAssignOptionsState] = useState({
        members: []
    });
    useEffect(() => {
        API.getMilestone(props.milestoneId).then(response => {
            setMilestoneState({ milestone: response.data })
        }).catch(error => {
            console.log("Error while getting milestone by id: ", error);
        });
        console.log("current plan members:", state.currentPlan.members);
        state.currentPlan.members.map((memberEmail, index) => {
            API.getUserByEmail(memberEmail).then(response => {
                // creating an option object for the assign to dropdown
                var option = {
                    key: index,
                    text: `${response.data.firstname} ${response.data.lastname}`,
                    value: `${response.data.email}`,
                    image: { avatar: true, src: '/images/avatar.PNG' }
                }
                // adding the option to the members in assignOptionsState
                setAssignOptionsState(prevState => ({
                    members: [...prevState.members, option]
                }));
            }).catch(error => {
                console.log("Error while getting user by email: ", error);
            });
        });
    }, []);
    function handleSubmit(event) {
        event.preventDefault();
        console.log(assignOptionsState.members);
    }
    function handleAssign(event, data) {
        event.preventDefault();
        console.log("Selected:");
        console.log(data.value);
    }
    return (
        <div>
            {milestoneState.milestone ?
                <details className="accordion col-sm-12 col-md-9 col-lg-8 col-xl-8 col-mx-auto" open>
                    <summary className="milestoneStyle accordion-header">
                        {milestoneState.milestone.milestoneName}
                    </summary>
                    <hr />
                    <div className="accordion-body col-11 col-mx-auto" style={{ overflow: "visible" }}>
                        <details className="panel accordion">
                            <summary className="accordion-header">
                                <i className="icon icon-arrow-right mr-1"></i>
                                Add Task
                            </summary>
                            <div className="accordion-body" style={{ overflow: "visible" }}>
                                <form className="form-horizontal" onSubmit={handleSubmit}>
                                    <div className="form-group" style={{ overflow: "visible" }}>
                                        <div className="col-sm-5 col-md-3 col-lg-3 col-xl-3 col-ml-auto">
                                            <label className="form-label" htmlFor="taskname">Task name</label>
                                        </div>
                                        <div className="col-sm-7 col-md-7 col-lg-5 col-xl-5 col-mr-auto">
                                            <input className="form-input"
                                                type="text"
                                                id="taskname"
                                                name="taskname"
                                                placeholder="Ex. Survey target customers"
                                                ref={taskRef}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-sm-5 col-md-3 col-lg-3 col-xl-3 col-ml-auto">
                                            <label className="form-label" htmlFor="desc">Description</label>
                                        </div>
                                        <div className="col-sm-7 col-md-7 col-lg-5 col-xl-5 col-mr-auto">
                                            <textarea className="form-input"
                                                type="text"
                                                id="desc"
                                                name="desc"
                                                placeholder="Task description"
                                                ref={descRef}
                                                rows="3"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ overflow: "visible" }}>
                                        <div className="col-sm-5 col-md-3 col-lg-3 col-xl-3 col-ml-auto">
                                            <label className="form-label" htmlFor="desc">Assign to</label>
                                        </div>
                                        <div className="col-sm-7 col-md-7 col-lg-5 col-xl-5 col-mr-auto" style={{ overflow: "visible" }}>
                                            <div className="columns">
                                                <div className="assignDropdown col-8">
                                                    <Dropdown
                                                        placeholder='Assign to'
                                                        fluid
                                                        selection
                                                        options={assignOptionsState.members}
                                                        onChange={handleAssign}
                                                        clearable
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group ">
                                        <div className="col-sm-5 col-md-3 col-lg-3 col-xl-3 col-ml-auto"></div>
                                        <div className="col-sm-7 col-md-7 col-lg-5 col-xl-5 col-mr-auto">
                                            <div style={{ textAlign: "left" }} className="col-4 col-mr-auto">
                                                <Button compact size='tiny' color='purple' type="submit">Submit</Button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </details>
                        {milestoneState.milestone.tasks.map(taskId => (
                            <Task taskId={taskId}></Task>
                        ))}
                    </div>
                </details> : <br />}
        </div>
    )
}

export default Milestone;