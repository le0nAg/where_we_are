import React from 'react';

const StatisticalPage = () => {
    const poiData = [
        { name: 'Central Park', visitors: 1500, area: '843 acres' },
        { name: 'Statue of Liberty', visitors: 3000, area: '14 acres' },
        { name: 'Times Square', visitors: 5000, area: '0.1 acres' },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Statistical Page</h1>
            <table border="1" style={{ width: '100%', textAlign: 'left', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>POI Name</th>
                        <th>Visitors</th>
                        <th>Area</th>
                    </tr>
                </thead>
                <tbody>
                    {poiData.map((poi, index) => (
                        <tr key={index}>
                            <td>{poi.name}</td>
                            <td>{poi.visitors}</td>
                            <td>{poi.area}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StatisticalPage;