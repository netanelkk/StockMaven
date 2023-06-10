
import React, { useState, useEffect } from 'react'
import { Graph } from '../../../../js-plugins/graph'


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

export default Investment;