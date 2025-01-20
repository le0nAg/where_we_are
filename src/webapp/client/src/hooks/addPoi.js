


export const addPoi = () => {    

    const poi = async (email, password, username) => {
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
            localStorage.setItem('poi', json.token);

            dispatch({type: 'Poi', payload: json});

            setIsLoading(false);
        }
        
    }
    return { poi, error, isLoading };
}