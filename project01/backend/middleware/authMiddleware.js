const jwt=require('jsonwebtoken');
require('dotenv').config();

const authenticateJWT=(req,res,next)=>{
    const token=req.headers['authorization'];
    if(!token) return res.stats(401).json("token not found");
    
    jwt.verify(token,process.env.JWT_SECRET,(err,response)=>{
        if(err) throw err;
        // console.log(response);
        // return res.status(201).json("hello");
        next();
    })
    
}

const authorizeAdmin=(req,res,next)=>{
    const api_key=req.headers['admin_api_key'];
    // console.log(req.headers);
    if(api_key!=process.env.ADMIN_API_KEY){
        return res.status(401).json("you don't have correct api key");
    }
    // return res.status(200).json("you have api key");
    next();
}

module.exports={authenticateJWT, authorizeAdmin};