import React, { useState, useEffect } from 'react'
import { StockWidget } from '../../../elements/widget';
import { mysaved, reorder } from '../../../api';
import { Sort } from '../../../js-plugins/sort';
import Async from "react-async";
import { Link } from "react-router-dom";
import Dashboard from './dashboard';
import DemoWidget from './demo-widget';

window.positiveCount = 0;
window.categories = {};


function Saved(props) {
    const { isUserSignedIn, setTitle } = props;
    const [refreshState, setRefreshState] = useState(0);

    const getSaved = async () => {
        const d = await mysaved();
        if (!d.pass) throw new Error(d.msg);
        const stockmap = [];
        window.positiveCount = 0;
        window.categories = {};
        for (let i = 0; i < d.data.length; i++) {
            stockmap.push(d.data[i].id);
            if (d.data[i].stock_difference >= 0)
            window.positiveCount++;

            let catname = d.data[i].category;
            if (!window.categories[catname])
            window.categories[catname] = 0;

            window.categories[catname]++;
        }
        Sort.init(d.data.length, stockmap, reorder);
        return d.data;
    }

    const optionClick = () => {
        setRefreshState(val => val + 1);
    }

    useEffect(() => {
        setTitle("My Collections");

        return () => {
            Sort.kill();
        };
    }, []);

    const triggerLogin = () => {
        document.querySelector('.trigger-login').click();
    }



    return (
        <div className="saved-stocks">
            {isUserSignedIn &&
                <Async promiseFn={getSaved}>
                    {({ data, error, isPending }) => {
                        if (isPending) return (
                            <div className='page'>
                                <div className="stocks-title">
                                    <h1>Saved Stocks</h1>
                                </div>
                                <div className='loading-large' style={{ height: "400px" }}></div>
                            </div>);
                        if (error) return (
                            <div className="nosaved">
                                <div className="center-demo">
                                    <DemoWidget />
                                    <h2>Add Stocks to Bookmarks</h2>
                                    <Link to={window.PATH + "/stocks"} className="expand-button">
                                        View All Stocks
                                    </Link>
                                </div>
                            </div>
                        );
                        if (data) {
                            const total = data.length;
                            return (
                                <div className='page'>
                                    <div className="stocks-title">
                                        <h1>Saved Stocks</h1>
                                    </div>
                                    <div className='row dragrow' id="dragparent" onDragOver={e => { e.preventDefault(); }}>
                                        <Dashboard total={total} data={data} />
                                        {data.map((stock, i) => (<StockWidget stock={stock} key={"stock" + stock.id}
                                            Sort={Sort} i={i} optionClick={optionClick} />))}
                                    </div>
                                </div>
                            )
                        }
                    }}
                </Async>}

            {!isUserSignedIn &&
                <div className="nosaved">
                    <div className='saved-guest'>
                        <div id="boxname">Save And Manage Stocks
                            <h3>Register quickly for free</h3>
                        </div>
                        <button className="page-button expand-button"  onClick={triggerLogin}>
                            <i className="bi bi-box-arrow-in-left"></i> Sign In
                        </button>
                    </div>
                </div>
            }

        </div>

    );
}

export default Saved;