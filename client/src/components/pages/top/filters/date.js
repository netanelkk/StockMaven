import React, { forwardRef } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateFilter = ({ filters, setFilters, startDate, setStartDate }) => {

    const changeDate = (date) => {
        setFilters({ ...filters, date: date.toISOString() });
        setStartDate(date);
    }

    const disableFutureDates = (date) => {
        return new Date(date.toDateString()) < new Date(new Date().toDateString())
    }

    const DateButton = forwardRef(({ value, onClick }, ref) => (
        <div className='pick pick-date' onClick={onClick} ref={ref}>
            <i className="bi bi-calendar-day"></i>
            <span>{value}</span>
        </div>
    ));

    return (
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
    )
}

export default DateFilter;