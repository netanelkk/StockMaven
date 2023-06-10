import React, { useState, useEffect } from 'react'
import { StockWidget } from '../../../elements/widget';
import { topmovers } from '../../../api';
import "react-datepicker/dist/react-datepicker.css";
import Filters from './filters';

window.defaultFilter = { date: yesterday(), categories: [], by: 0 };

function Top({ setTitle }) {
    const [data, setData] = useState(null);
    const [filters, setFilters] = useState(window.defaultFilter);
    const [isDefaultFilter, setIsDefaultFilter] = useState(true);

    useEffect(() => {
        setData(null);
        (async () => {
            const d = await topmovers(filters);
            if (!d.pass) return;
            setData(d);
        })();
    }, [filters]);

    const clearFilter = () => {
        setFilters(window.defaultFilter);
        setIsDefaultFilter(true);
    }

    useEffect(() => {
        setTitle("Top Movers");
    }, []);

    return (
        <div className='page'>
            <div className="stocks-title">
                <h1>Top Movers</h1>
            </div>

            <div className='filter-row'>
                <Filters filters={filters} setFilters={setFilters} setIsDefaultFilter={setIsDefaultFilter} />
                {!isDefaultFilter &&
                    <button onClick={clearFilter}>
                        <i className="bi bi-x"></i>
                        CLEAR ALL
                    </button>}
            </div>

            <div className="top-row">
                <div className="row-column">
                    <div className="top-title">
                        <i className="bi bi-arrow-up-circle-fill"></i>
                        <div>{filters.by === 0 ? 'Percentage' : 'Price Difference'}</div>
                    </div>
                    {data && data["topResult"].map((stock, i) => (<StockWidget i={i} stock={stock} key={"stock" + stock.id} useCol={false} />))}
                    {!data && <div className='loading-large' style={{ height: "400px" }}></div>}
                </div>
                <div className="row-column">
                    <div className="top-title">
                        <i className="bi bi-arrow-down-circle-fill"></i>
                        <div>{filters.by === 0 ? 'Percentage' : 'Price Difference'}</div>
                    </div>
                    {data && data["bottomResult"].map((stock, i) => (<StockWidget i={i} stock={stock} key={"stock" + stock.id} useCol={false} />))}
                    {!data && <div className='loading-large' style={{ height: "400px" }}></div>}
                </div>
            </div>
        </div>
    );
}

function yesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    return date.toISOString();
}

export default Top;
