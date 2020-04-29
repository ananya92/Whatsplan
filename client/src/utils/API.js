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
    // get user by id
    getUserById: function(id) {
        return axios.get(`/api/user/${id}`);
    },
    // post new plan
    newPlan: function(postData) {
        return axios.post("/api/wp/plan", postData);
    },
    addPlanToUser: function(email, plan_id) {
        return axios.put(`/api/user/addPlanToUser/${email}`, {plan_id: plan_id});
    },
    getCurrentPlans: function() {
        return axios.get(`/api/user/getCurrentPlans`);
    },
    addNewMilestone: function(postData) {
        return axios.post("/api/wp/milestone", postData);
    },
    addMilestoneToPlan: function(plan_id, milestone_id) {
        return axios.put("/api/wp/addMilestoneToPlan", 
        {
            plan_id: plan_id,
            milestone_id: milestone_id
        })
    },
    // get plan by id
    getPlan: function(id) {
        return axios.get(`/api/wp/plan/${id}`);
    },
    // get milestone by id
    getMilestone: function(id) {
        return axios.get(`/api/wp/milestone/${id}`);
    },
    // get task by id
    getTask: function(id) {
        return axios.get(`/api/wp/task/${id}`);
    },
    addNewTask: function(postData) {
        return axios.post("/api/wp/task", postData);
    },
    addTaskToMilestone: function(milestone_id, task_id) {
        return axios.put("/api/wp/addTaskToMilestone", 
        {
            milestone_id: milestone_id,
            task_id: task_id
        })
    },
    getMilestoneByTaskId: function(taskId) {
        return axios.get(`/api/wp/milestone/task/${taskId}`)
    }
};
