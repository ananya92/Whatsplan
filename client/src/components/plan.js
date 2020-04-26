import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import API from "../utils/API";
import { Redirect } from 'react-router-dom';

function Plan(props) {
    const [planNameState, setPlanNameState] = useState({
        PlanName: null
    });
    useEffect(() => {
        setPlanNameState({ planName: props.planName });
    }, [props.planName]);
    const [redirectState, setRedirectState] = useState({
        redirectTo: ""
    })
    return (
        redirectState.redirectTo !== "" ?
            <Redirect to={{ pathname: redirectState.redirectTo }} /> :
            (props.planName ?
            <h1> Plan page</h1 > :
            setRedirectState({ redirectTo: "/" }))
    );
}

export default Plan;