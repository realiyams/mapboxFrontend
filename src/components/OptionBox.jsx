import {useState} from 'react'
import axios from 'axios'
import './OptionBox.css'

import Path from './Path'

function OptionBox({Data, onGetLineString}) {
  const [startLocation, setStartLocation] = useState("")
  const [endLocation, setEndLocation] = useState("")
  const [direction, setDirection] = useState("")

  const list = Data.sort((a, b) => a.name.localeCompare(b.name)).map((item, index) => {
    return (
      <option
        className='building-list' 
        key={index} 
        value={item.name}
      >
        {item.name}
      </option>
    )
  })

  async function fetchDirection() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/buildings/direction?start=${startLocation}&destination=${endLocation}`)
    setDirection(response.data)
    onGetLineString(response.data.routes[0].geometry.coordinates)
  }

  const handlePath = () => {
    if (startLocation === "") {
      return alert('Pilih Start Location')
    }

    if (endLocation === "") {
      return alert('Pilih End Location')
    }

    if (startLocation === endLocation) {
      return alert('Pilih 2 Lokasi yang berbeda')
    }

    fetchDirection()
  }

  return (
    <div>
      <div id="container-box">
        <table>
          <tbody>    
            <tr>
              <td className='monitor-only'>
                <label htmlFor="startLocation">Start Location </label>
              </td>
              <td className='monitor-only'>
                : 
              </td>
              <td>
                <select
                  id="startLocation"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                >
                  <option value="" disabled>-- Select Start Location --</option>
                  {list}
                </select>
              </td>
            </tr>
            <tr>
              <td className='monitor-only'>
                <label htmlFor="endLocation">End Location </label>
              </td>
              <td className='monitor-only'>
                : 
              </td>
              <td>
                <select
                  id="endLocation"
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
                >
                  <option value="" disabled>-- Select End Location --</option>
                  {list}
                </select>
              </td>
            </tr>
            <tr>
              <td colSpan='3' id='td-button'>
                <br />
                <button onClick={handlePath}>Cari Rute</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <Path pathData={direction}/>
    </div>
  )
}

export default OptionBox