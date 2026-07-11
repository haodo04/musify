import { Route, Routes, useLocation } from "react-router-dom"
import Home from "../pages/Home/Home"
import Album from "../pages/Album/Album"
import { useEffect, useRef } from "react"

const MainLayout = () => {
  const displayRef = useRef();
  const location = useLocation();

  useEffect(()=>{
    displayRef.current.style.background = "#121212";
  })

  return (
    <div ref={displayRef} className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0">
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/album/:id" element={<Album/>}/>
        </Routes>
    </div>
  )
}

export default MainLayout