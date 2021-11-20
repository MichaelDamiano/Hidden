

const Info = ({setInfo, info}) => {
      return (
        <div className="overlay" onClick={()=> setInfo(!info)}>
            <div className="about" onClick={(e)=> e.stopPropagation()}>
                <p className="closebutton rightpanelbutton" onClick={()=> setInfo(!info)}>🗙</p>
                <div className='textwindow'>
                    <h1>about</h1>
                    <p>Hidden is a react web application which aims to help people find cool places to visit. 
                        All destinations can be found on <a href="https://atlasobscura.com" target="_blank">atlasobscura.com</a>.</p>
                    <hr></hr>
                    <h1>Features</h1>
                    <img className="icon" src="compass.svg"/><h2>Explore</h2><br></br>
                    <p>Input the name of a state in the United States or a country to search for attractions in that area. You can chose to search for a specific city as well.</p>
                    <div style={{textAlign:"center"}}>
                        <div className="gifholder">
                            <span>Search by state/country and city</span><br></br>
                            <img src="explore1.gif"/>
                        </div>
                        <h3>or</h3>
                        <div className="gifholder">
                            <span>Search by state/county</span><br></br>
                            <img src="explore2.gif"/>
                        </div>
                    </div>
                    <img className="icon" src="route.svg"/><h2>Navigate</h2><br></br>
                    <p>Add two or more addresses to create a route on the map. You can also re-arrange the waypoints on the route by dragging them to a desired spot.</p>
                    <div style={{textAlign:"center"}}>
                        <div className="gifholder">
                            <span>Add waypoint from left panel</span><br></br>
                            <img src="addnav1.gif"/>
                        </div>
                        <h3>or</h3>
                        <div className="gifholder">
                            <span>Add waypoint from an attraction</span><br></br>
                            <img src="addnav2.gif"/>
                        </div>
                    </div>
                    <img className="icon" src="intersection.svg"/><h2>Overlap</h2><br></br>
                    <p>Toggle whether or not to have both modes shown on the map.</p>
                    <hr></hr>
                    <h1>Resources Used</h1>
                    <div className="resources">
                    <a href="https://www.npmjs.com/package/node-atlas-obscura" target="_blank">node-atlas-obscura</a><span> - An API Wrapper for Atlas Obscura.</span><br></br>
                    <a href="https://www.npmjs.com/package/react-mapbox-autocomplete" target="_blank">react-mapbox-autocomplete</a><span> - Uses mapbox api to autocompelete cities and states.</span><br></br>
                    <a href="https://www.npmjs.com/package/@material-ui/core" target="_blank">material-ui</a><span> -A library of foundational and advanced components.</span><br></br>
                    <a href="https://developers.google.com/maps/documentation" target="_blank">Google Maps</a><br></br>
                    <a href="https://www.mongodb.com/" target="_blank">MongoDB</a><br></br>
                    <a href="https://nodejs.org/en/" target="_blank">Node.js</a><br></br>
                    <a href="https://reactjs.org/" target="_blank">React.js</a><br></br>
                    </div>
                    <hr></hr>
                    <h1>My Links</h1>
                    <div style={{textAlign:"center"}}>
                    <a href="https://michaeldamiano.info/" target="_blank">michaeldamiano.info</a><br></br>
                    <a href="https://github.com/MichaelDamiano" target="_blank">Github</a><br></br>
                    <a href="https://www.linkedin.com/in/michael-damiano-041a19182/" target="_blank">Linkedin</a><br></br>
                    </div>
                </div>
            </div>
        </div>
    )
  }
  
  export default Info