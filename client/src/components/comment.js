import React, { useState, useEffect, useRef } from "react";
import API from "../utils/API";

function Comment(props) {
    const [commentedByState, setCommentedByState] = useState({
        name: ""
    });
    useEffect(() => {
        API.getUserById(props.comment.commentedBy).then(response => {
            setCommentedByState({
                name: response.data.firstname + " " + response.data.lastname
            });
        }).catch(error => {
            console.log("Error while getting user by id: ", error);
        });
    },[]);
    return (
        <div className="tile" style={{ paddingBottom: "17px" }}>
            <div className="tile-icon">
                <figure className="avatar avatar-xl">
                    <img src="images/avatar.png" />
                </figure>
            </div>
            <div className="tile-content">
                <p style={{ textAlign: "left" }} className="tile-title">{commentedByState.name}</p>
                <p style={{ textAlign: "left" }} className="tile-subtitle">{props.comment.comment}</p>
            </div>
        </div>
    )
}

export default Comment;