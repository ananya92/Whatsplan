import React, { useEffect, useState } from "react";
import API from "../utils/API";
import { Table } from 'semantic-ui-react';
import { usePlanContext } from "../utils/GlobalState";
import history from "../utils/history";

function Task(props) {
    const [_, dispatch] = usePlanContext();
    const [taskState, setTaskState] = useState({
        task: null
    });
    const [colorState, setColorState] = useState({
        color: ""
    });
    const [taskAsigneeState, setTaskAsigneeState] = useState({
        asigneeName: ""
    })
    useEffect(() => {
        API.getTask(props.taskId).then(response => {
            console.log("Got task:", response);
            setTaskState({ task: response.data });
            // determine color based on task state
            switch(response.data.status) {
                case "Pending":
                    setColorState({ color: "grey"})
                    break;
                case "On It":
                    setColorState({ color: "blue"})
                    break;
                case "Done":
                    setColorState({ color: "green"})
                    break;
                case "Stuck":
                    setColorState({ color: "red"})
                    break;
            }
            API.getUserById(response.data.asignee).then(response1 => {
                console.log("Got user:", response1);
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
        API.getMilestoneByTaskId(taskState.task._id).then(function(response) {
            dispatch({ type: "initMilestone", data:  response.data});
            dispatch({ type: "initTask", data: taskState.task });
            history.push("/taskInfo");
        })
        .catch(error => {
            console.log("Error while getting task by id: ", error);
        });
    }
    return (
        <div>
            {taskState.task ?
            <Table fixed singleLine unstackable>
            <Table.Body>
                <Table.Row>
                    <Table.Cell width={5}>
                        <a href="" onClick = {(event) => {handleTaskClick(event)}}>{taskState.task.taskName}</a>                    
                    </Table.Cell>
                    <Table.Cell width={5}>{taskAsigneeState.asigneeName}</Table.Cell>
                    <Table.Cell width={3} className={colorState.color}>{taskState.task.status}</Table.Cell>
                    <Table.Cell width={3}>{taskState.task.startDate} - {taskState.task.endDate}</Table.Cell>
                </Table.Row>
            </Table.Body>
            </Table>
                : <br />}
        </div>
    )
}

export default Task;