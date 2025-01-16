import React from 'react';

const Protected = ({ user }) => {
    return (
        <div>
            <h1>User Information</h1>
            <pre>{user ? JSON.stringify(user) : "non dovresti essere qui"}</pre>
        </div>
    );
};

export default Protected;