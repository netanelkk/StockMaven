import React, { useState, useEffect } from 'react'
import "react-datepicker/dist/react-datepicker.css";
import CategoryFilter from './category';
import PercentageFilter from './percentage';
import DateFilter from './date';

const Filters = ({ filters, setFilters, setIsDefaultFilter }) => {
    const [startDate, setStartDate] = useState(new Date(filters.date));

    useEffect(() => {
        setStartDate(new Date(filters.date));
        setIsDefaultFilter(checkIfDefault(filters));
    }, [filters]);

    const checkIfDefault = (newFilters) => {
        return newFilters.date.split('T')[0] === window.defaultFilter.date.split('T')[0] &&
            newFilters.categories.toString() === window.defaultFilter.categories.toString() &&
            newFilters.by === window.defaultFilter.by;
    }

    return (
        <>
            <div className='top-filters'>
                <DateFilter filters={filters} setFilters={setFilters} startDate={startDate} setStartDate={setStartDate} />
                <CategoryFilter filters={filters} setFilters={setFilters} />
                <PercentageFilter filters={filters} setFilters={setFilters} />
            </div>
        </>
    )
}

export default Filters;