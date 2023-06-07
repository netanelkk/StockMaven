import React, { useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom";
import {
    fetchBySymbol, fetchSuggestions,
    addComment, fetchComments, deletecomment,
    removesaved, addsaved, feedback, addFeedback
} from '../../api';
import { Tooltip } from 'react-tooltip';
import { StockWidget } from '../stock/widget';
import Async from "react-async";
import ReactTimeAgo from 'react-time-ago'
import 'react-tooltip/dist/react-tooltip.css'
import { Pie, PieRGB } from "../../plugins/pie";
import Categories from '../stock/categories';
import StocksGraph from './graph';

const StockElements = ({ data }) => {
    const [add, setAdd] = useState(data.saved);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState(null);

    const menuOptionClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        let d = (!add ? await addsaved(data.id) : await removesaved(data.id));
        if (d.pass) {
            setAdd(val => !val);
        } else {
            alert("Unexpected error, try again later");
        }
        setLoading(false);
    }


    useEffect(() => {
        if (data.saved) {
            document.getElementsByClassName("stock-saved")[0].style.display = "none";
            setTimeout(() => {
                document.getElementsByClassName("stock-saved")[0].style.display = "block";
            }, 10);
        }
    }, [add]);

    useEffect(() => {
        setCategories([{ id: 0, icon: data.category_icon, name: data.category_name, count: -1 }])
    }, [data]);

    return (
        <>
            <div id="stockpage-title">
                <div className="stock-img">
                    <div>
                        <img src={window.PATH + "/images/stocks/" + data.icon} />
                    </div>
                </div>
                <div className="stock-name">
                    <h1>{data.name + " (" + data.symbol + ")"}</h1>

                    {data.saved !== undefined && !loading &&
                        <div className="stock-box">
                            <div className={'stock-saved' + (add ? ' active' : '')} onClick={e => menuOptionClick(e)}
                                data-tooltip-html={!add ? "Add to saved" : "Remove from saved"} data-tooltip-id="tooltip">
                                {!add ? <i className="bi bi-bookmark"></i> : <i className="bi bi-bookmark-fill"></i>}
                            </div>
                        </div>
                    }
                    {loading && <div className='loading'></div>}
                </div>

                <div className="stock-box">
                    <span className="stock-price">{"$" + data.close}</span>
                    <div className={"stock-info " + ((data.stock_difference < 0) ? "negative" : "positive")}>
                        <span>{data.stock_difference}</span>
                        <span>{data.stock_difference_percentage + "%"}</span>
                    </div>
                </div>
            </div>


            <div class="graph-container">
                <StocksGraph stockids={[data.id]} />
            </div>


            <div className='page' id="detailsrow">
                <div className="detailblock">
                    <h2>Today's Oscillator</h2>
                    <table id="table-desktop-version">
                        <thead>
                            <tr>
                                <td>${data.open}</td>
                                <td>${data.high}</td>
                                <td>${data.low}</td>
                                <td>${data.close}</td>
                            </tr>

                        </thead>
                        <tbody>
                            <tr>
                                <td>Open</td>
                                <td>High</td>
                                <td>Low</td>
                                <td>Close</td>
                            </tr>
                        </tbody>
                    </table>
                    <table id="table-mobile-version">
                        <tbody>
                            <tr>
                                <td>${data.open}</td>
                            </tr>
                            <tr>
                                <td>Open</td>
                            </tr>
                            <tr>
                                <td>${data.high}</td>
                            </tr>
                            <tr>
                                <td>High</td>
                            </tr>
                            <tr>
                                <td>${data.low}</td>
                            </tr>
                            <tr>
                                <td>Low</td>
                            </tr>
                            <tr>
                                <td>${data.close}</td>
                            </tr>
                            <tr>
                                <td>Close</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="detailblock" id="stockdetail">
                    <h2>About {data.name}</h2>
                    <p>
                        {data.about}
                    </p>
                    {categories && <Categories categories={categories} />}
                </div>
            </div >
        </>
    )
}

function sendText() {
    return (<><i className="bi bi-send" id="comment-send"></i></>);
}

function deleteText(deleteClick) {
    return (<div className="delete-comment" onClick={deleteClick}><i className="bi bi-x-circle-fill"></i></div>);
}

function loadingText() {
    return (<><div className="loading"></div></>);
}

function commentLoading() {
    return (<><div className="loading" id="comment-loading"></div></>);
}

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

const MapComments = React.memo(({ data, setCommentCount }) => {
    return (
        data.map(comment => (
            <Comment key={"comment" + comment.id} comment={comment} setCommentCount={setCommentCount} />
        ))
    )
});

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
                    {loading && commentLoading()}
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

const Feedback = ({ stockid, isUserSignedIn }) => {
    const [pieData, setPieData] = useState(null);
    const [reloadPie, setReloadPie] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const d = await feedback(stockid);
            if (!d.pass) return;

            let data = {
                positive: 0, total: 0,
                voted: (d.data.length > 0 ? d.data[0].voted : 0)
            }
            for (let i = 0; i < d.data.length; i++) {
                if (d.data[i].feedback)
                    data.positive += d.data[i].count;
                data.total += d.data[i].count;
            }

            data.percent = data.total ? (data.positive / data.total) * 100 : 0;

            setPieData(data);
            setLoading(false);
        })();
    }, [reloadPie]);

    const feedbackClick = async (feedback) => {
        setLoading(true);
        const sendResult = await addFeedback(feedback, stockid);
        if (sendResult.pass) {
            setReloadPie(val => val + 1);
        } else {
            setLoading(false);
            alert("Unexpected error, try again later");
        }
    }

    return (
        <div className="feedback-block">
            <h3>What Do You Think About This Stock?</h3>
            {pieData &&
                <>
                    <Pie title={pieData.percent + "%"} text="Like"
                        gradient={PieRGB.positiveGradient(pieData.percent / 100)} />

                    {!pieData.voted && !loading && isUserSignedIn &&
                        <div className="feedback-buttons">
                            <i className="bi bi-arrow-down-circle" onClick={() => { feedbackClick(0) }}></i>
                            <i className="bi bi-arrow-up-circle" onClick={() => { feedbackClick(1) }}></i>
                        </div>}
                    {loading && loadingText()}

                    <span id="voted">{pieData.total} people voted</span>
                </>}
            {!pieData && <div className='loading-large' style={{ height: "200px" }}></div>}
        </div>
    )
}

function Stock(props) {
    const { isUserSignedIn, setTitle } = props;
    const { symbol } = useParams();

    const getData = async () => {
        const d = await fetchBySymbol(symbol);
        if (!d.pass) throw new Error(d.msg);
        return d.data[0];
    }

    const getSuggestions = async () => {
        const d = await fetchSuggestions(symbol);
        if (!d.pass) return;
        return d.data;
    }


    return (
        <>
            <Tooltip id="tooltip" classNameArrow="tooltip-arrow" />
            <Async promiseFn={getData}>
                {({ data, error, isPending }) => {
                    setTitle(symbol);
                    if (isPending) return (<div className='loading-large' style={{ height: "200px" }}></div>);
                    if (error) return (<div className='page'><div id="notice">
                        <i className="bi bi-exclamation-circle"></i>
                        <p>
                            <h3>Couldn't obtain page</h3>
                            <p>Try again later. if you encounter this problem again, check the URL spelled correctly.</p>
                        </p>
                    </div></div>);
                    if (data) {
                        setTitle(data.name);
                        return (
                            <>
                                <StockElements data={data} />
                                <div className='page' style={{ marginTop: 0 }}>
                                    <div className="stock-block">
                                        <Feedback isUserSignedIn={isUserSignedIn} stockid={data.id} />
                                        <Discussion isUserSignedIn={isUserSignedIn} stockid={data.id} />
                                    </div>
                                    <h1 id="seealso">See Also</h1>
                                    <Async promiseFn={getSuggestions}>
                                        {({ data, error, isPending }) => {
                                            if (isPending) return (<div className='loading-sug'></div>);
                                            if (error) return (<>error</>);
                                            if (data) {
                                                return (
                                                    <>
                                                        <div className="row">
                                                            {data.map(stock => (<StockWidget stock={stock} key={"suggestion" + stock.id} optionClick={() => { }} />))}
                                                        </div>
                                                    </>
                                                )
                                            }
                                        }}
                                    </Async>
                                </div>
                            </>
                        )
                    }
                }}
            </Async>
        </>
    );
}

export default Stock;
