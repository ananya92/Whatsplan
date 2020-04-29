import React, { useState, useRef } from 'react';
import { Button } from 'semantic-ui-react';
import API from "../utils/API";
import { Redirect } from 'react-router-dom';
import { usePlanContext } from "../utils/GlobalState";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Milestone from "./milestone";

function Plan() {
    const [state, dispatch] = usePlanContext();
    const milestoneRef = useRef();
    function handleSubmit(event) {
        event.preventDefault();
        API.addNewMilestone({
            milestoneName: milestoneRef.current.value,
            deadline: startDate,
            status: "Pending"
        })
            .then(response => {
                milestoneRef.current.value = "";
                console.log('successfully created new milestone: ', response);
                // Add the created milestone to the plan
                API.addMilestoneToPlan(state.currentPlan._id, response.data._id)
                    .then(response1 => {
                        console.log("Added milestone to plan:");
                        // Getting the updated plan from database
                        API.getPlan(response1.data._id)
                            .then(res => {
                                // Saving the new created milestone in the current plan in Global store
                                console.log(res);
                                dispatch({ type: "initPlan", data: res.data });
                            }).catch(error => {
                                console.log("Error while getting plan: ", error);
                            });
                    }).catch(error => {
                        console.log("Error while adding milestone to plan: ", error);
                    });
            }).catch(error => {
                console.log('milestone creation error: ', error);
            });
    }
    const [startDate, setStartDate] = useState(new (Date));
    return (
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
            <Redirect to={{ pathname: "/" }} />
    );
}

export default Plan;