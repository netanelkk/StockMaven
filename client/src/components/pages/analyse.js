import React, { useState, useEffect, useRef } from 'react'
import StocksGraph from '../stock/graph';
import { grow } from '../../api';
import Search from '../header/search';
import { Graph } from '../../plugins/graph'
import { Tooltip } from 'react-tooltip';


const PredictionPerformance = ({ graphData }) => {
    const [barData, setBarData] = useState([]);
    useEffect(() => {
        if (graphData.length > 0) {
            const performances = [];
            for (let i = 0; i < graphData.length; i++) {
                let success = 0, fail = 0;
                for (let j = 0; j < graphData[i].length; j++) {
                    if (j === graphData[i].length - 1) break;
                    if (graphData[i][j].prediction) {
                        if ((graphData[i][j].close - graphData[i][j + 1].close > 0 && graphData[i][j].prediction > 0)
                            || (graphData[i][j].close - graphData[i][j + 1].close < 0 && graphData[i][j].prediction < 0)) {
                            success++;
                        } else {
                            fail++;
                        }
                    }
                }

                performances.push({
                    name: graphData[i][0].name,
                    icon: graphData[i][0].icon,
                    percentage: Number(((success / (success + fail)) * 100).toFixed(2))
                });
            }

            setBarData(performances.sort((a, b) => a.percentage < b.percentage));
        }
    }, [graphData]);

    return (
        <div className='bar-chart'>
            {barData && barData.map((data, i) => (
                <div className="bar-space" key={'bar-chart-item-' + i}>
                    <div className={'bar ' + (data.percentage === 0 ? ' blank-bar' : '')} style={{ height: (data.percentage / 100 * 350) + "px" }}>
                        <div className='bar-value'>
                            {data.percentage}%
                        </div>
                    </div>
                    <div className='bar-label'>
                        <div class='stock-bar-img'>
                            <img src={window.PATH + "/images/stocks/" + data.icon} />
                        </div>
                        {data.name}
                    </div>
                </div>
            ))}
            <div className='bar-lines'>
                <div className='line'>
                    <div>100</div>
                </div>
                <div className='line'>
                    <div>80</div>
                </div>
                <div className='line'>
                    <div>60</div>
                </div>
                <div className='line'>
                    <div>40</div>
                </div>
                <div className='line'>
                    <div>20</div>
                </div>
            </div>
        </div>
    )
}

const yAxis = [27, 82, 137.5, 192.5, 248]; // exact Y value of branch
const Investment = ({ graphData }) => {
    const [hoverId, setHoverId] = useState(-1);
    const [branches, setBranches] = useState([]);
    const [range, setRange] = useState('');

    const getStroke = (index) => {
        return (hoverId === index ? '#434343' : '#262626')
    }

    useEffect(() => {
        if (graphData.length > 0) {
            const differences = [];
            for (const item of graphData) {
                let endIndex = item.length - 1, startIndex = 0;
                while (!item[endIndex].close) endIndex--;
                while (!item[startIndex].close) startIndex++;
                differences.push({
                    profit: Number((item[startIndex].close / item[endIndex].close * 100).toFixed(2)),
                    name: item[0].name
                });
            }

            setRange(Graph.externalFormatdate(graphData[0][graphData[0].length - 1].date) + " - " +
                Graph.externalFormatdate(graphData[0][0].date));
            setBranches(differences.sort((a, b) => a.profit < b.profit));
        }
    }, [graphData]);

    return (
        <div className="investment">
            <div className="inv-amount">
                100$
                <div>Investment</div>
                <div className="inv-period">{range}</div>
            </div>
            <div className="branches">
                <svg width="80" height="275">
                    {branches && branches.map((branch, i) => (
                        <line x1="0" y1="137.5" x2="80" y2={yAxis[i]}
                            stroke={getStroke(i)} strokeWidth="3" key={'branchline-' + i} />
                    ))}
                </svg>
            </div>
            <div className="inv-details">
                <ul onMouseLeave={() => { setHoverId(-1) }}>
                    {branches && branches.map((branch, i) => (
                        <li onMouseEnter={() => { setHoverId(i) }} key={'branch' + i}>
                            <div className="inv-stock">
                                {branch.name}
                            </div>
                            <div className="inv-profit">
                                {branch.profit}$
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

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

const HorizonalBar = ({ stockids, range }) => {
    const [growData, setGrowData] = useState(null);

    useEffect(() => {
        if (stockids.length > 0) {
            (async () => {
                const d = await grow({ stockids, range });
                setGrowData(d.data);
            })();
        }
    }, [stockids]);

    const color = (diff) => {
        if (diff < 0)
            return Graph.COLORS.horizontalcolor.negative;
        return Graph.COLORS.horizontalcolor.positive;
    }

    const handleMouseMove = (event) => {
        if (document.getElementById("bar-tooltip")) {
            document.getElementById("bar-tooltip").style.left = (event.clientX - 110) + "px";
        }
    };

    return (
        <>
            {growData &&
                growData.map(data => {
                    const d = {
                        percent: data.stock_difference_percentage,
                        diff: data.stock_difference,
                        width: Math.abs(data.stock_difference_percentage / 2)
                    };

                    let tooltip = "<div class='bartooltip'>";
                    tooltip += "<div class='stock-bar-img'><img src='" + window.PATH + "/images/stocks/" + data.icon + "' /></div>";
                    tooltip += "<span>" + data.name + "</span>";
                    tooltip += "<div class='tooltip-extra'><div>DIFFERENCE: " + d.diff + "$</div>";
                    tooltip += "<h3>" + d.percent + '%</h3></div></div>';

                    return (
                        <div className="horizontal-bar" key={"horbar-" + range + "-" + data.id}
                            data-tooltip-id="bar-tooltip"
                            data-tooltip-html={tooltip}
                            onMouseMove={handleMouseMove}>
                            <div className="stock-bar">
                                <div className="stock-bar-img"><img src={window.PATH + "/images/stocks/" + data.icon} /></div>
                                <span>{data.name}</span>
                            </div>
                            <div className="performance-bar-container">
                                <div className="performance-bar"
                                    style={{
                                        width: d.width + "%",
                                        marginLeft: (d.percent < 0 ? 50 - d.width + "%" : '50%'),
                                        background: "linear-gradient(90deg," + color(d.diff)[0] + "," + color(d.diff)[1] + ")"
                                    }}></div>
                            </div>
                            <div className='performance-details'>
                                <div>{d.diff}</div>
                                {d.percent + '%'}
                            </div>
                        </div>
                    )
                })}
        </>
    )
}

function Analyse({ setTitle }) {
    const [stockids, setStockids] = useState([]);
    const [graphData, setGraphData] = useState([]);
    useEffect(() => {
        setTitle("Analyze Stocks");
    }, []);
    return (
        <>
            <Tooltip id="bar-tooltip" classNameArrow="tooltip-arrow" />

            <div className='page'>
                <div className="stocks-title" id="analyse-title">
                    <h1>Analyse</h1>
                    <h3>Choose up to 5 stocks to analyse</h3>
                </div>
                <StockChooser stockids={stockids} setStockids={setStockids} />
            </div>

            {stockids.length > 0 &&
                <>
                    <div class="graph-container">
                        <StocksGraph stockids={stockids} setGraphData={setGraphData} />
                    </div>
                    <div className='page'>
                        <div className="price-performance">
                            <h2>Price Performance</h2>
                            <div className="bar-section-container">
                                <b>Last Week</b>
                                <HorizonalBar stockids={stockids} range={7} />
                            </div>

                            <div className="bar-section-container">
                                <b>Last Month</b>
                                <HorizonalBar stockids={stockids} range={30} />
                            </div>
                        </div>

                        <Investment graphData={graphData} />

                        <h2>Prediction Performance</h2>
                        <PredictionPerformance graphData={graphData} />
                    </div>
                </>}
        </>
    );
}

export default Analyse;
