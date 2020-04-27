import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import API from "../utils/API";
import { Redirect } from 'react-router-dom';
import { usePlanContext } from "../utils/GlobalState";
function Plan() {
    const [state, dispatch] = usePlanContext();
    useEffect(() => {

    }, []);

    const [redirectState, setRedirectState] = useState({
        redirectTo: ""
    })
    return (
        redirectState.redirectTo !== "" ?
            <Redirect to={{ pathname: redirectState.redirectTo }} /> :
            (state.currentPlan.title ?
            <h1>Plan page</h1 > :
            setRedirectState({ redirectTo: "/" }))
    );
}

export default Plan;