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
    }
};
