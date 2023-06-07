import React, { useState, useEffect, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { mysaved, reorder } from '../../api';
import { Sort } from '../../plugins/sort';
import Async from "react-async";
import { Pie, PieRGB } from "../../plugins/pie";
import { Link } from "react-router-dom";

var positiveCount = 0, categories = {}, negative = {};
const Dashboard = ({ total, data }) => {
    return (
        <div className="saved-dashboard">
            <Pie title={positiveCount + "/" + total} text="Positive" gradient={PieRGB.positiveGradient(positiveCount / total)}
                legend={data.filter(row => row.stock_difference >= 0).sort((a, b) => { return b.stock_difference - a.stock_difference })} />
            <Pie title={(total - positiveCount) + "/" + total} text="Negative" gradient={PieRGB.negativeGradient((total - positiveCount) / total)}
                legend={data.filter(row => row.stock_difference < 0).sort((a, b) => { return a.stock_difference - b.stock_difference })} />
            <Pie title={Object.keys(categories).length} text="Categories"
                gradient={PieRGB.categoryGradient(categories, total)} legend={categories} />
        </div>
    )
}

const DemoWidget = () => {
    return (
        <div className="stock-widget demo-widget">
            <div className="stock">
                <div className="stock-option">
                    <i className="bi bi-bookmark"></i>
                </div>
                <div className="stock-img">
                    <div>
                        <img src={window.PATH + "/images/stocks/apple.png"} />
                    </div>
                </div>
                <div className="stock-data">
                    <div className="stock-title">
                        <h2>Apple</h2>
                        <div className="stock-info positive">
                            <span>2.0</span>
                            <span>3.5%</span>
                        </div>
                    </div>
                    <div className="stock-price">$150</div>
                </div>
            </div>
            <div className="focus"></div>
        </div>
    );
}

function Saved(props) {
    const { isUserSignedIn, setTitle } = props;
    const [refreshState, setRefreshState] = useState(0);

    const getSaved = async () => {
        const d = await mysaved();
        if (!d.pass) throw new Error(d.msg);
        const stockmap = [];
        positiveCount = 0;
        categories = {};
        for (let i = 0; i < d.data.length; i++) {
            stockmap.push(d.data[i].id);
            if (d.data[i].stock_difference >= 0)
                positiveCount++;

            let catname = d.data[i].category;
            if (!categories[catname])
                categories[catname] = 0;

            categories[catname]++;
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