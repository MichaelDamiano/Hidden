import { useState } from 'react'
import MapboxAutocomplete from 'react-mapbox-autocomplete';

const Destination = ({ destination, onUpdate}) => {
  const update = (result) => {
    onUpdate(result,destination.id)
  }

const _suggestionSelect = (result, lat, lng, text) =>  {
    console.log(result, lat, lng, text)
  }

  return (
    <div className='destination'>
        <MapboxAutocomplete publicKey={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                    inputClass='form-control search'
                    onSuggestionSelect={_suggestionSelect}
                    country='us'
                    query={destination.address}
                    resetSearch={false}/>
    </div>
  )
}

export default Destination