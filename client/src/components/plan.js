import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import API from "../utils/API";
import { usePlanContext } from "../utils/GlobalState";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Milestone from "./milestone";
import { withRouter } from "react-router";
import history from "../utils/history";

function Plan(props) {
    const [state, dispatch] = usePlanContext();
    const [currentPlan, setCurrentPlan] = useState({
        plan: {},
        errMsg: ""
    });
    const milestoneRef = useRef();
    // on loading plan page, I am no longer looking at a particular task or milestone hence setting the initTask to null
    useEffect(() => {
        dispatch({ type: "initTask", data: {} });
        dispatch({ type: "initMilestone", data:  {}});
        API.getUser().then(response1 => {
            // check if user is logged in
            if(response1.data.user) {
                // user is logged in, check if the user is a member of the plan or not; only members can view the plan
                API.getPlan(props.match.params.id).then(response => {
                    let isMember = false;
                    if(response.data.title) {
                        for(var i=0; i<response.data.members.length; i++) {
                            if(response.data.members[i] === response1.data.user.email) {
                                isMember = true;
                                break;
                            }
                        }
                        if(isMember) {
                            // the logged in user is a member of the plan
                            dispatch({ type: "initPlan", data: response.data});
                            setCurrentPlan({...currentPlan, plan: response.data});
                        }
                        else {
                            // the logged-in user is not a member of plan and doesn't have permission to view the plan details
                            setCurrentPlan({...currentPlan, errMsg: "Sorry! Only collaborators are allowed to view the plan's details."});
                        }
                    }
                    else {
                        // the id doesn't exist
                        setCurrentPlan({...currentPlan, errMsg: "Sorry! Plan doesn't exist."});
                    }
                    
                }).catch(error => {
                    console.log('Get plan error: ', error);
                });
            }
            else {
                //user is not logged in, redirect to login page
                history.push("/login");
            }
        })
    }, [state.currentUser]);
    const [infoState, setInfoState] = useState({
        infoMsg: ""
    });
    const [submitState, setSubmitState] = useState({
        submit: false
    });
    useEffect(() => {
        const timer = setTimeout(() => {
            setInfoState({ infoMsg: ""});
        }, 4000);
        return () => clearTimeout(timer);
      }, [submitState]);

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
                setInfoState({ infoMsg: "Created new milestone"});
                setSubmitState({ submit: true});
                // Add the created milestone to the plan
                API.addMilestoneToPlan(currentPlan.plan._id, response.data._id)
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
        currentPlan.plan.title ?
            <div style={{ marginBottom: "30px" }}>
                <details className="accordion panel col-8 col-xs-12 col-sm-12 col-md-10 col-mx-auto">
                    <summary style={{ textAlign: "left" }} className="accordion-header">
                        <i className="icon icon-arrow-right mr-1"></i>
                         Add new milestone
                        </summary>
                    <div className="accordion-body">
                        <form className="form-horizontal" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <div className="col-3 col-xs-5 col-sm-5 col-ml-auto">
                                    <label className="form-label" htmlFor="milestonename">Milestone name</label>
                                </div>
                                <div className="col-5 col-xs-7 col-sm-7 col-md-7 col-mr-auto">
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
                                <div className="col-3 col-xs-5 col-sm-5 col-ml-auto">
                                    <label className="form-label" htmlFor="deadline">Add deadline</label>
                                </div>
                                <div className="calendar col-5 col-xs-7 col-sm-7 col-md-7 col-mr-auto">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={date => setStartDate(date)}
                                        minDate={(new Date())}
                                        isClearable
                                        popperPlacement="top-end"
                                    />
                                </div>
                            </div>
                            <div className="form-group ">
                                <div className="col-3 col-xs-5 col-sm-5 col-ml-auto"></div>
                                <div className="col-5 col-xs-7 col-sm-7 col-md-7 col-mr-auto">
                                    <div style={{ textAlign: "left" }} className="col-4 col-mr-auto">
                                        <Button compact size='tiny' color='purple' type="submit">Submit</Button>
                                    </div>
                                    <p style={{ fontSize: "small", color: "green", paddingTop: "15px" }}>{infoState.infoMsg}</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </details>
                {currentPlan.plan.milestones.map(milestoneId => (
                    <Milestone milestoneId={milestoneId}></Milestone>
                ))
                }
            </div> :
            (currentPlan.errMsg != "") ? 
            <h4>{currentPlan.errMsg}</h4> : <br/>
    );
}

export default withRouter(Plan);