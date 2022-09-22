const jwt=require('jsonwebtoken')
const bookModel = require('../Models/BooksModel')

// Authentication
const authentication = async (req, res, next) => {
    try {
        let token = req.headers['x-api-key']
        if (!token) {
            return res.status(400).send({ status: false, message: "Header hona chahiye !" })
        }
        try{
            let decodedToken = jwt.verify(token,"BookManagementProject3"); 
       
             req.decodedToken=decodedToken;
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
        
        let bookId=req.params.bookId
        const decodedToken=req.decodedToken
        console.log(decodedToken);

        let bookById=await bookModel.findById({_id:bookId,isDeleted:false})
        console.log(bookById)

        if(decodedToken.userId !=bookById.userId.toString()){
            
            return res.status(403).send({status:false,message:"you are Unauthorized for this"})
        }
        next();
     
    } catch (error) {
        return res.status(500).send({status:true, message: error.message })
    }
}


module.exports.authentication=authentication

module.exports.authorization=authorization
