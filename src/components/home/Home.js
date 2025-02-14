import React from 'react'
import VirtualHealthcare from './../virtualHealthCare/VirtualHealthCare';
import OurServices from './../ourServices/OurServices';
import ArticleSection from './../articles/ArticleSection';
import HomeFilter from '../homeFilter/HomeFilter';

// import Description from './../description/Description';
import './Home.css'

const Home = () => {

  console.log("home file")
  return (
    <div className='homepagecontent'>
      <div><VirtualHealthcare/></div>
      
      <OurServices/>
      <HomeFilter/>

      <ArticleSection/>
      {/* <Description/> */}
      {/* <Footer /> */}
    </div>
  )
}

export default Home