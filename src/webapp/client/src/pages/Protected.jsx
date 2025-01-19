import React from 'react';

import { useAuthnContext } from '../hooks/useAuthnContext';
import { useLogout } from '../hooks/useLogout';

const Protected = () => {
    const { user } = useAuthnContext();
    console.log(user);
    const { logout } = useLogout();

    return (
        <div>
        <h1>Welcome, {user?.username || "User"}!</h1>
        <p>You are successfully logged in.</p>
        <button onClick={logout}>Logout</button>
        </div>
    
    );
};

export default Protected;