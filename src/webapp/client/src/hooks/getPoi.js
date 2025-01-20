export const getPoi = () => {
    
  
    const getPoi = async () => {
  
      try {
        const response = await fetch("/api/app/getAllPois", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies with the request
        });
  
        const json = await response.json();
        
      } catch (err) {}
    };
  
    return { login, error, isLoading };
  };
    