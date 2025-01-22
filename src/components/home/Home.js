import React from 'react'
import VirtualHealthcare from './../virtualHealthCare/VirtualHealthCare';
import OurServices from './../ourServices/OurServices';
import ArticleSection from './../articles/ArticleSection';
// import Description from './../description/Description';
import './Home.css'

const Home = () => {

  console.log("home file")
  return (
    <div className='homepagecontent'>
      <div><VirtualHealthcare/></div>
      <OurServices/>
      <ArticleSection/>
      {/* <Description/> */}
      {/* <Footer /> */}
    </div>
  )
}

export default Home