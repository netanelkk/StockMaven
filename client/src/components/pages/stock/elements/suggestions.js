import React from 'react'
import {
    fetchSuggestions,
} from '../../../../api';
import { StockWidget } from '../../../../elements/widget';
import Async from "react-async";
import 'react-tooltip/dist/react-tooltip.css'


const Suggestions = ({symbol}) => {
    const getSuggestions = async () => {
        const d = await fetchSuggestions(symbol);
        if (!d.pass) return;
        return d.data;
    }


    return (
        <>
            <h1 id="seealso">See Also</h1>
            <Async promiseFn={getSuggestions}>
                {({ data, error, isPending }) => {
                    if (isPending) return (<div className='loading-sug'></div>);
                    if (error) return (<>error</>);
                    if (data) {
                        return (
                            <>
                                <div className="row">
                                    {data.map(stock => (<StockWidget stock={stock} key={"suggestion" + stock.id} optionClick={() => { }} />))}
                                </div>
                            </>
                        )
                    }
                }}
            </Async>
        </>
    )
}

export default Suggestions;