import React from 'react'
import { useParams } from "react-router-dom";
import {
    fetchBySymbol, fetchSuggestions
} from '../../../api';
import { Tooltip } from 'react-tooltip';
import Async from "react-async";
import 'react-tooltip/dist/react-tooltip.css'
import Discussion from './discussion';
import StockInfo from './elements/stock_info';
import Feedback from './elements/feedback';
import Suggestions from './elements/suggestions';

function Stock(props) {
    const { isUserSignedIn, setTitle } = props;
    const { symbol } = useParams();

    const getData = async () => {
        const d = await fetchBySymbol(symbol);
        if (!d.pass) throw new Error(d.msg);
        return d.data[0];
    }


    return (
        <>
            <Tooltip id="tooltip" classNameArrow="tooltip-arrow" />
            <Async promiseFn={getData}>
                {({ data, error, isPending }) => {
                    setTitle(symbol);
                    if (isPending) return (<div className='loading-large' style={{ height: "200px" }}></div>);
                    if (error) return (<div className='page'><div id="notice">
                        <i className="bi bi-exclamation-circle"></i>
                        <p>
                            <h3>Couldn't obtain page</h3>
                            <p>Try again later. if you encounter this problem again, check the URL spelled correctly.</p>
                        </p>
                    </div></div>);
                    if (data) {
                        setTitle(data.name);
                        return (
                            <>
                                <StockInfo data={data} />
                                <div className='page' style={{ marginTop: 0 }}>
                                    <div className="stock-block">
                                        <Feedback isUserSignedIn={isUserSignedIn} stockid={data.id} />
                                        <Discussion isUserSignedIn={isUserSignedIn} stockid={data.id} />
                                    </div>
                                    <Suggestions symbol={symbol} />
                                </div>
                            </>
                        )
                    }
                }}
            </Async>
        </>
    );
}

export default Stock;
