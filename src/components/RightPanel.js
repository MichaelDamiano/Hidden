import { useState } from "react"

const RightPanel = ({attractionInfo, loading, close,onAdd,id}) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);
      return (
        <div className="rightpanel">
        {
          loading === "false"? (<img class="loading" src="/loading gear.svg" alt="loading"/>) : 
          loading === "true"? (
          <div>
            <p className="rightpanelbutton closebutton" onClick={() => {close()}}>🗙</p>
            <div className="imagecontainer">
              <img src={attractionInfo.pictures[imgIndex].img}></img>
            </div>
            <div className="imageinfo">
              <p className="rightpanelbutton leftbutton" onClick={() => {if (imgIndex){setImgIndex(imgIndex-1)}}}>⮜</p>
              <h1>{imgIndex+1} of {attractionInfo.pictures.length}</h1>
              <p className="rightpanelbutton rightbutton"onClick={() => {if (imgIndex<attractionInfo.pictures.length-1){setImgIndex(imgIndex+1)}}}>⮞</p>
            </div>
            
            <hr></hr>
            <h6>{attractionInfo.title}</h6>
            <>
              {attractionInfo.text.body.map((text) => (
                <p>{text}</p>
              ))}
              {attractionInfo.text.tip.length? (
              <div>
                <hr></hr>
                <h6>Know Before You Go</h6>
              </div>
              ):null}
              {attractionInfo.text.tip.map((text) => (
                <p>{text}</p>
              ))}
              <hr></hr>
              <h6>Address</h6>
              <p>{attractionInfo.text.address[0].substring(0,attractionInfo.text.address[0].length-12).replace(/<br>/g, ' ')}</p>
              <div className="addwaypoint rpaddwaypoint" style={{justifyContent:"left",display:"inline-block"}}onClick={()=> {
                onAdd(id, attractionInfo.title + ', '+ attractionInfo.location, attractionInfo.coordinates.lat, attractionInfo.coordinates.lng);
                setAdded(true);
                }}>
                <img src="./add-pin-white.svg" style={{width:"25px",height:"25px"}}alt="add pin"/>
                <span>{added? ("Waypoint Added!"):("Add as Waypoint to Navigation Route")}</span>
              </div>
              
              <hr></hr>
              <h6>Link</h6>
              <a href={attractionInfo.url} target="_blank">{attractionInfo.url}</a>
            </>
          </div>
          ) : (<h1>Error occured</h1>)}
        </div>
    )
  }
  
  export default RightPanel