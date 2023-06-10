import React, { useState, useEffect } from 'react'
import { StockWidget } from '../../../elements/widget';
import { fetchHome, fetchCategories } from '../../../api';
import { Link } from "react-router-dom";
import { Carousel } from "../../../js-plugins/carousel";
import Categories from '../../../elements/categories';


let widgets = [];
const Slider = () => {
    const [homeStocks, setHomeStocks] = useState(null);
    const [categories, setCategories] = useState();

    useEffect(() => {
        (async () => {
            let d = await fetchHome();
            if (d.pass)
                setHomeStocks(d.data);

            d = await fetchCategories();
            if (d.pass)
                setCategories(d.data);
        })();
    }, []);

    useEffect(() => {
        if (homeStocks) {
            Carousel.init();
        }

        // clear interval on unmount
        return () => {
            clearInterval(Carousel.interval);
        };
    }, [homeStocks]);


    return (
        <>

            {!homeStocks && <div className="loading-large"></div>}
            {homeStocks && <>
                <div className="carousel" onMouseEnter={Carousel.pause}
                    onMouseLeave={Carousel.play}>
                    <div className="control">
                        <div className='arrow-left' onClick={() => { Carousel.intervalfun(true); }}><i className="bi bi-chevron-left"></i></div>
                        <div className='progress-container'>
                            <div className='carousel-progress'></div>
                        </div>
                        <div className='arrow-right' onClick={() => { Carousel.intervalfun(); }}><i className="bi bi-chevron-right"></i></div>
                    </div>
                    <div style={{ clear: "both" }}></div>
                    <div className="row">
                        {homeStocks.map((stock, i) => {
                            widgets[i] = <StockWidget stock={stock} optionClick={() => { }} useCol={false} />;
                            if (i % 2 !== 0) {
                                return (
                                    <div className='stock-widget col-xl-6' key={"stock" + stock.id}>
                                        {widgets[i - 1]}
                                        {widgets[i]}
                                    </div>
                                )
                            }
                        })}
                    </div>

                    <ul className="carousel-nav">
                        <li className='active' onClick={() => { Carousel.navClick(1); }}></li>
                        <li onClick={() => { Carousel.navClick(2); }}></li>
                        <li onClick={() => { Carousel.navClick(3); }}></li>
                        <li onClick={() => { Carousel.navClick(4); }}></li>
                    </ul>
                </div>
                <div className='button-row'>
                    <Categories categories={categories} />
                    <Link to={window.PATH + "/stocks"} className="expand-button">
                        View All
                    </Link>
                </div>
            </>}
        </>
    )
}

export default Slider;