import React, { useEffect, useState, useRef } from "react";
import API from "../../utils/API";
import Task from "../task";
import { Dropdown, Button } from 'semantic-ui-react';
import { usePlanContext } from "../../utils/GlobalState";
import { Table } from 'semantic-ui-react';
import avatarImg from "./img/avatar.png";
import moment from 'moment';

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
    const [assignedState, setAssignedState] = useState({
        asignee: ""
    });
    const [deadlineState, setDeadlineState] = useState({
        text: ""
    });
    useEffect(() => {
        API.getMilestone(props.milestoneId).then(response => {
            setMilestoneState({ milestone: response.data });
            var now = moment();
            var deadline = response.data.deadline ? moment(response.data.deadline) : null;
            var deadlineText = deadline ? deadline.from(now) : "";
            if(deadline.diff(now, 'days') < 0) {
                deadlineText = "Overdue";
            }
            setDeadlineState({ text: deadlineText});
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
                    value: `${response.data._id}`,
                    image: { avatar: true, src: avatarImg }
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
        API.addNewTask({
            taskName: taskRef.current.value,
            description: descRef.current.value,
            status: "Pending",
            asignee: assignedState.asignee
        })
            .then(response => {
                taskRef.current.value = "";
                descRef.current.value = "";
                console.log('successfully created new task: ', response);
                // Add the created task to the plan
                API.addTaskToMilestone(milestoneState.milestone._id, response.data._id)
                    .then(response1 => {
                        console.log("Added task to milestone");
                        // Getting the updated milestone from database
                        API.getMilestone(response1.data._id)
                            .then(res => {
                                // Saving the updated milestone in the state
                                console.log(res);
                                setMilestoneState({ milestone: res.data });
                            }).catch(error => {
                                console.log("Error while getting milestone: ", error);
                            });
                    }).catch(error => {
                        console.log("Error while adding task to milestone: ", error);
                    });
            }).catch(error => {
                console.log('task creation error: ', error);
            });

    }
    // function to set the task's asignee state
    function handleAssign(event, data) {
        event.preventDefault();
        console.log("Selected:", data.value);
        setAssignedState({ asignee: data.value });
    }
    
    return (
        <div>
            {milestoneState.milestone ?
                <details className="accordion col-8 col-xs-12 col-sm-12 col-md-9 col-mx-auto" open>
                    <summary className="milestoneStyle accordion-header">
                        <div className="columns">
                            <div style={{textAlign: "left"}} className="mtitle col-6 col-mr-auto">{milestoneState.milestone.milestoneName}</div>
                            <div style={{textAlign: "right", marginTop: "20px"}} className="col-3 col-ml-auto">{deadlineState.text}</div>
                        </div>
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
                                        <div className="col-3 col-xs-5 col-sm-5 col-md-3 col-ml-auto">
                                            <label className="form-label" htmlFor="taskname">Task name</label>
                                        </div>
                                        <div className="col-5 col-xs-7 col-sm-7 col-md-7 col-mr-auto">
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
                                        <div className="col-3 col-xs-5 col-sm-5 col-ml-auto">
                                            <label className="form-label" htmlFor="desc">Description</label>
                                        </div>
                                        <div className="col-5 col-xs-7 col-sm-7 col-md-7 col-mr-auto">
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
                                        <div className="col-3 col-xs-5 col-sm-5 col-ml-auto">
                                            <label className="form-label" htmlFor="desc">Assign to</label>
                                        </div>
                                        <div className="col-5 col-xs-7 col-sm-7 col-md-7 col-mr-auto" style={{ overflow: "visible" }}>
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
                                        <div className="col-3 col-xs-5 col-sm-5 col-ml-auto"></div>
                                        <div className="col-5 col-xs-7 col-sm-7 col-md-7 col-mr-auto">
                                            <div style={{ textAlign: "left" }} className="col-4 col-mr-auto">
                                                <Button compact size='tiny' color='purple' type="submit">Submit</Button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </details>
                        <Table unstackable color='purple' key='purple'>
                        <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell width={5}
                                        >
                                        Task Name
                                    </Table.HeaderCell>
                                    <Table.HeaderCell width={5}
                                        >
                                        &nbsp;Asignee
                                    </Table.HeaderCell>
                                    <Table.HeaderCell width={3}
                                        >
                                        Status
                                    </Table.HeaderCell>
                                    <Table.HeaderCell width={3}
                                        >
                                        Timeline
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            </Table>
                                {milestoneState.milestone.tasks.map(taskId => (                              
                                        <Task taskId={taskId}></Task>
                                ))}

                        
                    </div>
                </details> : <br />}
        </div>
    )
}

export default Milestone;