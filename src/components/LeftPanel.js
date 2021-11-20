import Destination from './Destination'
import Button from './Button'
import { useState, useEffect } from 'react'
import { FaTimes, FaArrowsAltV } from 'react-icons/fa'
import * as data from "./icon-mapping.json";

const icons = data.icons;
function iconMap(name){
  for (const word of name.split(' ').slice().reverse()) {
    if(icons.hasOwnProperty(word)){
      return "/icons/" + icons[word]}
  }
  return "/icons/" + icons.default_marker;
}
const LeftPanel = ({ id,mode,explore,attractions,selectedAttraction,setSelecteddAttraction,attractionsLoading, destinations, onAdd, onUpdate, onDelete, onReorder}) => {
  const [cooldown, setCooldown] = useState(0);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [search, setSearch] = useState('');
  const onSubmit = (e) => {
    e.preventDefault();
    explore({ city, country});
    setSearch("");
    setCooldown(3);
  }
  const updateAttraction = (attraction) => {
    setSelecteddAttraction(attraction);
  }
  useEffect(() => {
    if (cooldown > 0) {
      setTimeout(() => setCooldown(cooldown - 1), 1000);
    } 
  });

    let draggingEle;
    let placeholder;
    let startX, startY, endX, endY,mouseX,mouseY;
    let isDraggingStarted,extraDrag = false;

    const swap = function (nodeA, nodeB) {
        const parentA = nodeA.parentNode;
        const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

        nodeB.parentNode.insertBefore(nodeA, nodeB);

        parentA.insertBefore(nodeB, siblingA);
    };

    const isAbove = function (nodeA, nodeB) {
        const rectA = nodeA.getBoundingClientRect();
        const rectB = nodeB.getBoundingClientRect();
        return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
    };

    const dragStartHandler = function (e) {
      const emptyImg = new Image();
      e.dataTransfer.setDragImage(emptyImg, 0, 0);
      draggingEle = e.target;
      const rect = draggingEle.getBoundingClientRect();
      mouseX = e.pageX - rect.left;
      mouseY = e.pageY - rect.top;
    }

    const mouseMoveHandler = function (e) {
        if(!e.pageY){return}//something wierd where the position of the dragging element goes to 0,0 on drag end
        const draggingRect = draggingEle.getBoundingClientRect();
        console.log(e.pageY);
        if(!extraDrag){// bug where first event coordinates are dragged up a bunch of pixels. getting rid of them here.
          extraDrag = true;
          return;
        }
        if (!isDraggingStarted) {
            isDraggingStarted = true;
            placeholder = document.createElement('div');
            placeholder.classList.add('placeholder');
            draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);
            placeholder.style.height = `${draggingRect.height}px`;
            draggingEle.style.width = `${draggingEle.parentNode.offsetWidth*.9}px`;
            draggingEle.style.zIndex = "9999";
        }
        draggingEle.style.left = `${e.pageX - mouseX}px`;
        draggingEle.style.top = `${e.pageY - mouseY}px`;
        draggingEle.style.position = 'absolute';

        const prevEle = draggingEle.previousElementSibling;
        const nextEle = placeholder.nextElementSibling;

        if (prevEle && isAbove(draggingEle, prevEle)) {
            swap(placeholder, draggingEle);
            swap(placeholder, prevEle);
            return;
        }
        if (nextEle && isAbove(nextEle, draggingEle)) {
            swap(nextEle, placeholder);
            swap(nextEle, draggingEle);
            return;
        }
        startX = draggingRect.left;
        startY = draggingRect.top;
        const placeRect = placeholder.getBoundingClientRect();
        endX = placeRect.left;
        endY = placeRect.top;
    };

    const mouseUpHandler = function () {
        draggingEle.style.top = `${startY}px`;
        draggingEle.style.left = `${startX}px`;
        draggingEle.animate([
          { transform: 'translate('+parseInt(endX-startX)+'px, '+parseInt(endY-startY)+'px)' }
        ], {
          duration: 500,
          iterations: 1
        });
        
        Promise.all(
          draggingEle.getAnimations().map(
            function(animation) {
              return animation.finished
            }
          )
        ).then(
          function() {
            placeholder && placeholder.parentNode.removeChild(placeholder);
            draggingEle.style.zIndex = "500";
            draggingEle.style.width = "90%";
            draggingEle.style.removeProperty('top');
            draggingEle.style.removeProperty('left');
            draggingEle.style.removeProperty('position');
            mouseX = null;
            mouseY = null;
            draggingEle = null;
            isDraggingStarted = false;
            const index = [];
            [].slice.call(document.getElementById('waypoints').querySelectorAll('.waypoint')).map(i => index.push(i.id));
            const newOrder = index.map(i => destinations[i]);
            onReorder(newOrder);
          }
        );
    };

  
  return (
    <div className='leftpanel'>
      {
        mode ? (
        ////////////////////////////////////////////Explore Mode///////////////////////////////////////////////////
        <div className="explore">
          <p>Explore</p>
          <form onSubmit={onSubmit}>
            <input
              type='text'
              placeholder='city (optional)'
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
            {cooldown?(
              <Button 
              color='grey'
              type='button'
              text={cooldown + " second cooldown"}
            />
            ):
            <Button 
              type='submit'
              text='Search'
            />
            }
          </form>
            {attractions.length && attractionsLoading === "true" ?([
              <>
              <p>{attractions.length} attractions found:</p>
              <div style={{display:"flex"}}>
                <input 
                  type="text" 
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  placeholder='search list'
                  style={{flex:8.5}}/>
                <img className="navimg" src="delete.svg" alt="delete.svg"style={{ cursor: 'pointer',flex:1.5}} draggable="false"
                  onClick={() => setSearch("")}/>
              </div>
              <div className="attractions">
                {attractions
                .filter((attraction) => attraction.title.toLowerCase().includes(search.toLowerCase()))//filter out attractions that aren't being searched for
                .sort(function(a, b) {if (a.title < b.title) {return -1;}if (a.title > b.title) {return 1;}return 0;})//alphabetically sort by title
                .map(attraction => (
                  <div className="attraction"
                    onClick={() => updateAttraction(attraction)}>
                    <img className="attractionimg" src={iconMap(attraction.title)} alt={iconMap(attraction.title)} />
                    <p className={selectedAttraction ? [selectedAttraction.id === attraction.id? "selected" : ""] :""}>{attraction.title}</p>
                  </div>
                ))}
              </div>
              </>
              ]
              
              ):
              attractionsLoading === "null" ? (
              <p>No attractions found...</p>
              ):(null)}
          </div>
        ) : (
          ////////////////////////////////////////////Navigate Mode///////////////////////////////////////////////////
          <>
          <p>Navigate</p>
          <div id="waypoints">
              {destinations.map((destination,i) => 
              (
                <div className='waypoint'draggable="true" 
                  onDragStart={dragStartHandler}
                  onDrag={mouseMoveHandler}
                  onDragEnd={mouseUpHandler} id={i} key={destination.id} >
                  <img className="navimg" src="reorder.svg" alt="reorder.svg"style={{cursor: 'move', flex:1}}draggable="false"/>
                  <Destination 
                      key={destination.id} 
                      destination={destination} 
                      onUpdate={onUpdate}
                      query={destination.address}
                    />
                    <img className="navimg" src="delete-left-shift.svg" alt="delete-left-shift.svg"style={{ cursor: 'pointer',flex:1}} draggable="false"
                    onClick={() => onDelete(destination.id)}/>
                </div>
              )
              )}
            </div>
              <div className='waypoint'style={{cursor: 'default'}}>
              <img className="navimg" src="reorder.svg" alt="reorder.svg"style={{visibility:"hidden", flex:1}}draggable="false"/>
              <Destination 
                key={id}
                destination={{
                  id: id,
                  address:  null,
                  coordinates : {
                    Latitude: null,
                    Longitude: null
                  }
                }}
                onUpdate={onAdd}
                query={""}
              />
              <img className="navimg" src="delete-left-shift.svg" alt="delete-left-shift.svg"style={{ visibility:"hidden", cursor: 'pointer',flex:1}} draggable="false"/>
              </div>
          </>
          )}
    </div>
  )
}

export default LeftPanel