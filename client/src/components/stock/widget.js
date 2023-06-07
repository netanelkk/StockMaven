import React, { useRef, useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { removesaved, addsaved } from '../../api';

export default function StockWidget(props) {
    const { stock, useCol = true, Sort, i, optionClick } = props;
    const [add, setAdd] = useState(stock.saved ? stock.saved : false);
    const [loading, setLoading] = useState(false);

    const menuOptionClick = async (e) => {
        e.preventDefault();  
        if(!loading) {
            setLoading(true);
            let d = (!add ? await addsaved(stock.id) : await removesaved(stock.id));
            if(d.pass) {
                optionClick();
                setAdd(val => !val);
            }else{
                alert("Unexpected error, try again later");
            }
            setLoading(false);
        }
    }

    return (
        <div className={"widget" + (useCol ? " col-xl-6" : "")} id={!isNaN(i) ? "drag" + i : ""}>
            <Link to={window.PATH + "/stock/" + stock.symbol} draggable="false">
                <div className={"stock" + (i === 0 && !useCol ? " top-stock" : "")} draggable="true" id={!isNaN(i) ? "widget" + i : ""}
                    onDragStart={() => { if (Sort) { Sort.dragstart(i) } }}
                    onDragEnter={() => { if (Sort) { Sort.dragenter() } }}
                    onDragOver={e => ((Sort && Sort.dragover(e, i)))}
                    onDragEnd={() => { if (Sort) { Sort.dragend() } }}>

                    {(stock.saved !== undefined && optionClick) &&
                        <div className="stock-option" onClick={e => menuOptionClick(e) }>
                            {!loading && (!add ? <i className="bi bi-bookmark"></i> : <i className="bi bi-bookmark-fill"></i>)}
                            {loading && <div className='loading'></div>}
                        </div>
                    }

                    <div className="stock-img">
                        <div>
                            <img src={window.PATH + "/images/stocks/" + stock.icon} />
                        </div>
                    </div>
                    <div className="stock-data">
                        <div className="stock-title">
                            <h2>{stock.name}</h2>
                            <div className={"stock-info " + ((stock.stock_difference < 0) ? "negative" : "positive")}>
                                <span>{stock.stock_difference}</span>
                                <span>{stock.stock_difference_percentage + "%"}</span>
                            </div>
                        </div>
                        <div className="stock-price">${(stock.price === null ? 0 : stock.price)}</div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export { StockWidget };
