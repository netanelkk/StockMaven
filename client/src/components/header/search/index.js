import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { suggestion } from '../../../api';
import SuggestionRow from './suggestion';

window.sugIndexValue = -1;
window.arrownavigation = false;
window.searchhistory = JSON.parse(localStorage.getItem("searchhistory") ? localStorage.getItem("searchhistory") : '[]');
let sugcount = 0, historyrows = [], isrecentmode = true;

function Search(props) {
    const { choosed, ignoreids, setShowSearch } = props;
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggetions] = useState(true);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sugIndex, setSugIndex] = useState(window.sugIndexValue);
    const [hideRecent, setHideRecent] = useState(false);
    const [reloadHistory, setReloadHistory] = useState(0);
    const [close, setClose] = useState(0);
    const inputRef = useRef(null);

    const navigate = useNavigate();
    const onQueryChange = (event) => {
        setShowSuggetions(true);
        setSugIndex(-1);
        window.sugIndexValue = -1;
        setSearchQuery(event.target.value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setShowSuggetions(false);
        inputRef.current.blur();
        if (searchQuery !== "") {
            if (!choosed) {
                let historyterm = searchQuery;
                if (window.sugIndexValue < 0 || window.sugIndexValue === sugcount || !window.arrownavigation) {
                    navigate(window.PATH + "/stocks/" + encodeURIComponent(encodeURIComponent((searchQuery))));
                } else {
                    historyterm = data[window.sugIndexValue].name;
                    setSearchQuery(data[window.sugIndexValue].name);
                    navigate(window.PATH + "/stock/" + data[window.sugIndexValue].symbol);
                }

                window.searchhistory = window.searchhistory.filter(e => e !== historyterm);
                window.searchhistory.push(historyterm);
                localStorage.setItem("searchhistory", JSON.stringify(window.searchhistory));

            } else {
                if (data[window.sugIndexValue])
                    choosed(data[window.sugIndexValue]);
            }

            setSugIndex(-1);
            window.sugIndexValue = -1;
        } else {
            if (historyrows[window.sugIndexValue]) {
                navigate(window.PATH + "/stocks/" + encodeURIComponent(encodeURIComponent(historyrows[window.sugIndexValue].name)));
                setSugIndex(-1);
                window.sugIndexValue = -1;
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
        for (const i in window.searchhistory) {
            if (counter < 6) {
                historyrows.push({
                    id: i,
                    name: window.searchhistory[window.searchhistory.length - i - 1]
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
                let bottom = (hideRecent ? (window.sugIndexValue + 1 < sugcount + additional) : (window.sugIndexValue + 1 < sugcount))
                window.sugIndexValue = (bottom ? window.sugIndexValue + 1 : window.sugIndexValue);
                setSugIndex(window.sugIndexValue);
                window.arrownavigation = true;
                break;
            case "ArrowUp":
                e.preventDefault();
                window.sugIndexValue = (window.sugIndexValue - 1 >= 0) ? window.sugIndexValue - 1 : window.sugIndexValue;
                setSugIndex(window.sugIndexValue);
                window.arrownavigation = true;
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
        window.sugIndexValue = -1;
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
                    <input type="text" placeholder="Search for a stock.." value={searchQuery}
                        onChange={onQueryChange} onKeyDown={onKeyPressed}
                        onMouseDown={opegSugg} onFocus={focus} ref={inputRef}
                        className={showSuggestions ? "searchinput active" : ""} autoFocus={true} />

                    {showSuggestions && <div className="search-suggestion">
                        {loading &&
                            <div id="sug-loading"></div>}
                        {!hideRecent && !choosed &&
                            <div id="titlerecent">Recent Searches</div>}
                        {!hideRecent && !choosed && data.length === 0 &&
                            <div id="norecent">No Recent Searches</div>}
                        {data.map((row, index) =>
                        (<SuggestionRow key={row.id} data={row}
                            isActive={(index === sugIndex)} choosed={choosed}
                            setReloadHistory={setReloadHistory} setClose={setClose}
                            setSugIndex={setSugIndex} index={index}
                            setSearchQuery={setSearchQuery} />))}
                        {hideRecent && !choosed &&
                            <div className={"suggestions-showmore" + ((sugIndex === sugcount) ? " active" : "")}
                                onClick={onSubmit}>
                                Show All Results
                            </div>}
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