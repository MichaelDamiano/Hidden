import { useState,useEffect } from 'react'
import MapboxAutocomplete from 'react-mapbox-autocomplete';


const Destination = ({destination, onUpdate}) => {
  const [query, setQuery] = useState(destination.address)
  useEffect(() => { setQuery(destination.address) }, [destination.address]);
  const update = (result, lat, lng) => {
    onUpdate(destination.id, result, parseFloat(lat), parseFloat(lng));
    setQuery(result);
  }

const _suggestionSelect = (result, lat, lng, text) =>  {
    console.log(result, lat, lng, text)
  }

  return (
      <MapboxAutocomplete publicKey={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        inputClass='form-control search'
        onSuggestionSelect={update}
        country='us'
        query={destination.address}
        resetSearch={false}/>
  )
}

export default Destination