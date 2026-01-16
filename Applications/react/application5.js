import React, { useState, useEffect } from "react";

function Clock2() {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timerID = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => {
            clearInterval(timerID);
        };
    }, []); 

    return (
        <div>
            <h2>Horloge</h2>
            <p>Date: {date.toLocaleDateString()}</p>
            <p>Heure: {date.toLocaleTimeString()}</p>
        </div>
    );
}

export default Clock2;
