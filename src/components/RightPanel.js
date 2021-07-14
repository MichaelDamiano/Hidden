import { useState } from "react"

//<img src="/loading gear.svg" alt="loading"/>
const RightPanel = ({attractionInfo, loading, close}) => {
  const [imgIndex, setImgIndex] = useState(0);
      return (
        <div className="rightpanel">
        {
          loading === "false"? (<img class="loading" src="/loading gear.svg" alt="loading"/>) : 
          loading === "true"? (
          <div>
            <button onClick={() => {close()}}>x</button>
            <div className="imagecontainer">
              <img src={attractionInfo.pictures[imgIndex].img}></img>
            </div>
            <div className="imageinfo">
              <button className="leftbutton" onClick={() => {if (imgIndex){setImgIndex(imgIndex-1)}}}>&lt;</button>
              <h1>{imgIndex+1} of {attractionInfo.pictures.length}</h1>
              <button className="rightbutton"onClick={() => {if (imgIndex<attractionInfo.pictures.length-1){setImgIndex(imgIndex+1)}}}>&gt;</button>
            </div>
            

            <>
              {attractionInfo.text.map((text) => (
                <p>{text}</p>
              ))}
            </>
          </div>
          ) : (<h1>Error occured</h1>)}
        </div>
    )
  }
  
  export default RightPanel