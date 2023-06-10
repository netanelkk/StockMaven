import React, { useState, useEffect } from 'react'
import { fetchArticles } from '../../../api';

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

export default Articles;