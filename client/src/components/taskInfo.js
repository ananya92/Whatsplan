import React, { useState, useEffect } from "react";
import { usePlanContext } from "../utils/GlobalState";
import { Redirect } from 'react-router-dom';
import { Dropdown, Button } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import API from "../utils/API";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

function TaskInfo() {
    const [state, _] = usePlanContext();

    const [taskState, setTaskState] = useState({
        taskVal: state.currentTask.taskName,
        descVal: state.currentTask.description,
        statusVal: state.currentTask.status,
        infoMsg: ""
    });
    const [assignedState, setAssignedState] = useState({
        name: "",
        asignee: ""
    });
    const [assignOptionsState, setAssignOptionsState] = useState({
        members: []
    });
    const [startDate, setStartDate] = useState(state.currentTask.startDate ? 
        new Date(state.currentTask.startDate): null);
    const [endDate, setEndDate] = useState(state.currentTask.endDate ? 
        new Date(state.currentTask.endDate): null);

    //Get the deafult asignee and asignee dropdown options on component load
    useEffect(() => {
        API.getUserById(state.currentTask.asignee).then(response => {
            setAssignedState({ 
                asignee: response.data._id,
                name: response.data.firstname + " " + response.data.lastname });
        }).catch(error => {
            console.log("Error while getting user by id: ", error);
        });
        state.currentPlan.members.map((memberEmail, index) => {
            API.getUserByEmail(memberEmail).then(response => {
                // creating an option object for the assign to dropdown
                var option = {
                    key: `${response.data._id}`,
                    text: `${response.data.firstname} ${response.data.lastname}`,
                    value: `${response.data._id}`
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

    function handleStatusChange(event, data) {
        event.preventDefault();
        console.log("Selected:", data);
        setTaskState({ ...taskState, statusVal: data.value });
    }

    // function to set the task's asignee state
    function handleAssign(event, data) {
        event.preventDefault();
        console.log("Selected:", data, event);
        setAssignedState({...assignedState, asignee: data.value });
    }
    // On submit, the task should be updated with updated values. Also the milestone state and plan state might change due to change in task status so it should be tested. 
    // The task, milestone and plan have to be updated in the database as well as the global store
    function handleSubmit(event) {
        event.preventDefault();
        API.updateTask(state.currentTask._id,
        {
            taskName: taskState.taskVal,
            description: taskState.descVal,
            status: taskState.statusVal,
            asignee: assignedState.asignee,
            startDate: startDate,
            endDate: endDate
        })
        .then(response => {
            console.log("Successfully updated task:", response);
            setTaskState({...taskState, infoMsg: "Successfully updated"});
        })
        .catch(error => {
            console.log('task update error: ', error);
        });
    }

    return (
        <div>
            {state.currentTask && state.currentUser ? (
                <div>
                    <form className="form-horizontal" style={{ textAlign: "left" }} onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="col-3 col-xs-4 col-sm-4 col-ml-auto">
                                <label className="form-label" htmlFor="taskname">Task name</label>
                            </div>
                            <div className="col-6 col-xs-8 col-sm-8 col-md-8 col-mr-auto">
                                {(state.currentUser._id === state.currentTask.asignee ||
                                    state.currentUser._id === state.currentPlan.owner)
                                    ?
                                    <input className="form-input"
                                        type="text"
                                        id="desc"
                                        name="desc"
                                        value={taskState.taskVal}
                                        onChange={(e) => { setTaskState({ ...taskState, taskVal: e.target.value }) }} />
                                    :
                                    <p>{state.currentTask.taskName}</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-3 col-xs-4 col-sm-4 col-ml-auto">
                                <label className="form-label" htmlFor="desc">Description</label>
                            </div>
                            <div className="col-6 col-xs-8 col-sm-8 col-md-8 col-mr-auto">
                                {state.currentUser._id === state.currentTask.asignee ||
                                    state.currentUser._id === state.currentPlan.owner
                                    ?
                                    <textarea className="form-input"
                                        type="text"
                                        id="desc"
                                        name="desc"
                                        rows={3}
                                        value={taskState.descVal}
                                        onChange={(e) => { setTaskState({ ...taskState, descVal: e.target.value }) }} />
                                    :
                                    <p>{state.currentTask.description}</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-3 col-xs-4 col-sm-4 col-ml-auto">
                                <label className="form-label">Assignee</label>
                            </div>
                            <div className="col-6 col-xs-8 col-sm-8 col-md-8 col-mr-auto">
                                {state.currentUser._id === state.currentTask.asignee ||
                                    state.currentUser._id === state.currentPlan.owner ?
                                    <div className="columns">
                                        <div className="statusDropdown col-6">
                                            <Dropdown
                                                placeholder={assignedState.name}
                                                fluid
                                                selection
                                                options={assignOptionsState.members}
                                                onChange={handleAssign}
                                                clearable
                                            />
                                        </div>
                                    </div> :
                                    <p>{assignedState.name}</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-3 col-xs-4 col-sm-4 col-ml-auto">
                                <label className="form-label">Status</label>
                            </div>
                            <div className="col-6 col-xs-8 col-sm-8 col-md-8 col-mr-auto">
                                {state.currentUser._id === state.currentTask.asignee ||
                                    state.currentUser._id === state.currentPlan.owner ?
                                    <div className="columns">
                                        <div className="statusDropdown col-6">
                                            <Dropdown
                                                defaultValue={taskState.statusVal}
                                                fluid
                                                selection
                                                options={[{ key: "Pending", text: "Pending", value: "Pending" },
                                                { key: "On It", text: "On It", value: "On It" },
                                                { key: "Done", text: "Done", value: "Done" },
                                                { key: "Stuck", text: "Stuck", value: "Stuck" }]}
                                                onChange={handleStatusChange}
                                                clearable
                                            />
                                        </div>
                                    </div> :
                                    <p>{state.currentTask.status}</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-3 col-xs-4 col-sm-4 col-ml-auto">
                                <label className="form-label">Start Date</label>
                            </div>
                            <div className="calendar col-6 col-xs-8 col-sm-8 col-md-8 col-mr-auto">
                                {state.currentUser._id === state.currentTask.asignee ||
                                    state.currentUser._id === state.currentPlan.owner ?
                                    <DatePicker
                                        selected={startDate}
                                        onChange={date => setStartDate(date)}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                        placeholderText="Select start date"
                                    /> :
                                    state.currentTask.startDate ?
                                        <p>{moment(state.currentTask.startDate).format('MM/DD/YYYY')}</p> : <p>-</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-3 col-xs-4 col-sm-4 col-ml-auto">
                                <label className="form-label">End Date</label>
                            </div>
                            <div className="calendar col-6 col-xs-8 col-sm-8 col-md-8 col-mr-auto">
                                {state.currentUser._id === state.currentTask.asignee ||
                                    state.currentUser._id === state.currentPlan.owner ?
                                    <DatePicker
                                        selected={endDate}
                                        onChange={date => setEndDate(date)}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                        placeholderText="Select end date"
                                    /> :
                                    state.currentTask.endDate ?
                                        <p>{moment(state.currentTask.endDate).format('MM/DD/YYYY')}</p> : <p>-</p>}
                            </div>
                        </div>
                        {state.currentUser._id === state.currentTask.asignee ||
                            state.currentUser._id === state.currentPlan.owner ?
                            <div className="form-group ">
                                <div className="col-3 col-xs-4 col-sm-4 col-ml-auto"></div>
                                <div className="col-6 col-xs-8 col-sm-8 col-md-8 col-mr-auto">
                                    <div style={{ textAlign: "left" }} className="col-4 col-mr-auto">
                                        <Button compact size='tiny' color='purple' type="submit">Submit</Button>
                                        <p style={{fontSize: "small", color: "green", paddingTop: "15px"}}>{taskState.infoMsg}</p>
                                    </div>
                                </div>
                            </div> : <br />}
                    </form>
                </div>) :
                <Redirect to={{ pathname: "/" }} />
            }

        </div>
    )
}

export default TaskInfo;