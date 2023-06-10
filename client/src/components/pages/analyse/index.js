import React, { useState, useEffect } from 'react'
import StocksGraph from '../../../elements/graph';
import { Tooltip } from 'react-tooltip';
import StockChooser from './stock-chooser';
import HorizonalBar from './visualizations/horizontal-bar';
import Investment from './visualizations/investment';
import PredictionPerformance from './visualizations/prediction-performance';

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
