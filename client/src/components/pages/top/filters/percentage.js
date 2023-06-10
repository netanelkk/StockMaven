import React, { useState, useEffect, useRef } from 'react'
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

const PercentageFilter = ({ filters, setFilters }) => {
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

export default PercentageFilter;