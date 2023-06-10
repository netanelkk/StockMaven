import React, { useState } from 'react'
import {
    addComment
} from '../../../../api';
import 'react-tooltip/dist/react-tooltip.css'
import { sendText, loadingText } from '.';

const AddComment = ({ stockid, setReloadComments }) => {
    const [submitText, setSubmitText] = useState(sendText);
    const [disabled, setDisabled] = useState("");
    const [content, setContent] = useState("");
    const onContentChange = (event) => setContent(event.target.value);

    function addLoading(show = true) {
        if (show) {
            setDisabled("disabled");
            setSubmitText(loadingText);
        } else {
            setDisabled("");
            setSubmitText(sendText);
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        addLoading();
        const sendResult = await addComment(stockid, content);
        if (sendResult.pass) {
            setContent("");
            setReloadComments(val => val + 1);
        } else {
            alert("Unexpected error, try again later");
        }
        addLoading(false);
    };

    return (
        <div className="new-comment">
            <form className="comment-form" onSubmit={onSubmit}>
                <input type="text" value={content} onChange={onContentChange} placeholder="Write a comment..." maxLength="255" required />
                <button disabled={disabled}>{submitText}</button>
            </form>
        </div>
    )
}

export default AddComment;