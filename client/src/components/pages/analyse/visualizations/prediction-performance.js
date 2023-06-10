import React, { useState, useEffect } from 'react'

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
                        <div className='stock-bar-img'>
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

export default PredictionPerformance;