import React, { useState } from "react";
import { usePlanContext } from "../utils/GlobalState";
import { Redirect } from 'react-router-dom';
function TaskInfo() {
    const [state, dispatch] = usePlanContext();
    const [taskState, setTaskState] = useState({
        task: null
    });
    return (

        <div>
            {state.currentTask ? (
                <div>
                    <h2>TaskInfo page</h2>
                    <p>{state.currentTask.taskName}</p>
                </div>) :
                <Redirect to={{ pathname: "/" }} />
            }

        </div>
    )
}

export default TaskInfo;