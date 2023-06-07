import React, { useState, useEffect, useRef } from 'react'

const PieRGB = {};

PieRGB.positiveGradient = (percent) => {
    return 'conic-gradient(rgba(233, 255, 184, 0.44) 0 calc(' + percent + ' * 360deg), #222842 calc(' + percent + ' * 360deg) 360deg)';
}

PieRGB.negativeGradient = (percent) => {
    return 'conic-gradient(rgba(255, 180, 180, 0.63) 0 calc(' + percent + ' * 360deg), #222842 calc(' + percent + ' * 360deg) 360deg)';
}

PieRGB.categoryGradient = (categories, total) => {
    let gradient = 'conic-gradient(', from = 0;
    let i = 0, rgb = rgbGradient(Object.keys(categories).length);
    for (const cat in categories) {
        let to = categories[cat] / total * 360;
        gradient += 'rgb(' + rgb[i][0] + ', ' + rgb[i][1] + ', ' + rgb[i][2] + ') ' + from + 'deg ' + (from + to) + 'deg,';
        from += to;
        i++;
    }
    return gradient.slice(0, -1) + ')';
}

const rgbGradient = (total) => {
    const rgb = [];
    // custom pallete
    rgb.push([24, 78, 119]);
    rgb.push([30, 96, 145]);
    rgb.push([26, 117, 159]);
    rgb.push([22, 138, 173]);
    rgb.push([52, 160, 164]);
    rgb.push([82, 182, 154]);
    rgb.push([118, 200, 147]);
    rgb.push([153, 217, 140]);
    rgb.push([181, 228, 140]);
    rgb.push([217, 237, 146]);
    rgb.push([240, 251, 202]);

    const start = [0, 71, 183];
    for (let i = 11; i < total; i++) {
        rgb.push([
            (i / total * (255 - start[0]) + start[0]),
            (i / total * (start[1]) + start[1]),
            (i / total * (255 - start[2]) + start[2])
        ]);
    }

    return rgb;
}

export default function Pie(props) {
    const { title, text, gradient, legend } = props;
    const [rgb, setRgb] = useState([]);

    useEffect(() => {
        if (legend) {
            setRgb(rgbGradient(Object.keys(legend).length));
        }

    }, [legend]);


    return (
        <div className='dashboard-item'>
            <div className="pie-graph">
                <div className="pie-graph-bar"
                    style={{ backgroundImage: gradient }}></div>
                <span>{title}</span>
                <b>{text}</b>
            </div>
            {rgb.length > 0 &&
                <div className="legend">
                    <table>
                        <tbody>
                            {legend[0]?.icon ?
                                legend.map(stock => (
                                    <tr className="legend-stock" key={"legendstock" + stock.id}>
                                        <td>
                                            <img src={window.PATH + "/images/stocks/" + stock.icon} className='legend-icon' />
                                        </td>
                                        <td>
                                            <div className='legend-flex'>
                                                <span>{stock.name}</span>
                                                <div>{stock.stock_difference}$</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                                : Object.keys(legend).map((cat, i) => (
                                    <tr key={"legendcat" + i}>
                                        <td>
                                            <div className="legend-dot" style={{ background: "rgb(" + rgb[i][0] + "," + rgb[i][1] + "," + rgb[i][2] + ")" }}></div>
                                        </td>
                                        <td>
                                            <div className='legend-flex'>
                                                <span>{cat}</span>
                                                <div>{legend[cat]}</div>
                                            </div>
                                        </td>
                                    </tr>))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}

export { Pie, PieRGB };
