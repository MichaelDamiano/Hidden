import { useState, useEffect } from "react";
import Header from './components/Header'
import LeftPanel from './components/LeftPanel'
import Map from './components/Map'
import RightPanel from './components/RightPanel.js'

const Atlas = require('node-atlas-obscura');
const atlas = new Atlas();

function GetAttractions(location) {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState("false");

  useEffect(() => {
    async function fetchAttractions() {
      try {
        const response = atlas.getPlaces(location);
        
        const json = await response;
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
    const [destinations, setDestinations] = useState ([
      {
        id: 0,
        address:  ''
      }
    ])

    const [ExDestination, setExDestination] = useState ({
      city: '',
      country: ''
    });
    const [attractionsResult, attractionsLoading] = GetAttractions(ExDestination);
    const [viewport, setViewport] = useState({
      latitude: 40.706,
      longitude: -74.034,
      container: 'map',
      width: "100%",
      height: "100%",
      zoom: 11
    });
    const [mode,setMode] = useState(true);
    const [id, setID] = useState(1);
    const [currentID, setCurrentID] = useState("");
    const [pageResult, pageLoading] = GetAttractionPage(currentID);
    const [visible, setVisibility] = useState(false);
    const [selectedAttraction, setSelecteddAttraction] = useState(null);
    const addDestination = () => {
      setDestinations([...destinations, {id: id, address:  ''}]);
      setID(id+1);
      console.log(destinations);
    }

    const deleteDestination = (id) => {
      setDestinations(destinations.filter((destination) => destination.id !== id));
    }

    const updateDestination = (e,id) => {
      setDestinations(
        destinations.map((destination) =>
        destination.id === id ? { ...destination, address: e } : destination
        )
      )
    }
    const closeRightPanel = () => {
      setVisibility(false);
      setSelecteddAttraction(null);
      setCurrentID("");
    }

    const explore = (place) => {
      closeRightPanel();
      setExDestination(place);
    }

    const change = () => {
      setMode(!mode);
      console.log(mode);
    }

  return (
    <div className="box">
      <Header
        mode={mode}
        changeMode={change}
        ></Header>
      <div className="row content">
        <LeftPanel
          mode={mode}
          onAdd={addDestination}
          onDelete={deleteDestination}
          onUpdate={updateDestination}
          destinations={destinations}
          explore={explore}
          attractions={attractionsResult} 
          selectedAttraction={selectedAttraction} 
          attractionsLoading={attractionsLoading}
          setSelecteddAttraction={setSelecteddAttraction}
          setViewport={setViewport}
          viewport={viewport}
        ></LeftPanel>
        {
          visible ? (
            <RightPanel 
              attractionInfo={pageResult} 
              loading={pageLoading}
              close={closeRightPanel}>
            </RightPanel>):
            (null)
        }
          <Map 
            attractions={attractionsResult} 
            selectedAttraction={selectedAttraction} 
            setSelecteddAttraction={setSelecteddAttraction}
            setVisibility={setVisibility}
            setCurrentID = {setCurrentID}
            visible = {visible}
            closeRightPanel = {closeRightPanel}
            viewport = {viewport}
            setViewport = {setViewport}
          ></Map>
      </div>
      <div className="row footer">
        <p>About Hidden</p>
      </div>
    </div>
  )
};

export default App;