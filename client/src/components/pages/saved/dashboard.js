import React from 'react'
import { Pie, PieRGB } from "../../../elements/pie";



const Dashboard = ({ total, data }) => {
    return (
        <div className="saved-dashboard">
            <Pie 
            title={window.positiveCount + "/" + total} 
            text="Positive" 
            gradient={PieRGB.positiveGradient(window.positiveCount / total)}
            legend={data.filter(row => row.stock_difference >= 0).sort((a, b) => { return b.stock_difference - a.stock_difference })} 
            />

            <Pie 
            title={(total - window.positiveCount) + "/" + total} 
            text="Negative" 
            gradient={PieRGB.negativeGradient((total - window.positiveCount) / total)}
            legend={data.filter(row => row.stock_difference < 0).sort((a, b) => { return a.stock_difference - b.stock_difference })} 
            />
            
            <Pie 
            title={Object.keys(window.categories).length} 
            text="Categories"
            gradient={PieRGB.categoryGradient(window.categories, total)} 
            legend={window.categories} />
        </div>
    )
}

export default Dashboard;

