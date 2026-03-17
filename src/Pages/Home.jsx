import React from 'react'
import UpcomingMovies from '../Components/UpCommingMovies'
import MoreContent from '../Components/MoreContent'
import Footer from '../Components/Footer'
function Home() {
  return (
    <div className="flex py-5 flex-col-reverse md:flex-row">
      <UpcomingMovies/>
      <MoreContent/>
      <Footer/>
    </div>
  )
}

export default Home
