const jwt=require('jsonwebtoken')
const bookModel = require('../Models/BooksModel')

// Authentication
const authentication = async (req, res, next) => {
    try {
        const token = req.headers['x-api-key']
        if (!token) {
            return res.status(400).send({ status: false, message: "Token hona chahiye !" })
        }
        try{
            const decodedToken = jwt.verify(token,"BookManagementProject3"); 
       
             req["x-api-key"]=decodedToken;
           }
           catch(err){
            return res.status(401).send({status:false,data: err.message, message:"Token invalid hai"})
        }
        next()
    }catch (err) {
        
         return res.status(500).send({  status: false, message: err.message });
      }
}



const authorization = async function (req, res, next)  {
    try {
        
        const bookId=req.params.bookId
        const decodedToken=req["x-api-key"]
        
        const bookById = await bookModel.findOne({_id:bookId, isDeleted:false})

        if(decodedToken.loginId !== bookById.userId.toString()){

            return res.status(403).send({status:false,message:"you are Unauthorized for this"})
        }
        else
        next();
     
    } catch (error) {
        return res.status(500).send({status:true, message: error.message })
    }
}


module.exports.authentication=authentication

module.exports.authorization=authorization
