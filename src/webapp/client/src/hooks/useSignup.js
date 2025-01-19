import { useState } from 'react';
import { useAuthnContext } from './useAuthnContext';

export const useSignup = () => {    
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthnContext();

    const signup = async (email, password, username) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/authn/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        } else {
            localStorage.setItem('user', json.token);

            dispatch({type: 'LOGIN', payload: json});

            setIsLoading(false);
        }
        
    }
    return { signup, error, isLoading };
}