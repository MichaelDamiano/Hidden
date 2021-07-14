import ReactMapGL, { Marker, Popup ,NavigationControl} from "react-map-gl";
import React from "react"
import { useState, useEffect } from "react";
import RightPanel from './RightPanel.js'
import * as data from "./icon-mapping.json";
import Destination from './Destination'
import Button from './Button'
import { FaTimes, FaArrowsAltV } from 'react-icons/fa'
import PropTypes from "prop-types";

const navControlStyle= {
    right: 10,
    top: 10
};
  
const Atlas = require('node-atlas-obscura');
const atlas = new Atlas();
const icons = data.icons;

function iconMap(name){
    for (const word of name.split(' ')) {
      if(icons.hasOwnProperty(word)){
        return "/icons/" + icons[word]}
    }
    return "/icons/" + icons.default_marker;
}
  
function GetAttractions(locations) {
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState("false");
  
    useEffect(() => {
      async function fetchAttractions() {
        try {
          locations.map(async location => {
              console.log(location.city);
              console.log(location.country);
          /*const response = atlas.getPlaces(
              {
                city: location.city,
                country: location.country
              }
          );
          const json = await response;
          console.log(json);
          //json.map(attraction => {setResult(result => [...result, attraction]);})
          setResult(
            json.map(attraction => {
              return attraction;
            })
          );*/
  
          })
          setLoading("true");
        } catch (error) {
          setLoading("null");
          console.log(error);
        }
      }
  
      if (locations !== null) {
        fetchAttractions();
      }
    }, [locations]);
  
    return [result, loading];
}
  
function GetAttractionPage(AttractionID) {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState("false");
  
    useEffect(() => {
      async function fetchAttractionPage() {
        try {
          const response = atlas.getPlaceById(AttractionID);
          const json = await response;
          setResult(json);
          setLoading("true");
        } catch (error) {
          setLoading("null");
          console.log(error);
        }
      }
  
      if (AttractionID !== "") {
        fetchAttractionPage(AttractionID);
      }
      else{
        console.log("howdy");
        setResult(null);
        setLoading("false");
      }
    }, [AttractionID]);
    return [result, loading];
}


const MidSection = ({mode}) => {
    //left panel
    const [id, setID] = useState(2);
    const [destinations, setDestinations] = useState ([
        {
            id: 0,
            address: 'jersey city, new jersey',
            city: 'jersey-city',
            country: 'new-jersey'
        },
        {
            id: 1,
            address: 'princeton, new jersey',
            city: 'princeton',
            country: 'new-jersey'
        },
        {
            id: 2,
            address: 'lacey township, new jersey',
            city: 'lacey township',
            country: 'new-jersey'
        }
          
    ])
    const [currentSelection, setCurrentSelection] = useState (destinations.filter((destination) => destination.id === 0));
    const [currentExploredDestination, setCurrentExploredDestination] = useState ({
      city: 'jersey-city',
      country: 'new-jersey'
    })
    const addDestination = () => {
        setDestinations([...destinations, {id: id, address:  ''}]);
        setID(id+1);
        console.log(destinations);
    }
      
    const deleteDestination = (id) => {
        setDestinations(destinations.filter((destination) => destination.id !== id));
    }
      
    const updateNavDestination = (result,id) => {
        setDestinations(destinations.map((destination) => destination.id === id ? { ...destination, address: result } : destination))
    }

    const updateExDestination = (e) => {
      e.preventDefault();
      console.log(e);
      setCurrentExploredDestination({city: city, country: country});
  }
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    //map
    const [attractionsResult, attractionsLoading] = GetAttractions([{
      city: 'princeton',
      country: 'new-jersey'
    }]);
    const [currentID, setCurrentID] = useState("");
    const [pageResult, pageLoading] = GetAttractionPage([currentExploredDestination]);
    const [visible, setVisibility] = useState(false);
    const [selectedAttraction, setSelecteddAttraction] = useState(null);
    const [viewport, setViewport] = useState({
        latitude: 40.706,
        longitude: -74.034,
        container: 'map',
        width: "100%",
        height: "100%",
        zoom: 11
    });

  const closeRightPanel = () => {
    setVisibility(false);
    setSelecteddAttraction(null);
    setCurrentID("");
  }

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
    <div className='midsection'>
    <div className='leftpanel'>
      {
        mode ? (
        <div>
          <p>Explore</p>
          <form onSubmit={updateExDestination}>
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
            <input type='submit' value='Search'/>
          </form>
        </div>
        ) : (
          <div>
            <p>Navigate</p>
            <>
              {destinations.filter((destination) => destination.id !== 0).map((destination) => 
              (
                <div>
                  <FaArrowsAltV style={{cursor: 'grab', display:"inline"}}/>
                  <Destination 
                      key={destination.id} 
                      destination={destination} 
                      onUpdate={updateNavDestination}
                    />
                  <FaTimes
                    style={{ color: 'red', cursor: 'pointer', display:"inline"}}
                    onClick={() => deleteDestination(destination.id)}
                    />
                </div>
              )
              )}
            </>
            <Button 
              onClick={() => addDestination()}
              text='+'
            />
          </div>
          )}
    </div>
    <div className="map">
    {
      visible ? (
        <RightPanel 
          attractionInfo={pageResult} 
          loading={pageLoading}
          close={closeRightPanel}>
        </RightPanel>):
        (null)
    }

    {
      attractionsLoading === "false" ? (<img src="/loading gear.svg" alt="loading"/>) : 
      attractionsLoading === "null" ? (<h1>Error occured</h1>) : 
    (
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/michaeldamiano/ckphllv0i2rjp17rs450vpz31"
        onViewportChange={viewport => {
          setViewport(viewport);
        }}
      >
        <NavigationControl style={navControlStyle} />
        {attractionsResult.map(attraction => (
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
        ))}
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
    )}
  </div>
</div>
  )
}

export default MidSection