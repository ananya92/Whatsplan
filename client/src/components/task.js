import React, { useEffect, useState } from "react";
import API from "../utils/API";
import { Table } from 'semantic-ui-react';
import { usePlanContext } from "../utils/GlobalState";
import history from "../utils/history";
import { Progress } from 'semantic-ui-react';
import moment from 'moment';
import { withRouter } from "react-router";

function Task(props) {
    const [state, dispatch] = usePlanContext();
    const [taskState, setTaskState] = useState({
        task: null
    });
    const [colorState, setColorState] = useState({
        color: ""
    });
    const [taskAsigneeState, setTaskAsigneeState] = useState({
        asigneeName: ""
    })
    const [progressState, setProgressState] = useState({
        percentage: 0,
        overdue: false,
        text: ""
    });
    useEffect(() => {
        API.getTask(props.taskId).then(response => {
            setTaskState({ task: response.data });

            // Determining the progress bar
            if (response.data.startDate) {
                var start = moment(response.data.startDate);
                var now = moment();
                var end = moment(response.data.endDate);
                var totalDays = (end.diff(start, 'days'));
                var passedDays = (now.diff(start, 'days'));
                if (end.diff(now, 'days') < 0) {
                    setProgressState({ ...progressState, percentage: 100, overdue: true, text: "Overdue" });
                }
                else if (response.data.status === "Done") {
                    setProgressState({ ...progressState, percentage: 100 });
                }
                else {
                    var percentageProgress = Math.floor((passedDays / totalDays) * 100);
                    var remainingDays = totalDays - passedDays;
                    setProgressState({ ...progressState, percentage: percentageProgress, text: `${remainingDays} days left` });
                }
            }

            // determine color based on task state
            switch (response.data.status) {
                case "Pending":
                    setColorState({ color: "grey" })
                    break;
                case "On It":
                    setColorState({ color: "purple" })
                    break;
                case "Done":
                    setColorState({ color: "green" })
                    break;
                case "Stuck":
                    setColorState({ color: "red" })
                    break;
            }
            API.getUserById(response.data.asignee).then(response1 => {
                setTaskAsigneeState({ asigneeName: response1.data.firstname + " " + response1.data.lastname })
            }).catch(error => {
                console.log("Error while getting task by id: ", error);
            });
        }).catch(error => {
            console.log("Error while getting task by id: ", error);
        });

    }, []);
    function handleTaskClick(event) {
        event.preventDefault();
        // saving the task as the current task  and the milestone as current milestone in Global Store
        API.getMilestoneByTaskId(taskState.task._id).then(function (response) {
            dispatch({ type: "initMilestone", data: response.data });
            dispatch({ type: "initTask", data: taskState.task });
            history.push(`/taskInfo/${taskState.task._id}`);
        })
            .catch(error => {
                console.log("Error while getting task by id: ", error);
            });
    }
    return (
        <div>
            {taskState.task ?
                <Table singleLine fixed unstackable>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell width={5}>
                                <a href="" onClick={(event) => { handleTaskClick(event) }}>{taskState.task.taskName}</a>
                            </Table.Cell>
                            <Table.Cell width={5}>{taskAsigneeState.asigneeName}</Table.Cell>
                            <Table.Cell width={3} className={colorState.color}>{taskState.task.status}</Table.Cell>
                            {taskState.task.status === "Done" ?
                                <Table.Cell width={3}>
                                    <Progress percent={progressState.percentage} progress color='green'/>
                                </Table.Cell>
                                :
                                progressState.overdue ?
                                    <Table.Cell width={3}>
                                        <Progress percent={progressState.percentage} progress color='orange' label={progressState.text} />
                                    </Table.Cell>
                                    :
                                    progressState.percentage === 0 ?
                                        <Table.Cell className="noMarginCell" width={3}>
                                            <Progress percent={progressState.percentage} progress color={colorState.color} />
                                        </Table.Cell>
                                        :
                                        <Table.Cell width={3}>
                                            <Progress percent={progressState.percentage} progress color={colorState.color} label={progressState.text} />
                                        </Table.Cell>
                            }
                        </Table.Row>
                    </Table.Body>
                </Table>
                : <br />}
        </div>
    )
}

export default withRouter(Task);