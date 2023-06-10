import React, { useState, useEffect } from 'react'
import { grow } from '../../../../api';
import { Graph } from '../../../../js-plugins/graph'


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

export default HorizonalBar;