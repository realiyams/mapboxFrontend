import { useState, useEffect, useRef } from 'react'

import './Sidenav.css'

function Sidenav({ viewData, images }) {

  const carouselContainer = useRef(null)
  const sidenavRef = useRef(null)
  const titleRef = useRef(null)

  const [openSidenav, setOpenSidenav] = useState(false)
  const [previous, setPrevious] = useState({
      name: "REKTORAT BUMI SILIWANGI",
      description: "Bangunan villa Isola atau Gedung Isola yang kini beralih fungsi menjadi kantor Rektorat Universitas Pendidikan Bandung ini berdiri di utara kota Bandung tepatnya di jalan Setiabudi No. 244 Bandung. Bangunan karya Prof. Walf Scheomaler ini merupakan salah satu ikon bersejarah dari kota Bandung di mana gedung ini memiliki catatan mendalam terkait perang dunia juga terkait dengan masa perang kemerdekaan di Bandung. Di balik kemegahan Gedung Isola, tanpa sepengetahuan kita ternyata ada sebuah peristiwa besar yang pernah terjadi digedung tersebut. Gedung Isola yang syarat akan makna dan sejarah tidak akan pernah luput dari ingatan kita khususnya bagi masyarakat kota Bandung. (M. Aridha Pratama, Mahasiswa Ilmu Komunikasi FPIPS UPI)",
      coordinate: [
        "107.59434361595129",
        "-6.861160111128612"
      ]
    }
  )
  
  useEffect(() => {
    carouselContainer.current.style.width = (images.length * 100).toString() + "%"
  }, [images])

  useEffect(() => {
    if (openSidenav) {
      setTimeout(() => {
        sidenavRef.current.style.left = "0px"
        carouselContainer.current.style.transform = "translateX(-" + 0 * 100 / images.length + "%)"
      }, 800)

    } else {
      sidenavRef.current.style.left = "-400px"
    }
  }, [openSidenav])
  
  useEffect(() => {

    if (titleRef.current.innerHTML !== "") {
      setOpenSidenav(true)
      setPrevious(viewData)
    } 

    if (openSidenav && previous.name === viewData.name) {
      setOpenSidenav(false)
    }

    if (openSidenav && previous.name !== viewData.name) {
      setOpenSidenav(false)
      sidenavRef.current.style.transition = '0.1s'
      
      setPrevious(viewData)
      setTimeout(() => {
        setOpenSidenav(true)
        sidenavRef.current.style.transition = '0.5s'
      }, 800)
    }
  }, [viewData])

  const carouselItems = images.map((image, index) => {
    return (
      <div className="carousel-item" key={index}>
        <img src={image.url} />
      </div>
    )
  })

  const handleClose = () => {
    sidenavRef.current.style.left = "-400px"
    setOpenSidenav(false)
  }

  let carouselIndex = 0

  const handlePrev = () => {
    carouselIndex--
    if (carouselIndex < 0) {
      carouselIndex = images.length - 1
    }
    carouselContainer.current.style.transform = "translateX(-" + carouselIndex * 100 / images.length + "%)"
  }

  const handleNext = () => {
    carouselIndex++
    if (carouselIndex == images.length) {
      carouselIndex = 0
    }
    carouselContainer.current.style.transform = "translateX(-" + carouselIndex * 100 / images.length + "%)"
  }

  return (
    <div id="mySidenav" className="sidenav" ref={sidenavRef}>  
      <h3 id="title" ref={titleRef}>
      {viewData.name}
      </h3>

      <div className="carousel">
        <button id="close-btn" onClick={handleClose}>&times;</button>
        <div className="carousel-container" ref={carouselContainer}> 
          {carouselItems}
        </div>

        <a className="carousel-control prev" href="#" 
          onClick={handlePrev}
          style={{ display: images.length !== 1 ? 'inline-block': 'none'}}
        >&#10094;</a>
        <a className="carousel-control next" href="#" 
          onClick={handleNext}
          style={{ display: images.length !== 1 ? 'inline-block': 'none'}}
        >&#10095;</a>
      </div>

      <p id="description">
        {viewData.description}
      </p>
    </div>
  )
}

export default Sidenav