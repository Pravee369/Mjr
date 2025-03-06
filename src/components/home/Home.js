import React, { useRef } from 'react'
import VirtualHealthcare from './../virtualHealthCare/VirtualHealthCare';
import OurServices from './../ourServices/OurServices';
import ArticleSection from './../articles/ArticleSection';
import './Home.css'


const Home = () => {

  const servicesRef = useRef(null);

  const scrollToServices = () => {
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
 
  console.log("home file")
  return (
    <div className='homepagecontent'>
      <div><VirtualHealthcare onAvailClick={scrollToServices}/></div>
      

      <div id="services" ref={servicesRef}><OurServices/></div>
     

      <ArticleSection/>
      {/* <Description/> */}
      {/* <Footer /> */}
    </div>
  )
}

export default Home