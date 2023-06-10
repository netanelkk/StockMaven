import React, { useState, useEffect, useRef } from 'react'
import { fetchCategories } from '../../../../api';
import "react-datepicker/dist/react-datepicker.css";


const CategoryFilter = ({ filters, setFilters }) => {
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

export default CategoryFilter;