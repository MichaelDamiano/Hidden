import Destination from './Destination'
import Button from './Button'
import { useState } from 'react'
import { FaTimes, FaArrowsAltV } from 'react-icons/fa'
import * as data from "./icon-mapping.json";

const icons = data.icons;
function iconMap(name){
  for (const word of name.split(' ')) {
    if(icons.hasOwnProperty(word)){
      return "/icons/" + icons[word]}
  }
  return "/icons/" + icons.default_marker;
}
const LeftPanel = ({ destinations, onDelete, onAdd, onUpdate,mode,explore,attractions,selectedAttraction,setSelecteddAttraction
,setViewport,viewport,attractionsLoading}) => {
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const onSubmit = (e) => {
    e.preventDefault()
    explore({ city, country})
  }
  const updateAttraction = (latitude,longitude,attraction) => {
    setViewport({...viewport, latitude: latitude, longitude: longitude,zoom:14});
    setSelecteddAttraction(attraction);
  }
  return (
    <div className='leftpanel'>
      {
        mode ? (
        <div>
          <p>Explore</p>
          <form onSubmit={onSubmit}>
            <input
              type='text'
              placeholder='city'
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
              <input
              type='text'
              placeholder='country/state'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <br></br>
            <Button 
              type='submit'
              text='Search'
            />
          </form>
          <div className="attraction-holder">
            {attractions.length && attractionsLoading === "true" ?([
              <p>{attractions.length} attractions found:</p>,
              <div className="attractions">
                {attractions.map(attraction => (
                  <div className="attraction"
                    onClick={() => updateAttraction(attraction.coordinates.Latitude, attraction.coordinates.Longitude, attraction)}>
                    <div className="imgholder">
                      <img src={iconMap(attraction.title)} alt={iconMap(attraction.title)} />
                    </div>
                    <p>{attraction.title}{selectedAttraction?<p className="selected">{selectedAttraction.id === attraction.id? "(selected)":null}</p>:null}</p>
                  </div>
                ))}
              </div>
              ]
              
              ):
              attractionsLoading === "null" ? (
              <p>No attractions found...</p>
              ):(null)}
          </div>
        </div>
        ) : (
          <div>
            <p>Navigate</p>
            <Button
              onClick={() => onAdd()}
              text='+'
            />
            <>
              {destinations.map((destination) => 
              (
                <div>
                  <FaArrowsAltV style={{cursor: 'grab', display:"inline"}}/>
                  <Destination 
                      key={destination.id} 
                      destination={destination} 
                      onUpdate={onUpdate}
                    />
                  <FaTimes
                    style={{ color: 'red', cursor: 'pointer', display:"inline"}}
                    onClick={() => onDelete(destination.id)}
                    />
                </div>
              )
              )}
            </>
          </div>
          )}
    </div>
  )
}

export default LeftPanel