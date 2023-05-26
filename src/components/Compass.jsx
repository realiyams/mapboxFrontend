import './Compass.css'

function Compass({rotate, onCompassClick}) {
  
  const handleClick = () => {
    onCompassClick()
  }

  return (
    <div 
      id="custom-compass" 
      style={{ transform: `rotate(${-rotate}deg)` }} 
      onClick={handleClick}>
    </div>
  )
}

export default Compass