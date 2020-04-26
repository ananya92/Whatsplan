import axios from "axios";

export default {

    // Register new user
    registerUser: function (postData) {
        return axios.post("/api/user/register", postData);
    },
    // Login request
    loginUser: function (postData) {
        return axios.post("/api/user/login", postData);
    },
    // get the logged in user
    getUser: function () {
        return axios.get("/api/user");
    },
    // logout user
    logoutUser: function () {
        return axios.post("/api/user/logout");
    },
    // get all registered users
    getRegisteredUsers: function() {
        return axios.get("/api/user/all");
    },
    // get user by email
    getUserByEmail: function(email) {
        return axios.get(`/api/user/getUserByEmail/${email}`);
    },
    // post new plan
    newPlan: function(postData) {
        return axios.post("/api/wp/plan", postData);
    },
    addPlanToUser: function(email, plan_id) {
        return axios.put(`/api/user/addPlanToUser/${email}`, {plan_id: plan_id});
    },
    getCurrentPlans: function(email) {
        return axios.get(`/api/user/getCurrentPlans/${email}`);
    }
};
