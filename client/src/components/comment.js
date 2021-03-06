import React, { useState, useEffect } from "react";
import API from "../utils/API";
import Avatar from 'react-avatar';

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
            <div className="commentAvatar tile-icon">
                <figure className="avatar avatar-xl">
                    <Avatar size="40" round={true} color={Avatar.getRandomColor('sitebase', ['purple'])} name={commentedByState.name}/>
                </figure>
            </div>
            <div className="tile-content">
                <p style={{ textAlign: "left" }} className="tile-title">{commentedByState.name}</p>
                <p style={{ textAlign: "left" }} className="tile-subtitle">{props.comment.comment}</p>
                <hr className="lineStyle"/>
            </div>
        </div>
    )
}

export default Comment;