import React, { useState, useEffect, useRef } from 'react'
import Search from '../../header/search';
import { Graph } from '../../../js-plugins/graph'


const StockChooser = ({ stockids, setStockids }) => {
    const [popupIndex, setPopupIndex] = useState(-1);
    const [choosed, setChoosed] = useState([]);

    const chooseClick = (i) => {
        setPopupIndex(i);
    }

    const wrapperRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                closeSuggestions();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const closeSuggestions = () => {
        setPopupIndex(-1);
    }

    const stockChoosed = (stock) => {
        if (stockids.length < 5) {
            if (!stockids.includes(stock.id)) {
                setStockids(current => [...current, stock.id]);
                const currentchoosed = [...choosed];
                currentchoosed[popupIndex] = {
                    name: stock.name,
                    icon: stock.icon,
                    graphColor: Graph.COLORS.linecolors[popupIndex][0]
                }
                setChoosed(current => currentchoosed);
            }
        }

        closeSuggestions();
    }

    const removeChoosed = (i) => {
        const currentstockids = [...stockids];
        currentstockids.splice(i, 1);
        setStockids(current => currentstockids);

        const currentchoosed = [...choosed];
        currentchoosed.splice(i, 1);
        setChoosed(current => remapGraphColors(currentchoosed));
    }

    const remapGraphColors = (items) => {
        return items.map((item, i) => {
            return {
                name: item.name,
                icon: item.icon,
                graphColor: Graph.COLORS.linecolors[i]
            }
        })
    }

    return (
        <div className="chooser-row">
            {(stockids.length < 5 ? [...stockids, 0] : stockids).map((x, i) => {
                return (
                    <div className="chooser-container" key={"container" + i} ref={wrapperRef}>
                        {choosed[i] &&
                            <>
                                <div className='choosed-remove' onClick={() => { removeChoosed(i) }}>
                                    <i className="bi bi-x"></i>
                                </div>
                                <div className="stock-choosed">
                                    <div className="stock-choosed-img">
                                        <img src={window.PATH + "/images/stocks/" + choosed[i].icon} />
                                    </div>
                                    <h3>{choosed[i].name}</h3>
                                    <div className="stock-line" style={{ background: choosed[i].graphColor }}></div>
                                </div>
                            </>
                        }
                        {!choosed[i] &&
                            <div className='stock-chooser' onClick={() => { chooseClick(i) }}>
                                +
                            </div>}
                        {popupIndex === i &&
                            <Search choosed={stockChoosed} ignoreids={stockids} />}
                    </div>
                )
            })}
        </div>
    )
}

export default StockChooser;