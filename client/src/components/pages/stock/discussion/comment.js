import React, { useState, useRef } from 'react'
import {
    deletecomment
} from '../../../../api';
import ReactTimeAgo from 'react-time-ago'
import 'react-tooltip/dist/react-tooltip.css'
import { deleteText, loadingText } from '.';

const Comment = ({ comment, setCommentCount }) => {
    const commentBox = useRef(null);
    const [disabled, setDisabled] = useState(false);
    const allowDelete = (localStorage.getItem("myid") == comment.userid);

    const deleteClick = async (e) => {
        const target = e.currentTarget;
        if (!disabled) {
            target.classList.add("cursor-default");
            loading();
            const d = await deletecomment(comment.id);
            if (d.pass) {
                commentBox.current.classList.add('hide');
                setCommentCount(x => x - 1);
            }
            loading(false);
            target.classList.remove("cursor-default");
        }

    }

    const [actionText, setActionText] = useState(deleteText(deleteClick));
    const loading = (show = true) => {
        if (show) {
            setDisabled(true);
            setActionText(loadingText);
        } else {
            setDisabled(false);
            setActionText(deleteText(deleteClick));
        }
    }

    return (
        <div className="comment" ref={commentBox}>
            <div className="commenthead">
                <b>{comment.name}</b> {(<div className='tagname'>#{comment.userid}</div>)}
                <span><ReactTimeAgo date={Date.parse(comment.date)} locale="en-US" /></span>
                {allowDelete && actionText}
            </div>
            <p>
                {comment.content}
            </p>
        </div>
    )
}

export default Comment;