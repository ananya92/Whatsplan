import React, { useState, useEffect, useRef } from "react";
import { usePlanContext } from "../utils/GlobalState";
import { Redirect } from 'react-router-dom';
import { Dropdown, Button } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import API from "../utils/API";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import Comment from "./comment";
import { withRouter } from "react-router";
import history from "../utils/history";

function TaskInfo(props) {
    const [state, dispatch] = usePlanContext();
    const commentRef = useRef();
    const [taskState, setTaskState] = useState({
        taskVal: "",
        descVal: "",
        statusVal: "",
        asignee: "",
        asigneeName: "",
        infoMsg: "",
        errMsg: ""
    });
    const [assignedState, setAssignedState] = useState({
        name: "",
        asignee: ""
    });

    const [assignOptionsState, setAssignOptionsState] = useState({
        members: []
    });
    const [commentsState, setCommentsState] = useState({
        comments: []
    });
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [currentUser, setCurrentUser] = useState({
        user: {}
    });
    const [currentPlan, setCurrentPlan] = useState({
        plan: {}
    });
    //Get the deafult asignee and asignee dropdown options on component load
    useEffect(() => {
        console.log(props.match.params.id);
        // check if the global store has current user saved or not, if not then check in session. Global store can be lost if page is refreshed
        if (!state.currentUser.email) {
            API.getUser().then(response => {
                // check if user is logged in
                if (response.data.user) {
                    // user is logged in, check if the user is a member of the plan or not; only members can view the task
                    setCurrentUser({ user: response.data.user });
                    checkUserHasAccessToTask(response.data.user);
                }
                else {
                    //user is not logged in, redirect to login page
                    history.push("/login");
                }
            }).catch(error => {
                console.log('get user error: ', error);
            });
        }
        else {
            // global store has a current user
            setCurrentUser({ user: state.currentUser });
            checkUserHasAccessToTask(state.currentUser);
        }

    }, [state.currentUser, props.match.params.id]);
    // Fetch all the comments of the task from databse whenever new comment is added
    useEffect(() => {
        if(state.currentTask._id) {
            API.getCommentsByTaskId(state.currentTask._id).then(response => {
                setCommentsState({ comments: response.data });
            }).catch(error => {
                console.log("Error while getting comment by id: ", error);
            });
        }
    }, [state.currentTask.comments]);

    function checkUserHasAccessToTask(user) {
        API.getTask(props.match.params.id).then(response1 => {
            if (response1.data.taskName) {
                API.getMilestoneByTaskId(response1.data._id).then(response2 => {
                    API.getPlanByMilestoneId(response2.data._id).then(response3 => {
                        let isMember = false;
                        for (var i = 0; i < response3.data.members.length; i++) {
                            // get the plan.check if the logged in user is a part of the plan's members
                            if (response3.data.members[i] === user.email) {
                                isMember = true;
                                break;
                            }
                        }
                        if (isMember) {
                            // the logged in user is a member of the plan
                            dispatch({ type: "initTask", data: response1.data });
                            dispatch({ type: "initMilestone", data: response2.data });
                            dispatch({ type: "initPlan", data: response3.data });
                            setCurrentPlan({ ...currentPlan, plan: response3.data });
                            // setting the task asignee name
                            setTaskAsignee(response1.data.asignee);
                            setTaskState({
                                ...taskState,
                                taskVal: response1.data.taskName,
                                descVal: response1.data.description,
                                statusVal: response1.data.status,
                                asignee: response1.data.asignee,
                            });
                            if(response1.data.startDate) {
                                setStartDate(new Date(response1.data.startDate));
                            }
                            if(response1.data.endDate) {
                                setEndDate(new Date(response1.data.endDate));
                            }

                            //setting assign dropdown options
                            setAssignOptions(response3.data);
                        }
                        else {
                            // the logged-in user is not a member of plan and doesn't have permission to view the plan details
                            setTaskState({ ...taskState, errMsg: "Sorry! Only collaborators are allowed to view the task's details." });
                        }

                    }).catch(error => {
                        console.log('get plan by milestone error: ', error);
                    });
                }).catch(error => {
                    console.log('get milestone by task error: ', error);
                });
            }
            else {
                //task doesn't exist
                setTaskState({ ...taskState, errMsg: "Sorry! Task doesn't exist." })
            }
        }).catch(error => {
            console.log('get task error: ', error);
        });
    }
    function handleStatusChange(event, data) {
        event.preventDefault();
        console.log("Selected:", data.value);
        setTaskState({ ...taskState, statusVal: data.value });
    }

    // function to set the task's asignee state
    function handleAssign(event, data) {
        event.preventDefault();
        console.log("Selected:", data.value);
        setTaskAsignee(data.value);
    }

    function setTaskAsignee(asigneeId) {
        API.getUserById(asigneeId).then(response => {
            setAssignedState({
                asignee: response.data._id,
                name: response.data.firstname + " " + response.data.lastname
            });
        }).catch(error => {
            console.log("Error while getting user by id: ", error);
        });
    }

    function setAssignOptions(plan) {
        plan.members.map((memberEmail, index) => {
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
    }
    // function to post new comment
    function handleComment(event) {
        event.preventDefault();
        if (commentRef.current.value !== null && commentRef.current.value !== "") {
            API.newComment({
                comment: commentRef.current.value,
                task: state.currentTask._id,
                commentedBy: currentUser.user._id
            }).then(function (response) {
                console.log("Posted new comment:", response);
                // Send notification to task asignee if some other user comments on their task
                if(state.currentTask.asignee !== currentUser.user._id) {
                    API.newNotification({
                        message: `${currentUser.user.firstname} ${currentUser.user.lastname} commented on your task - ${state.currentTask.taskName}`,
                        belongsTo: state.currentTask.asignee,
                        isRead: false,
                        taskId: state.currentTask._id
                    }).then(response => {
                        console.log("Created new notification", response);
                    });
                }
                commentRef.current.value = "";
                // Add the new comment id to the task in database and save the task back to the global store
                API.addCommentToTask(response.data._id, state.currentTask._id).then(function (response1) {
                    console.log("Added comment to task", response1);
                    // save the updated record into the global store
                    dispatch({ type: "initTask", data: response1.data });
                }).catch(error => {
                    console.log("Error while adding comment to task: ", error);
                });
            }).catch(error => {
                console.log("Error while posting new comment: ", error);
            });
        }
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
                // Send notification to asignee if asignee is changed
                if(taskState.asignee !== response.data.asignee) {
                    API.newNotification({
                        message: `You have been assigned a new task - ${response.data.taskName}`,
                        belongsTo: response.data.asignee,
                        isRead: false,
                        taskId: response.data._id
                    }).then(response => {
                        console.log("Created new notification", response);
                    });
                }
                console.log("Successfully updated task:", response);
                setTaskState({ ...taskState, infoMsg: "Successfully updated", asignee: response.data.asignee });
                dispatch({ type: "initTask", data: response.data });
            })
            .catch(error => {
                console.log('task update error: ', error);
            });
    }

    return (
        <div>
            {taskState.taskName != "" ? (
                <div style={{ marginBottom: "30px" }}>
                    <form className="form-horizontal" style={{ textAlign: "left" }} onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="col-3 col-xs-4 col-sm-4 col-ml-auto">
                                <label className="form-label" htmlFor="taskname">Task name</label>
                            </div>
                            <div className="col-6 col-xs-8 col-sm-8 col-md-8 col-mr-auto">
                                {(currentUser.user._id === taskState.asignee ||
                                    currentUser.user._id === currentPlan.plan.owner)
                                    ?
                                    <input className="form-input"
                                        type="text"
                                        id="desc"
                                        name="desc"
                                        value={taskState.taskVal}
                                        onChange={(e) => { setTaskState({ ...taskState, taskVal: e.target.value }) }} />
                                    :
                                    <p>{taskState.taskVal}</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-3 col-xs-4 col-sm-4 col-ml-auto">
                                <label className="form-label" htmlFor="desc">Description</label>
                            </div>
                            <div className="col-6 col-xs-8 col-sm-8 col-md-8 col-mr-auto">
                                {(currentUser.user._id === taskState.asignee ||
                                    currentUser.user._id === currentPlan.plan.owner)
                                    ?
                                    <textarea className="form-input"
                                        type="text"
                                        id="desc"
                                        name="desc"
                                        rows={3}
                                        value={taskState.descVal}
                                        onChange={(e) => { setTaskState({ ...taskState, descVal: e.target.value }) }} />
                                    :
                                    <p>{taskState.descVal}</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-3 col-xs-4 col-sm-4 col-ml-auto">
                                <label className="form-label">Assignee</label>
                            </div>
                            <div className="col-6 col-xs-8 col-sm-8 col-md-8 col-mr-auto">
                                {(currentUser.user._id === taskState.asignee ||
                                    currentUser.user._id === currentPlan.plan.owner) ?
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
                                {(currentUser.user._id === taskState.asignee ||
                                    currentUser.user._id === currentPlan.plan.owner) ?
                                    <div className="columns">
                                        <div className="statusDropdown col-6">
                                            <Dropdown
                                                placeholder={taskState.statusVal}
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
                                    <p>{taskState.statusVal}</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-3 col-xs-4 col-sm-4 col-ml-auto">
                                <label className="form-label">Start Date</label>
                            </div>
                            <div className="calendar col-6 col-xs-8 col-sm-8 col-md-8 col-mr-auto">
                                {(currentUser.user._id === taskState.asignee ||
                                    currentUser.user._id === currentPlan.plan.owner) ?
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
                                {(currentUser.user._id === taskState.asignee ||
                                    currentUser.user._id === currentPlan.plan.owner) ?
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
                        {(currentUser.user._id === taskState.asignee ||
                            currentUser.user._id === currentPlan.plan.owner) ?
                            <div className="form-group ">
                                <div className="col-3 col-xs-4 col-sm-4 col-ml-auto"></div>
                                <div className="col-6 col-xs-8 col-sm-8 col-md-8 col-mr-auto">
                                    <div style={{ textAlign: "left" }} className="col-4 col-mr-auto">
                                        <Button compact size='tiny' color='purple' type="submit">Submit</Button>
                                        <p style={{ fontSize: "small", color: "green", paddingTop: "15px" }}>{taskState.infoMsg}</p>
                                    </div>
                                </div>
                            </div> : <br />}
                    </form>
                    <form onSubmit={handleComment}>
                        <div className="commentStyle panel col-9 col-xs-12 col-sm-12 col-md-11 col-mx-auto">
                            <div className="panel-header">
                                <div style={{ textAlign: "left", fontWeight: 700 }} class="panel-title">Comments</div>
                            </div>
                            <div className="panel-body">
                                {commentsState.comments.map(comment => (
                                    <Comment comment={comment} />
                                ))}
                            </div>
                            <div class="panel-footer">
                                <div>
                                    <textarea className="form-input"
                                        placeholder="Post a comment"
                                        type="text"
                                        id="comment"
                                        name="comment"
                                        rows={3}
                                        ref={commentRef} />
                                    <div style={{ textAlign: "right", marginTop: "0.4rem" }} className="col-4 col-ml-auto">
                                        <Button compact size='tiny' color='purple' type="submit">Post Comment</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>) :
                (taskState.errMsg != "") ?
                    <h4>{taskState.errMsg}</h4> : <br />
            }
        </div>
    )
}

export default withRouter(TaskInfo);