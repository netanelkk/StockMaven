import React, { useState, useEffect, useRef } from 'react';
import { Graph } from '../js-plugins/graph';
import {
    fetchGraph
} from '../api';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip';

var currentGraph;
function StocksGraph(props) {
    const { stockids, setGraphData } = props;
    const graphRef = useRef(null);
    const [dots, setDots] = useState(null);
    const [range, setRange] = useState(30);

    useEffect(() => {
        window.addEventListener("resize", debounce);
        return () => {
            currentGraph = null;
            window.removeEventListener("resize", debounce);
        }
    }, []);

    var timer;
    function debounce() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => { currentGraph.draw(); }, 100);
    }

    useEffect(() => {
        (async () => {
            const d = await fetchGraph(stockids, range);
            if (!d.pass) throw new Error(d.msg);
            currentGraph = new Graph(graphRef.current);
            setDots(currentGraph.init(d.data));
            if (setGraphData)
                setGraphData(d.data);
        })();
    }, [range, stockids]);

    useEffect(() => {
        if (dots && currentGraph) {
            currentGraph.draw();
        }
    }, [dots]);

    return (
        <>
            <Tooltip id="graph-tooltip" classNameArrow="tooltip-arrow" />
            <div className="graph-menu">
                <div className="graph-hint">
                    <span>Predicted:</span>
                    <div className="hint">
                        <i className="bi bi-chevron-compact-up raise"></i>
                        <span>RAISE</span>
                    </div>
                    <div className="hint">
                        <i className="bi bi-chevron-compact-down fall"></i>
                        <span>FALL</span>
                    </div>
                </div>
                <ul>
                    <li className={(range === 7) ? "active" : ""} onClick={() => { setRange(7); setDots(null); }}>1 week</li>
                    <li className={(range === 30) ? "active" : ""} onClick={() => { setRange(30); setDots(null); }}>1 month</li>
                    <li className={(range === 365) ? "active" : ""} onClick={() => { setRange(365); setDots(null); }}>1 year</li>
                </ul>
            </div>

            <div id="graph">
                <div className="graph-dots">
                    {dots}
                </div>
                {!dots ? <div className='loading-large' style={{ position: "absolute", right: 0, left: 0 }}></div> : ""}
                <canvas width="0" height="400" ref={graphRef} className={!dots ? "" : ""}></canvas>
            </div>
        </>
    )
}

export default StocksGraph;