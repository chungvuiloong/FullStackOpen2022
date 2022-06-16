import React from 'react';
import StatisticLine from "../StatisticLine/StatisticLine"



const Statistics = ({ good, neutral, bad, total, average, positive }) => {

    return (
        <section>
            <h2>statistics</h2>
            { (total === 0) ? <div>No feedback given</div>
                :   <>
                        <StatisticLine text="good" value={good}></StatisticLine>
                        <StatisticLine text="neutral" value={neutral} />
                        <StatisticLine text="bad" value={bad} />
                        <StatisticLine text="total" value={total} />
                        <StatisticLine text="average" value={average} />
                        <StatisticLine text="positive%" value={positive} />
                    </>
            }
            
        </section>
    );
};

export default Statistics;