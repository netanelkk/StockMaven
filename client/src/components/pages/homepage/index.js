import React, { useEffect } from 'react'
import Hero from './hero';
import Slider from './slider';
import Articles from './articles';


function Homepage({ setTitle }) {
    useEffect(() => {
        setTitle("Stock Market Experts");
    }, []);

    return (
        <>
            <Hero />
            <div className='page'>
                <Slider />
                <Articles />
            </div>
        </>
    );
}

export default Homepage;
