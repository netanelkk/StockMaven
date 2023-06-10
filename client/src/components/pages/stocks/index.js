import React, { useState, useEffect } from 'react'
import { fetchAll } from '../../../api';
import { useParams } from "react-router-dom";
import Async from "react-async";
import { useSearchParams } from 'react-router-dom';
import StocksContent from './content';

function Stocks({setTitle}) {
    const { query } = useParams();
    const [searchParams] = useSearchParams();
    const [catId, setCatId] = useState(0);

    useEffect(() => {
        const cat = searchParams.get('cat');
        if (cat) {
            setCatId(Number(cat));
        }
    }, [searchParams]);

    const getData = async () => {
        const d = await fetchAll((query) ? query : "");
        if (!d.pass) throw new Error(d.msg);
        return d.data;
    }

    useEffect(() => {
        setTitle((query) ? decodeURIComponent(query) : "All Stocks");
    }, []);

    return (
        <div className='page'>
            <Async promiseFn={getData}>
                {({ data, error, isPending }) => {
                    if (isPending) return (
                        <>
                            <div className="stocks-title">
                                <h1>{(!query ? 'All Stocks' : 'Searching..')}</h1>
                            </div>
                            <div className='loading-large' style={{ height: "400px" }}></div>
                        </>
                    );
                    if (error) return (
                        <>
                            <div className="stocks-title">
                                <h1>0 Results</h1>
                            </div>
                            <div id="notice"><i className="bi bi-exclamation-circle"></i> No results found</div>
                        </>
                    );
                    if (data) {
                        return (
                            <StocksContent data={data} query={query} catId={catId} />
                        );
                    }
                }}
            </Async>
        </div>
    );
}

export default Stocks;
