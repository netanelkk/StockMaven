import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { suggestion } from '../../api';

var sugIndexValue = -1, sugcount = 0, searchhistory = JSON.parse(localStorage.getItem("searchhistory") ? localStorage.getItem("searchhistory") : '[]');
let historyrows = [], isrecentmode = true, arrownavigation = false;
const Suggestion = ({ index, data, isActive, setReloadHistory, setClose, setSugIndex, choosed, setSearchQuery }) => {
    const removeitem = () => {
        let newsearchhistory = [];
        for (const i in searchhistory) {
            if (searchhistory[i] !== data.name) {
                newsearchhistory.push(searchhistory[i]);
            }
        }
        searchhistory = newsearchhistory;
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

                searchhistory = searchhistory.filter(e => e !== data.name);
                searchhistory.push(data.name);
                localStorage.setItem("searchhistory", JSON.stringify(searchhistory));

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
        sugIndexValue = val;
        arrownavigation = false;
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

function Search(props) {
    const { choosed, ignoreids, setShowSearch } = props;
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggetions] = useState(true);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sugIndex, setSugIndex] = useState(sugIndexValue);
    const [hideRecent, setHideRecent] = useState(false);
    const [reloadHistory, setReloadHistory] = useState(0);
    const [close, setClose] = useState(0);
    const inputRef = useRef(null);

    const navigate = useNavigate();
    const onQueryChange = (event) => {
        setShowSuggetions(true);
        setSugIndex(-1);
        sugIndexValue = -1;
        setSearchQuery(event.target.value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setShowSuggetions(false);
        inputRef.current.blur();
        if (searchQuery !== "") {
            if (!choosed) {
                let historyterm = searchQuery;
                if (sugIndexValue < 0 || sugIndexValue === sugcount || !arrownavigation) {
                    navigate(window.PATH + "/stocks/" + encodeURIComponent(encodeURIComponent((searchQuery))));
                } else {
                    historyterm = data[sugIndexValue].name;
                    setSearchQuery(data[sugIndexValue].name);
                    navigate(window.PATH + "/stock/" + data[sugIndexValue].symbol);
                }

                searchhistory = searchhistory.filter(e => e !== historyterm);
                searchhistory.push(historyterm);
                localStorage.setItem("searchhistory", JSON.stringify(searchhistory));

            } else {
                if (data[sugIndexValue])
                    choosed(data[sugIndexValue]);
            }

            setSugIndex(-1);
            sugIndexValue = -1;
        } else {
            if (historyrows[sugIndexValue]) {
                navigate(window.PATH + "/stocks/" + encodeURIComponent(encodeURIComponent(historyrows[sugIndexValue].name)));
                setSugIndex(-1);
                sugIndexValue = -1;
            }
        }
    };

    useEffect(() => {
        showRecent();
    }, [showSuggestions, reloadHistory]);

    useEffect(() => {
        if (searchQuery) {
            if (!hideRecent) {
                setHideRecent(true);
                isrecentmode = false;
            }
            const getSuggestions = async () => {
                setLoading(true);
                const d = await suggestion(searchQuery, ignoreids);
                if (!isrecentmode) {
                    if (!d.pass) {
                        sugcount = 0;
                        setData([]);
                    } else {
                        sugcount = d.data.length;
                        setData(d.data);
                    }
                }
                setLoading(false);
            }
            if (searchQuery !== "")
                getSuggestions();
            else
                setShowSuggetions(false);
        } else {
            showRecent();
        }
    }, [searchQuery]);

    const showRecent = () => {
        if (searchQuery === "") {
            if (!choosed) {
                isrecentmode = true;
                recentMode();
            } else {
                 setShowSuggetions(false);
            }
        }
    }

    function recentMode() {
        historyrows = [];
        let counter = 0;
        for (const i in searchhistory) {
            if (counter < 6) {
                historyrows.push({
                    id: i,
                    name: searchhistory[searchhistory.length - i - 1]
                });
                counter++;
            }
        }
        sugcount = historyrows.length;
        setData(historyrows);
        setHideRecent(false);
    }

    const wrapperRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSearch(false);
                closeSugg();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const onKeyPressed = (e) => {
        let additional = (choosed ? 0 : 1);
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                let bottom = (hideRecent ? (sugIndexValue + 1 < sugcount + additional) : (sugIndexValue + 1 < sugcount))
                sugIndexValue = (bottom ? sugIndexValue + 1 : sugIndexValue);
                setSugIndex(sugIndexValue);
                arrownavigation = true;
                break;
            case "ArrowUp":
                e.preventDefault();
                sugIndexValue = (sugIndexValue - 1 >= 0) ? sugIndexValue - 1 : sugIndexValue;
                setSugIndex(sugIndexValue);
                arrownavigation = true;
                break;
            case "Escape":
                closeSugg();
                break;
        }
    }

    useEffect(closeSugg, [close]);

    function closeSugg() {
        setShowSuggetions(false);
        setSugIndex(-1);
        sugIndexValue = -1;
    }

    function opegSugg(e) {
        if (!choosed || choosed && searchQuery) {
            setShowSuggetions(true);
        }
    }

    function focus(e) {
        if (!choosed || choosed && searchQuery) {
            e.target.select();
        }
    }

    return (
        <div className="search" ref={wrapperRef}>
            <form onSubmit={onSubmit} id="search-form">
                <div className="search-container">

                    <input type="text" placeholder="Search for a stock.." value={searchQuery} onChange={onQueryChange} onKeyDown={onKeyPressed}
                        onMouseDown={opegSugg} onFocus={focus} ref={inputRef}
                        className={showSuggestions ? "searchinput active" : ""} autoFocus={true} />

                    {showSuggestions && <div className="search-suggestion">
                        {loading && <div id="sug-loading"></div>}
                        {!hideRecent && !choosed && <div id="titlerecent">Recent Searches</div>}
                        {!hideRecent && !choosed && data.length === 0 && <div id="norecent">No Recent Searches</div>}
                        {data.map((row, index) => 
                        (<Suggestion key={row.id} data={row} 
                            isActive={(index === sugIndex)} choosed={choosed}
                            setReloadHistory={setReloadHistory} setClose={setClose} 
                            setSugIndex={setSugIndex} index={index}
                            setSearchQuery={setSearchQuery} />))}
                        {hideRecent && !choosed && <div className={"suggestions-showmore" + ((sugIndex === sugcount) ? " active" : "")} onClick={onSubmit}>Show All Results</div>}
                    </div>
                    }
                </div>
                {!choosed &&
                    <button type="submit"><i className="bi bi-search"></i></button>}
            </form>
        </div>
    )
}

export default Search;