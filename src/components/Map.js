/* global google */
import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
  DirectionsRenderer,
  InfoWindow
} from "react-google-maps";
import MapStyle from "../mapStyle.json";
import { useState, useEffect } from "react";
import * as data from "./icon-mapping.json";

const icons = data.icons;
function iconMap(name){
  for (const word of name.split(' ').slice().reverse()) {
    if(icons.hasOwnProperty(word)){
      return "/icons/" + icons[word]}
  }
  return "/icons/" + icons.default_marker;
}

const MapDirectionsRenderer = ({ places, travelMode }) => {
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(places.length>1){
      const waypoints = places.map(p =>({
          location: {lat: p.coordinates.Latitude, lng:p.coordinates.Longitude},
          stopover: true
      }))
      const origin = waypoints.shift().location;
      const destination = waypoints.pop().location;

      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: travelMode,
          waypoints: waypoints
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
              setDirections(result);
          } else {
              setError(result);
          }
        }
      );
    }
  }, [])

  return (
    error ? (<h1>{this.state.error}</h1>):
    (directions && <DirectionsRenderer directions={directions}/>) 
  )
}


const Map = withScriptjs(
  withGoogleMap(({center,zoom,mode,overlap,exMarkers, onAdd,id ,navMarkers, selectedAttraction, setSelecteddAttraction,setVisibility, setCurrentID, visible,closeMarker,
    })  => {
      const [added, setAdded] = useState(false);
    return(
    <GoogleMap className="map"
      defaultCenter={center}
      defaultZoom={zoom}
      options={{
        styles: MapStyle,
    }}
    >
      {mode || overlap?(
        exMarkers.map((marker, index) => {
        const position = { lat: marker.coordinates.Latitude, lng: marker.coordinates.Longitude };
        return <Marker 
                key={index} 
                position={position} 
                optimized="true"
                icon={{
                  scaledSize: new google.maps.Size(50, 50),
                  url: iconMap(marker.title)
                }}
                onClick={() => {
                  if(!visible){setSelecteddAttraction(marker);
                    setAdded(false);}
                }}
                />;
      })) :(null)}
      {!mode || overlap? (
        <MapDirectionsRenderer
          key={navMarkers.map(marker => {return marker.address})}
          places={navMarkers}
          travelMode={google.maps.TravelMode.DRIVING}
        />
      ):(null)}

{selectedAttraction ? (
              <InfoWindow 
                className="popup"
                closeOnClick={true}
                onCloseClick={closeMarker}
                position={{ lat: selectedAttraction.coordinates.Latitude, lng: selectedAttraction.coordinates.Longitude}}
              >
                <div>
                  <img src={selectedAttraction.img} alt="attraction image"/>
                  <h2>{selectedAttraction.title}</h2>
                  <hr></hr>
                  <p>{selectedAttraction.description}</p>
                  <hr></hr>
                  <h2 
                    className="extraInfo" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setVisibility(true);
                      setCurrentID(selectedAttraction.id);
                      }}>
                    Learn More
                  </h2>
                  <hr></hr>
                  <div className="extraInfo addwaypoint"
                    onClick={()=> {
                      onAdd(id, selectedAttraction.title + ', '+ selectedAttraction.location, selectedAttraction.coordinates.Latitude, selectedAttraction.coordinates.Longitude);
                      setAdded(true);
                      }}>
                    <img style={{width:"2em", display:"inline"}} src="./add-pin.svg" alt="add pin"/> 
                    <h2 style={{paddingInline:"0px", display:"inline"}}>{added? ("Waypoint Added!"):("Add Waypoint")}</h2>
                  </div>
                </div>
              </InfoWindow>
            ) : null}
    </GoogleMap>
  )})
);

export default Map;
