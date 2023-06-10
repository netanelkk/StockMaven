import React, { useState, useEffect } from 'react'
import {
    feedback, addFeedback
} from '../../../../api';
import 'react-tooltip/dist/react-tooltip.css'
import { Pie, PieRGB } from "../../../../elements/pie";
import { loadingText } from '../discussion';

const Feedback = ({ stockid, isUserSignedIn }) => {
    const [pieData, setPieData] = useState(null);
    const [reloadPie, setReloadPie] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const d = await feedback(stockid);
            if (!d.pass) return;

            let data = {
                positive: 0, total: 0,
                voted: (d.data.length > 0 ? d.data[0].voted : 0)
            }
            for (let i = 0; i < d.data.length; i++) {
                if (d.data[i].feedback)
                    data.positive += d.data[i].count;
                data.total += d.data[i].count;
            }

            data.percent = data.total ? (data.positive / data.total) * 100 : 0;

            setPieData(data);
            setLoading(false);
        })();
    }, [reloadPie]);

    const feedbackClick = async (feedback) => {
        setLoading(true);
        const sendResult = await addFeedback(feedback, stockid);
        if (sendResult.pass) {
            setReloadPie(val => val + 1);
        } else {
            setLoading(false);
            alert("Unexpected error, try again later");
        }
    }

    return (
        <div className="feedback-block">
            <h3>What Do You Think About This Stock?</h3>
            {pieData &&
                <>
                    <Pie title={pieData.percent + "%"} text="Like"
                        gradient={PieRGB.positiveGradient(pieData.percent / 100)} />

                    {!pieData.voted && !loading && isUserSignedIn &&
                        <div className="feedback-buttons">
                            <i className="bi bi-arrow-down-circle" onClick={() => { feedbackClick(0) }}></i>
                            <i className="bi bi-arrow-up-circle" onClick={() => { feedbackClick(1) }}></i>
                        </div>}
                    {loading && loadingText}

                    <span id="voted">{pieData.total} people voted</span>
                </>}
            {!pieData && <div className='loading-large' style={{ height: "200px" }}></div>}
        </div>
    )
}

export default Feedback;