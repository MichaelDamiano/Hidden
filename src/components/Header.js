import Switch from "@material-ui/core/Switch";
const Header = ({changeMode,changeOverlap,mode, overlap}) => {

  return (
    <header className='header'>
      <div className="headercolumn">
        <h1>Hidden</h1>
        <img src={mode || overlap?"compass-selected.svg":"compass.svg"}/>
        <Switch
              onChange={changeMode}
        />
        <img src={!mode || overlap?"route-selected.svg":"route.svg"}/>
      </div>
      <div className="headercolumn">
        <img src={overlap?"intersection-selected.svg":"intersection.svg"}/>
        <Switch onChange={changeOverlap}/>
      </div>
    </header>
  )
}

export default Header