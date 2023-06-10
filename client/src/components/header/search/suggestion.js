import React from 'react'
import { Link } from "react-router-dom";

const SuggestionRow = ({ index, data, isActive, setReloadHistory, setClose, setSugIndex, choosed, setSearchQuery }) => {
    const removeitem = () => {
        let newsearchhistory = [];
        for (const i in window.searchhistory) {
            if (window.searchhistory[i] !== data.name) {
                newsearchhistory.push(window.searchhistory[i]);
            }
        }
        window.searchhistory = newsearchhistory;
        setReloadHistory(val => val + 1);
        localStorage.setItem("searchhistory", JSON.stringify(newsearchhistory));
    }

    const itemClick = e => {
        if (choosed) {
            e.preventDefault();
            choosed(data);
        } else {
            if (e.target.className === 'remove-item' || e.target.className === 'bi bi-x-lg') {
                e.preventDefault();
                removeitem();
            } else {
                setClose(val => val + 1);

                window.searchhistory = window.searchhistory.filter(e => e !== data.name);
                window.searchhistory.push(data.name);
                localStorage.setItem("searchhistory", JSON.stringify(window.searchhistory));

                setSearchQuery(data.name);
            }
        }

    }

    const setActiveItem = () => {
        activeItem(index);
    }

    const clearActiveItem = () => {
        activeItem();
    }

    const activeItem = (val = -1) => {
        setSugIndex(val);
        window.sugIndexValue = val;
        window.arrownavigation = false;
    }

    return (
        <Link to={window.PATH + (data.symbol ? "/stock/" + data.symbol : "/stocks/" + data.name)} onClick={itemClick}
            onMouseOver={setActiveItem} onMouseOut={clearActiveItem} >
            <div className={"suggestion-row" + ((isActive) ? " active" : "")}>
                {data.icon &&
                    <div className="stock-img">
                        <div>
                            <img src={window.PATH + "/images/stocks/" + data.icon} />
                        </div>
                    </div>}
                <div className="stock-data">
                    <div className="stock-title">
                        <h2>{data.name}</h2>
                    </div>
                    {data.price &&
                        <div className="stock-price">{'$' + data.price}</div>}
                    {!data.price &&
                        <div className='remove-item'>
                            <i className="bi bi-x-lg"></i>
                        </div>
                    }
                </div>
            </div>
        </Link>
    );
}

export default SuggestionRow;

