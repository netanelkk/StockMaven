import React, { useState, useEffect, useRef } from 'react'
import { StockWidget } from '../stock/widget';
import { fetchHome, fetchArticles, fetchCategories, top3 } from '../../api';
import { Link } from "react-router-dom";
import { Carousel } from "../../plugins/carousel";
import Categories from '../stock/categories';

const Article = ({ data }) => {
    return (
        <div className="col-lg-6">
            <div className="article">
                <div className='article-image'
                    style={{ backgroundImage: "url(" + data.image + ")" }}></div>
                <div className="article-content">
                    <h2>{data.title}</h2>
                    <span>Published at {data.date}</span>
                    <div><a href={data.link} target="_blank"><button>Continue Reading<i className="bi bi-box-arrow-up-right"></i></button></a></div>
                </div>
            </div>
        </div>
    );
}

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

const TopBlock = ({ stock }) => {
    return (
        <div className="topblock col-lg-4">
            <Link to={window.PATH + "/stock/" + stock.symbol} draggable="false">
                <div className="main-top">
                    <div className="successrate">
                        {stock.prediction_accuracy}%
                        <div>Success Rate</div>
                    </div>
                    <div className="topblock-img">
                        <img src={window.PATH + "/images/stocks/" + stock.icon} />
                    </div>
                    <h2>{stock.name}</h2>
                </div>
            </Link>
        </div>
    )
}

const Top3 = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            const d = await top3();
            if (!d.pass) {
                throw new Error(d.msg);
            }
            setData(d.data);
        })();
    }, []);

    return (
        <div className="hero-container">
            <div className="hero">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fff" fillOpacity="0.08" d="M0,160L20,176C40,192,80,224,120,218.7C160,213,200,171,240,165.3C280,160,320,192,360,218.7C400,245,440,267,480,261.3C520,256,560,224,600,192C640,160,680,128,720,133.3C760,139,800,181,840,213.3C880,245,920,267,960,245.3C1000,224,1040,160,1080,128C1120,96,1160,96,1200,128C1240,160,1280,224,1320,229.3C1360,235,1400,181,1420,154.7L1440,128L1440,320L1420,320C1400,320,1360,320,1320,320C1280,320,1240,320,1200,320C1160,320,1120,320,1080,320C1040,320,1000,320,960,320C920,320,880,320,840,320C800,320,760,320,720,320C680,320,640,320,600,320C560,320,520,320,480,320C440,320,400,320,360,320C320,320,280,320,240,320C200,320,160,320,120,320C80,320,40,320,20,320L0,320Z"></path></svg>
            </div>

            <div className='top3'>
                <h1>
                    Discover The <b>Best.</b>
                    <p>Our Algorithm's Best Prediction Rates</p>
                </h1>
                <div className="top3-row">
                    {!data && <div className='loading-large' style={{ height: "400px" }}></div>}
                    {data &&
                        <div className='row'>
                            {data.map(stock => (
                                <TopBlock key={"topblock" + stock.id} stock={stock} />
                            ))}
                        </div>}
                </div>
            </div>
        </div>
    )
}

const Articles = () => {
    const [articles, setArticles] = useState(null);

    useEffect(() => {
        (async () => {
            const d = await fetchArticles();
            if (!d.pass) throw new Error(d.msg);
            setArticles(d.data);
        })();
    }, []);

    return (
        <>
            <h1 id="newstitle">Recent News</h1>
            {!articles && <div className='loading'></div>}
            <div className="row articles">
                {articles &&
                    articles.map(article => (<Article data={article} key={"article" + article.id} />))}
            </div>
        </>
    )
}

function Homepage({ setTitle }) {

    useEffect(() => {
        setTitle("Stock Market Experts");
    }, []);

    return (
        <>
            <Top3 />
            <div className='page'>
                <Slider />
                <Articles />
            </div>
        </>
    );
}

export default Homepage;
