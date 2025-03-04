import { useEffect, useState } from 'react';
import './ProgressBar.css';

function ProgressBar({percents, animated}) {
    const [percents_, setPercents_] = useState(0);
    const [animated_, setAnimated_] = useState(false);

    useEffect(() => {
        setPercents_(0);
        setAnimated_(false);
        setTimeout(() => {
            setPercents_(percents/10);
            setAnimated_(animated);
        }, 320); 
    }, [percents, animated])
    
    return (
        <div className="ProgressBar">
            <span className={animated_ ? "progress animated" : "progress"} style={{
                width: `${percents_}%`,
                backgroundImage: `linear-gradient(to right, yellow, rgb(255,${255 - Math.round(percents/3.92)},0))`
                }}></span>
            {percents_ === 100 && <span className="bingo">BINGO</span>}
        </div>
    );
}

export default ProgressBar;
