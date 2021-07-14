import ReactMapGL, { Marker, Popup ,NavigationControl} from "react-map-gl";
import React from "react"
import { useEffect } from "react";
import * as data from "./icon-mapping.json";
import * as place from "./data2.json";

const icons = data.icons;
const navControlStyle= {
  right: 10,
  top: 10
};

function iconMap(name){
  for (const word of name.split(' ')) {
    if(icons.hasOwnProperty(word)){
      return "/icons/" + icons[word]}
  }
  return "/icons/" + icons.default_marker;
}

const Map = ({attractions, selectedAttraction, setSelecteddAttraction, setVisibility, setCurrentID, visible,closeRightPanel,
  viewport,setViewport}) => {
  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelecteddAttraction(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

    return (
      <div className="map">
          <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/michaeldamiano/ckphllv0i2rjp17rs450vpz31"
            onViewportChange={viewport => {
              setViewport(viewport);
            }}
          >
            <NavigationControl style={navControlStyle} />

            {attractions ? (
            attractions.map(attraction => (
            <Marker
              key={attraction.id}
              latitude={attraction.coordinates.Latitude}
              longitude={attraction.coordinates.Longitude}
            >
              <button
                className="marker-btn"
                onMouseOver={e => {
                e.preventDefault();
                if(!visible){setSelecteddAttraction(attraction);}
              }}
              >
                <img src={iconMap(attraction.title)} alt={iconMap(attraction.title)} />
              </button>
            </Marker>
            ))):(null)}


            {selectedAttraction ? (
              <Popup 
                className="popup"
                latitude={selectedAttraction.coordinates.Latitude}
                longitude={selectedAttraction.coordinates.Longitude}
                closeOnClick={false}
                onClose={closeRightPanel}
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
                </div>
              </Popup>
            ) : null}
          </ReactMapGL>
      </div>
  )
}

export default Map