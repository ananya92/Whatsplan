import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import API from "../utils/API";
import { Redirect } from 'react-router-dom';
import { usePlanContext } from "../utils/GlobalState";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Milestone from "./milestone";
function Plan() {
    const [state, dispatch] = usePlanContext();
    const milestoneRef = useRef();
    const [redirectState, setRedirectState] = useState({
        redirectTo: ""
    });
    function handleSubmit(event) {
        event.preventDefault();
    }
    const [startDate, setStartDate] = useState(new (Date));
    return (
        redirectState.redirectTo !== "" ?
            <Redirect to={{ pathname: redirectState.redirectTo }} /> :
            state.currentPlan.title ?
                <div>
                    <details className="accordion panel col-sm-12 col-md-10 col-lg-8 col-xl-8 col-mx-auto">
                        <summary style={{ textAlign: "left" }} className="accordion-header">
                            <i className="icon icon-arrow-right mr-1"></i>
                         Add new milestone
                        </summary>
                        <div className="accordion-body">
                            <form className="form-horizontal" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <div className="col-sm-5 col-md-3 col-lg-3 col-xl-3 col-ml-auto">
                                        <label className="form-label" htmlFor="milestonename">Milestone name</label>
                                    </div>
                                    <div className="col-sm-7 col-md-7 col-lg-5 col-xl-5 col-mr-auto">
                                        <input className="form-input"
                                            type="text"
                                            id="milestonename"
                                            name="milestonename"
                                            placeholder="Ex. Requirement analysis"
                                            ref={milestoneRef}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-sm-5 col-md-3 col-lg-3 col-xl-3 col-ml-auto">
                                        <label className="form-label" htmlFor="deadline">Add deadline</label>
                                    </div>
                                    <div className="calendar col-sm-7 col-md-7 col-lg-5 col-xl-5 col-mr-auto">
                                        <DatePicker
                                            selected={startDate}
                                            onChange={date => setStartDate(date)}
                                            minDate={(new Date())}
                                            showDisabledMonthNavigation
                                            isClearable
                                            popperPlacement="top-end"
                                        />
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
                    {state.currentPlan.milestones.map(milestoneId => (
                        <Milestone milestoneId={milestoneId}></Milestone>
                    ))
                    }
                </div> :
                setRedirectState({ redirectTo: "/" })
    );
}

export default Plan;