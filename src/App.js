import { useState, useEffect } from "react";
import Header from './components/Header';
import LeftPanel from './components/LeftPanel.js';
import Map from './components/Map.js';
import RightPanel from './components/RightPanel.js';
import Info from './components/Info.js';

const Atlas = require('node-atlas-obscura');
const atlas = new Atlas();

function GetAttractions(location) {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState("false");

  useEffect(() => {
    async function fetchAttractions() {
      try {
        const url = 'http://127.0.0.1:8081/search/'+ location.country + '/' + (location.city? location.city:"_");

        const json = await fetch(url).then(dataWrappedByPromise => dataWrappedByPromise.json()).then(data => {return data;});
      
        console.log(json);
        setResult(
          json.map(attraction => {
            return attraction;
          })
        );
        setLoading("true");
      } catch (error) {
        setLoading("null");
        console.log(error);
      }
    }

    if (location.country !== '') {
      fetchAttractions();
    }
  }, [location]);

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
      setResult(null);
      setLoading("false");
    }
  }, [AttractionID]);
  return [result, loading];
}


const App = () => {
    const [destinations, setDestinations] = useState ([/*{"id":2,"address":"California, United States","coordinates":{"Latitude":37.0743595873,"Longitude":-119.699375153073}},{"id":3,"address":"Texas, United States","coordinates":{"Latitude":31.8039734986,"Longitude":-98.8223185136653}},{"id":4,"address":"New Jersey, United States","coordinates":{"Latitude":40.1502478924,"Longitude":-74.3893168105238}}*/])

  const deleteDestination = async (id) => {
    setDestinations(destinations.filter((destination) => destination.id !== id));
  }

  const addDestination = (id, result, lat, lng) => {
    setDestinations([...destinations, {id: id, address:  result, coordinates: {Latitude: lat, Longitude: lng}}]);
    setID(id+1);
  }

  const updateDestination = (id,result, lat, lng) => {
    setDestinations(
      destinations.map((destination) =>
      destination.id === id ? { ...destination, 
        address: result , 
        coordinates: {Latitude: lat, Longitude: lng}} : destination
      ))
  }

  const reorderDestinations = (destinations) => {
    setDestinations(destinations);
  }
  

    const [ExDestination, setExDestination] = useState ({});
    const [id, setID] = useState(1); 
    const [attractionsResult, attractionsLoading] = GetAttractions(ExDestination);
    const [mode,setMode] = useState(true);
    const [info,setInfo] = useState(false)
    const [overlap,setOverlap] = useState(false);
    const [currentID, setCurrentID] = useState("");
    const [pageResult, pageLoading] = GetAttractionPage(currentID);
    const [visible, setVisibility] = useState(false);
    const [selectedAttraction, setSelecteddAttraction] = useState(null);

    const closeMarker = () => {
      setVisibility(false);
      setSelecteddAttraction(null);
      setCurrentID("");
    }

    const closeRightPanel = () => {
      setVisibility(false);
    }

    const explore = (place) => {
      closeRightPanel();
      setExDestination(place);
    }

    const changeMode = () => {setMode(!mode);}

    const changeOverlap = () => {setOverlap(!overlap);}

  return (
    <div className="box">
      {info? (<Info setInfo={setInfo} info={info}></Info>):null}
      <Header
        mode={mode}
        changeMode={changeMode}
        overlap={overlap}
        changeOverlap={changeOverlap}
        ></Header>
      <div className="row content">
        <LeftPanel
          mode={mode}
          id={id}
          destinations={destinations}
          onAdd={addDestination}
          onDelete={deleteDestination}
          onUpdate={updateDestination}
          onReorder={reorderDestinations}
          explore={explore}
          attractions={attractionsResult} 
          selectedAttraction={selectedAttraction} 
          attractionsLoading={attractionsLoading}
          setSelecteddAttraction={setSelecteddAttraction}
        ></LeftPanel>
        {
          visible ? (
            <RightPanel 
              destinations={destinations}
              onAdd={addDestination}
              id={id}
              attractionInfo={pageResult} 
              loading={pageLoading}
              close={closeRightPanel}>
            </RightPanel>):
            (null)
        }
          <Map
          googleMapURL={
            'https://maps.googleapis.com/maps/api/js?key=' +
            process.env.REACT_APP_GOOGLE_DIRECTIONS_API_KEY +
            '&libraries=geometry,drawing,places'
          }
          mode={mode}
          overlap={overlap}
          exMarkers={attractionsResult}
          navMarkers={destinations}
          onAdd={addDestination}
          id={id}
          selectedAttraction={selectedAttraction} 
          setSelecteddAttraction={setSelecteddAttraction}
          setVisibility={setVisibility}
          setCurrentID = {setCurrentID}
          visible = {visible}
          closeMarker = {closeMarker}
          loadingElement={<div style={{height: `100%`}}/>}
          containerElement={<div style={{height: "80vh"}}/>}
          mapElement={<div style={{height: `100%`}}/>}
          center={{lat: 40.706, lng: -95.034}}
          zoom={4}
        />
      </div>
      <div className="row footer">
        <p onClick={()=> setInfo(!info)}>About Hidden</p>
      </div>
    </div>
  )
};

export default App;