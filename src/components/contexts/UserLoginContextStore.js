import React ,{useEffect, useState} from 'react';
import { loginContext } from './loginContext';
import axios from 'axios'


function UserLoginContextStore({children}) 
{
    let [currentUser,setCurrentUser]=useState({});
    let [error,setError]=useState("");
    let [userLoginStatus,setUserLoginStatus]=useState(false)// Initialize data state with an empty array
    // let [err, setErr] = useState(null); // Initialize err state with null

    //userlogin
    const loginUser=(userCredObj)=>{
        axios.post('http://localhost:3000/user-api/login-user',userCredObj)
        .then(response=>{
            if(response.data.message==="success"){
                //update current User state
                setCurrentUser({...response.data.user})
                //update user login status
                console.log({...response.data.user})
                setUserLoginStatus(true)
                console.log(userLoginStatus)
                //update error status
                setError("")
                //store jwt token in local or session storage
                localStorage.setItem("token",response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                console.log(response.data.user);
                console.log(JSON.stringify(response.data.user))

                
            }else{
                setError(response.data.message)
            }
        })
        .catch(err=>{
                console.log(err.message)      
        })
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
        setUserLoginStatus(true);
      }
    }
      }, []);
    
    //userlogout
    const logoutUser=()=>{
        //clear local or session storage
        localStorage.clear();
         //update user login status
         setUserLoginStatus(false)
        // navigate('/login')

    }

  return (
   <loginContext.Provider value={[currentUser,error,userLoginStatus,loginUser,logoutUser]}>
        {children}
   </loginContext.Provider>
  )
}

export default UserLoginContextStore 