import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { Dropdown } from 'semantic-ui-react';
import API from "../utils/API";
import { usePlanContext } from "../utils/GlobalState";
import { Redirect } from 'react-router-dom';

function Dashboard() {
    const [state, dispatch] = usePlanContext();
    const [currentPlansState, setCurrentPlansState] = useState({
        currentPlans: []
    });
    const [selectedPlanState, setSelectedPlanState] = useState({
        selectedPlan: null
    });
    const [memberState, setMemberState] = useState({
        memberInfo: null
    });
    const [numTaskState, setNumTaskState] = useState({
        pending: 0,
        onit: 0,
        stuck: 0,
        done: 0
    });
    const [planOptionsState, setPlanOptionsState] = useState({
        plans: []
    });
    useEffect(() => {
        if (state.currentUser.email) {
            populatePlans(state.currentUser);
        }
        else {
            // there is no user saved in global store. Check if user exists in session, this can happen on page refresh
            API.getUser().then(response => {
                // check if user is logged in
                if (response.data.user) {
                    populatePlans(response.data.user);
                }
            }).catch(error => {
                console.log('get user error: ', error);
            });
        }
    }, []);

    function populatePlans(user) {
        // Fetching all the current plans of the user
        API.getCurrentPlans().then(response => {
            console.log("Current plans of user response: ", response);
            setCurrentPlansState({ currentPlans: response.data });
            setPlanOptions(response.data);
        })
            .catch(error => {
                console.log('Getting current plans error: ')
                console.log(error);
            });
    }

    // get dashboard of selected plan
    function handlePlanClick(event, data) {
        event.preventDefault();
        console.log(data);
        setSelectedPlanState({
            selectedPlan: data.value
        });
        API.getTasksByPlanId(data.value._id).then(response => {
            // Got all tasks in the plan in response.data
            console.log(response.data);
            // Iterate for each plan member
            setMemberState({ memberInfo: [["Name", "Pending", "On It", "Stuck", "Done"]] });
            var total_pending = 0;
            var total_onit = 0;
            var total_done = 0;
            var total_stuck = 0;
            for (var i = 0; i < data.value.members.length; i++) {
                API.getUserByEmail(data.value.members[i]).then(response1 => {
                    var num_pending = 0;
                    var num_onit = 0;
                    var num_done = 0;
                    var num_stuck = 0;
                    // iterate through all the tasks of the plan
                    for (var j = 0; j < response.data.length; j++) {
                        // check if task belongs to the plan member
                        if (response.data[j].asignee === response1.data._id) {
                            // increment the different task counts based on the status
                            switch (response.data[j].status) {
                                case "Pending":
                                    num_pending++;
                                    total_pending++;
                                    break;
                                case "On It":
                                    num_onit++;
                                    total_onit++;
                                    break;
                                case "Done":
                                    num_done++;
                                    total_done++;
                                    break;
                                case "Stuck":
                                    num_stuck++;
                                    total_stuck++;
                                    break;
                            }
                        }
                    }
                    setMemberState(state => ({
                        memberInfo: [...state.memberInfo, [`${response1.data.firstname} ${response1.data.lastname}`, num_pending, num_onit, num_stuck, num_done]]
                    }));
                    console.log(total_pending, total_onit, total_stuck, total_done);
                    setNumTaskState({
                        pending: total_pending,
                        onit: total_onit,
                        stuck: total_stuck,
                        done: total_done
                    });
                }).catch(error => {
                    console.log('Getting user by email error: ')
                    console.log(error);
                });
            }
        }).catch(error => {
            console.log('Getting tasks by plan id error: ')
            console.log(error);
        });
    }

    function setPlanOptions(plans) {
        plans.map(plan => {
            // creating an option object for the select plan dropdown
            var option = {
                key: `${plan._id}`,
                text: `${plan.title}`,
                value: plan
            }
            // adding the option to the members in assignOptionsState
            setPlanOptionsState(prevState => ({
                plans: [...prevState.plans, option]
            }));
        });
    }
    return (
        state.currentUser.email ?
            <div>
                <div className="col-11 col-mx-auto">
                    <div className="col-4 col-xs-6 col-sm-6 col-mx-auto">
                        <Dropdown className="planDropdown"
                            placeholder="Select plan name"
                            fluid
                            selection
                            options={planOptionsState.plans}
                            onChange={handlePlanClick}
                            clearable
                        />
                    </div>
                </div>
                <br />
                <br />
                {selectedPlanState.selectedPlan !== null && memberState.memberInfo !== null ?
                    (memberState.memberInfo.length === selectedPlanState.selectedPlan.members.length + 1) ?
                        <div>
                            <div className="columns">
                                <div className="col-12 col-mx-auto">
                                    <h4>Plan progress by Members:</h4>
                                </div>
                                <div style={{ border: "1px solid #c9c7c7" }} className="chartStyle col-8 col-xs-11 col-sm-11 col-md-11 col-lg-11 col-mx-auto">
                                    <Chart
                                        width={'100%'}
                                        height={'auto'}
                                        chartType="BarChart"
                                        loader={<div>Loading Chart</div>}
                                        data={memberState.memberInfo}
                                        options={{
                                            chartArea: { width: '50%' },
                                            colors: ['#aca8a8', '#00aeff', '#ff2828', '#09dc09'],
                                            isStacked: true,
                                            hAxis: {
                                                title: 'Number of tasks',
                                                minValue: 0,
                                            }
                                        }}
                                        // For tests
                                        rootProps={{ 'data-testid': '3' }}
                                    />
                                </div>
                            </div>
                            <br /><br />
                            <div className="columns">
                                <div className="col-12 col-mx-auto">
                                    <h4>Plan progress by Tasks:</h4>
                                </div>
                                <div style={{ border: "1px solid #c9c7c7" }} className="chartStyle col-8 col-xs-11 col-sm-11 col-md-11 col-lg-11 col-mx-auto">
                                    <Chart
                                        width={'100%'}
                                        height={'300px'}
                                        chartType="PieChart"
                                        loader={<div>Loading Chart</div>}
                                        data={[
                                            ['Status', 'No. of tasks'],
                                            ['Pending', numTaskState.pending],
                                            ['On It', numTaskState.onit],
                                            ['Stuck', numTaskState.stuck],
                                            ['Done', numTaskState.done]
                                        ]}
                                        options={{
                                            colors: ['#aca8a8', '#00aeff', '#ff2828', '#09dc09']
                                        }}
                                        rootProps={{ 'data-testid': '1' }}
                                    />
                                </div>
                            </div>
                        </div>
                        :
                        <br />
                    :
                    <br />
                }

            </div>
            :
            <Redirect to={{ pathname: "/" }} />
    )
}

export default Dashboard;