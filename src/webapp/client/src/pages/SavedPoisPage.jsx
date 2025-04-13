import { useAuthnContext } from '../hooks/useAuthnContext';
import { useFetchSavedPois } from '../hooks/useFetchSavedPois';

const SavedPoisPage = () => {
    const { user } = useAuthnContext();
    const { data, loading, error } = useFetchSavedPois(user._id);
    
    if(error){
      return (
        <div> error </div>
      )
    }

    return (
      <div>
        <h1>Your Saved Points of Interest</h1>
        {loading ? (
          <div>Loading your saved locations...</div>
        ) : (
          <div className="saved-pois-grid">
            {data.map(poi => (
              <div className="poi-card" key={poi._id}>
                <h3>{poi.name}</h3>
                <p>{poi.description}</p>
                {/* Other POI details */}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  export default SavedPoisPage;