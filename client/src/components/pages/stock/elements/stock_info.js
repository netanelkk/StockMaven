import React, { useState, useEffect } from 'react'
import {
    removesaved, addsaved
} from '../../../../api';
import 'react-tooltip/dist/react-tooltip.css'
import Categories from '../../../../elements/categories';
import StocksGraph from '../../../../elements/graph';

const StockInfo = ({ data }) => {
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


            <div className="graph-container">
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

export default StockInfo;