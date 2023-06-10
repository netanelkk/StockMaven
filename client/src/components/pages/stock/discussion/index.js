import React, { useState, useEffect, useRef } from 'react'
import {
    fetchComments
} from '../../../../api';
import 'react-tooltip/dist/react-tooltip.css'
import Comment from './comment';
import AddComment from './add-comment';

const MapComments = React.memo(({ data, setCommentCount }) => {
    return (
        data.map(comment => (
            <Comment key={"comment" + comment.id} comment={comment} setCommentCount={setCommentCount} />
        ))
    )
});

const commentLoading = (<><div className="loading" id="comment-loading"></div></>);
export const sendText = (<><i className="bi bi-send" id="comment-send"></i></>);
export const loadingText = (<><div className="loading"></div></>);
export const deleteText = (deleteClick) => {
    return (<div className="delete-comment" onClick={deleteClick}><i className="bi bi-x-circle-fill"></i></div>);
}

const COMMENT_PAGE_OFFSET = 15;
const Discussion = ({ stockid, isUserSignedIn }) => {
    const loadButton = useRef(null);
    const listInnerRef = useRef();
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentCount, setCommentCount] = useState(0);
    const [reloadComments, setReloadComments] = useState(0);

    const loadMore = () => {
        if (page < Math.ceil(commentCount / COMMENT_PAGE_OFFSET)) {
            setPage(page => page + 1);
        }
    }

    const loadComments = async () => {
        setLoading(true);
        const d = await fetchComments(stockid, page);
        if (!d.pass) {
            setLoading(false);
        } else {
            setCommentCount(d.count);
            setData((data) => [...data, ...d.data]);
            setLoading(false);
        }
    }

    useEffect(() => {
        loadComments();
    }, [page]);


    useEffect(() => {
        if (reloadComments > 0) {
            setData([]);
            if (page === 1) loadComments();
            setPage(1);
        }
    }, [reloadComments]);

    useEffect(() => {
        if (!loading && page == Math.ceil(commentCount / COMMENT_PAGE_OFFSET)) {
            loadButton.current.classList.add('hide');
        }
    }, [loading]);


    const onScroll = () => {
        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
            if (scrollTop + clientHeight === scrollHeight) {
                if (page < Math.ceil(commentCount / COMMENT_PAGE_OFFSET)) {
                    setPage(page => page + 1);
                }
            }
        }
    };

    const triggerLogin = () => {
        document.querySelector('.trigger-login').click();
    }

    return (
        <div className='discussion-block'>
            <div className='discussion-title'>
                <h1>Discussion</h1>
                <div>{commentCount} Comments</div>
            </div>
            <div className="discussion-box">
                {isUserSignedIn &&
                    <AddComment stockid={stockid} setReloadComments={setReloadComments} />}
                {!isUserSignedIn &&
                    <div id="guest-comment">You must be <span onClick={triggerLogin}>logged in</span> to comment</div>}
                <div className="comments" onScroll={() => onScroll()} ref={listInnerRef}>
                    <MapComments data={data} setCommentCount={setCommentCount} />
                    {loading && commentLoading}
                    {!loading && (commentCount > 0) && <button className="loadmore" onClick={loadMore} ref={loadButton}>Load more comments...</button>}
                    {!loading && (commentCount == 0) &&
                        <div className="comment">
                            <span style={{ fontSize: "10pt" }}>Be the first to add comment</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Discussion;