import axios from "axios";

export default {

    // Gets the books with the given search text
    registerUser: function (postData) {
        return axios.post("/api/user/register", postData);
    },
    // Gets all favorite books
    loginUser: function (postData) {
        return axios.post("/api/user/login", postData);
    },
    // Deletes the post with the given id
    getUser: function () {
        return axios.get("/api/user");
    },
    logoutUser: function () {
        return axios.post("/api/user/logout");
    }
};
