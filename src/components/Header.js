import Switch from "@material-ui/core/Switch";
const Header = ({changeMode}) => {

  return (
    <header className='header'>
      <div className="leftheadercolumn">
        <h1>Hidden</h1>
        <img src="\compass.svg"></img>
        <Switch
              onChange={changeMode}
        />
        <img src="\route.svg"></img>
      </div>
      <div></div>
    </header>
  )
}

export default Header