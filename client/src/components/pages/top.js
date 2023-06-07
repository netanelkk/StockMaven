import React, { useState, useEffect, forwardRef, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { topmovers, fetchCategories } from '../../api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const byOptions = [
    <>
        <i className="bi bi-percent"></i>
        <span>By Percentage</span>
    </>,
    <>
        <i className="bi bi-plus-slash-minus"></i>
        <span>By Price Difference</span>
    </>
]

const defaultFilter = { date: yesterday(), categories: [], by: 0 };

const CategoryFilter = ({ filters, setFilters, setIsDefaultFilter }) => {
    const [showCatMenu, setShowCatMenu] = useState(false);
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        (async () => {
            const d = await fetchCategories();
            if (!d.pass) return;
            setCategories(d.data);
        })();
    }, []);

    const openCatMenu = () => {
        setShowCatMenu(!showCatMenu);
    }

    const catRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (catRef.current && !catRef.current.contains(event.target)) {
                setShowCatMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [catRef]);

    const catFilterChange = e => {
        let categories = [...filters['categories']];
        const catid = Number(e.target.value);
        if (e.target.checked) {
            categories.push(catid);
            setFilters({ ...filters, categories });
        } else {
            categories = categories.filter((item) => { return item !== catid });
            setFilters({ ...filters, categories });
        }
    }

    return (
        <div className='filter-container' ref={catRef}>
            <div className='pick pick-cat' onClick={openCatMenu}>
                <i className="bi bi-check2-square"></i>
                <span>{filters['categories'].length === 0 ? 'All Categories' : filters['categories'].length + ' Selected'}</span>
            </div>
            <div className={'cat-menu' + (!showCatMenu ? ' hide' : '')}>
                {categories &&
                    categories.map((cat, i) => (
                        <label className='custom-option' htmlFor={"cat" + i} key={"cat" + i}>
                            <input type="checkbox" id={"cat" + i}
                                value={cat.id} onChange={catFilterChange}
                                checked={(filters['categories'].includes(cat.id))} />
                            <span className="checkmark"></span>
                            <i className={"bi " + cat.icon}></i>
                            <span>{cat.name}</span>
                        </label>
                    ))}
                {!categories && <div className='loading'></div>}
            </div>
        </div>
    )
}

const PercentageFilter = ({ filters, setFilters, setIsDefaultFilter }) => {
    const [showByMenu, setShowByMenu] = useState(false);

    const openByMenu = () => {
        setShowByMenu(!showByMenu);
    }

    const byRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (byRef.current && !byRef.current.contains(event.target)) {
                setShowByMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [byRef]);

    const changeBy = (by) => {
        setFilters({ ...filters, by });
        setShowByMenu(false);
    }

    return (
        <div className='filter-container' ref={byRef}>
            <div className='pick pick-by' onClick={openByMenu}>
                {byOptions[filters.by]}
            </div>
            <div className={'cat-menu' + (!showByMenu ? ' hide' : '')}>
                <ul>
                    <li className={filters.by === 0 ? 'active' : ''} onClick={() => { changeBy(0); }}>
                        {byOptions[0]}
                    </li>
                    <li className={filters.by === 1 ? 'active' : ''} onClick={() => { changeBy(1); }}>
                        {byOptions[1]}
                    </li>
                </ul>
            </div>
        </div>
    )

}

const Filters = ({ filters, setFilters, setIsDefaultFilter }) => {
    const [startDate, setStartDate] = useState(new Date(filters.date));

    const DateButton = forwardRef(({ value, onClick }, ref) => (
        <div className='pick pick-date' onClick={onClick} ref={ref}>
            <i className="bi bi-calendar-day"></i>
            <span>{value}</span>
        </div>
    ));

    useEffect(() => {
        setStartDate(new Date(filters.date));
        setIsDefaultFilter(checkIfDefault(filters));
    }, [filters])

    const changeDate = (date) => {
        setFilters({ ...filters, date: date.toISOString() });
        setStartDate(date);
    }

    const disableFutureDates = (date) => {
        return new Date(date.toDateString()) < new Date(new Date().toDateString())
    }

    const checkIfDefault = (newFilters) => {
        return newFilters.date.split('T')[0] === defaultFilter.date.split('T')[0] &&
            newFilters.categories.toString() === defaultFilter.categories.toString() &&
            newFilters.by === defaultFilter.by;
    }

    return (
        <>
            <div className='top-filters'>
                <div className='filter-container'>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => { changeDate(date) }}
                        customInput={<DateButton />}
                        calendarClassName="datepicker"
                        dateFormat="yyyy-MM-dd"
                        filterDate={disableFutureDates}
                    />
                </div>
                <CategoryFilter filters={filters} setFilters={setFilters} setIsDefaultFilter={setIsDefaultFilter} />
                <PercentageFilter filters={filters} setFilters={setFilters} setIsDefaultFilter={setIsDefaultFilter} />
            </div>
        </>
    )
}



function Top({ setTitle }) {
    const [data, setData] = useState(null);
    const [filters, setFilters] = useState(defaultFilter);
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
        setFilters(defaultFilter);
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
