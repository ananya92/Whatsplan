import React, { createContext, useReducer, useContext } from "react";
const PlanContext = createContext();
const { Provider } = PlanContext;

// reducer function to handle the updation of state based on the action type
const reducer = (state, action) => {
    switch (action.type) {
        // setting the data of current plan passed in action.data to the currentPlan
        case "initPlan":
            return { ...state, currentPlan: action.data }
        default:
            throw new Error(`Invalid action type: ${action.type}`);
    }
};

const PlanContextProvider = ({ value = {}, ...props }) => {
    // Creating global store using useReducer hook. 
    const [state, dispatch] = useReducer(reducer, { currentPlan: value, currentTask: value });

    return <Provider value={[state, dispatch]} {...props} />;
};

const usePlanContext = () => {
    return useContext(PlanContext);
};

export { PlanContextProvider, usePlanContext };
