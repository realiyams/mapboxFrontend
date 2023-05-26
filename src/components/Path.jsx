import { useEffect, useState, useRef } from 'react'
import './Path.css'

function Path({pathData}) {
  const pathContainer = useRef(null)
  const openRef = useRef(null)
  const [instructions, setInstructions] = useState([])
  const [duration, setDuration] = useState(0)
  const [distance, setDistance] = useState(0)

  function durationToMinutes(duration) {
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)

    if (minutes === 0) {
      return seconds + ' detik'
    }

    if (minutes === 0) {
      return minutes + ' menit'
    }

    return minutes + ' menit, ' + seconds + ' detik'
  }

  function distanceToMeter(distance) {
    return Math.floor(distance) + ' meter'
  }

  useEffect(() => {
    if (pathData !== "") {
      pathContainer.current.style.right = '-600px'

      if (window.innerWidth >= 545) {
        pathContainer.current.style.right = '10px'
      }
      
      openRef.current.style.right = '26px'

      const steps = pathData.routes[0].legs[0].steps
      const maneuver = steps.map((step) => {
        return (step.maneuver.instruction)
      })

      setInstructions(maneuver)
      setDuration(durationToMinutes(pathData.routes[0].duration))
      setDistance(distanceToMeter(pathData.routes[0].distance))
    }
  }, [pathData])
  
  const instructionList = instructions.map((instruction, index) => {
    return (
      <li key={index + 1}>{instruction}</li>
    )
  })

  const handleInstructionClose = () => {
    pathContainer.current.style.right = (-pathContainer.current.offsetWidth - 10).toString() + 'px'
  }

  const handleInstructionOpen = () => {
    pathContainer.current.style.right = '10px'
  }

  return (
    <div>
      <button id="open-instruction-btn" onClick={handleInstructionOpen} ref={openRef}>
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <div id="path-container" ref={pathContainer}>
        <button id="close-instruction-btn" onClick={handleInstructionClose}>&times;</button>

        <div id='estimation'>
          <h2 className="type">Berjalan Kaki</h2>
          <h3 className="duration">{duration}</h3>
          <h4 className="distance">{distance}</h4>
        </div>
        <div id='instructions'>
          <h3 className="steps">Instruksi</h3>
          <ol className="list">
            {instructionList}
          </ol>
        </div>
      </div>
    </div>
  )
}

export default Path