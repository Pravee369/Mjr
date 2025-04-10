const jwt = require("jsonwebtoken");
require("dotenv").config()

const verifyToken = (request, response, next) => {
  //token verification logic

  //get bearer token from headers of req
  let bearerToken = request.headers.authorization;

  //if bearer token is not exsited, unauthorised req
  if (bearerToken === undefined) {
    response.send({ message: "Unauthorized request please login first" });
  }

  //if bearer token is existed,get token
  else {
    const token = bearerToken.split(" ")[1];
    
    //verify token using secret key
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      request.user = decoded;
      next();
    } catch (err) {  //if token expired
      console.log(err.message);
      response.send({ message: err.message });
    }
  }

  //if token is valid, allow to access protected route
  //else, ask to login again
};

module.exports = verifyToken;
