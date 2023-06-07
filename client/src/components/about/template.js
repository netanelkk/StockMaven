import React from 'react'

function Template(props) {
    return (
        <>
            <div className="alt-hero"></div>
            <div className='page about-page'>
                <div className="stocks-title">
                    <h1>{props.title}</h1>
                </div>
                {props.children}
            </div>
        </>
    );
}

export default Template;
