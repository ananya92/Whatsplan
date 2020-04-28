import React, { useEffect, useState } from "react";
import API from "../utils/API";
import { Table } from 'semantic-ui-react';

function Task(props) {
    const [taskState, setTaskState] = useState({
        task: null
    });
    const [taskAsigneeState, setTaskAsigneeState] = useState({
        asigneeName: ""
    })
    useEffect(() => {
        API.getTask(props.taskId).then(response => {
            console.log("Got task:", response);
            setTaskState({ task: response.data });
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
    return (
        <div>
            {taskState.task ?
            <Table compact singleLine fixed columns={4} unstackable>
            <Table.Body>
                <Table.Row>
                    <Table.Cell>
                        {taskState.task.taskName}
                    </Table.Cell>
                    <Table.Cell>{taskAsigneeState.asigneeName}</Table.Cell>
                    <Table.Cell>{taskState.task.status}</Table.Cell>
                    <Table.Cell></Table.Cell>
                </Table.Row>
            </Table.Body>
            </Table>
                : <br />}
        </div>
    )
}

export default Task;