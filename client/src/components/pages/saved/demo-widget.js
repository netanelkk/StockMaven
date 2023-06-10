import React from 'react';

const DemoWidget = () => {
    return (
        <div className="stock-widget demo-widget">
            <div className="stock">
                <div className="stock-option">
                    <i className="bi bi-bookmark"></i>
                </div>
                <div className="stock-img">
                    <div>
                        <img src={window.PATH + "/images/stocks/apple.png"} />
                    </div>
                </div>
                <div className="stock-data">
                    <div className="stock-title">
                        <h2>Apple</h2>
                        <div className="stock-info positive">
                            <span>2.0</span>
                            <span>3.5%</span>
                        </div>
                    </div>
                    <div className="stock-price">$150</div>
                </div>
            </div>
            <div className="focus"></div>
        </div>
    );
}

export default DemoWidget;