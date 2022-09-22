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
        
        let bookId=req.params.bookId
        const decodedToken=req["x-api-key"]
        
        let book = await BookModel.findById(id)
        if (!book) {
            return res.status(404).send({status:false,message:"book is not found with this given id"})
        }
        else
        next();
     
    } catch (error) {
        return res.status(500).send({status:true, message: error.message })
    }
}


module.exports.authentication=authentication

module.exports.authorization=authorization
