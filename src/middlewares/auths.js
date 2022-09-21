const jwt=require('jsonwebtoken')

// Authentication
const authentication = async (req, res, next) => {
    try {
        let token = req.headers['x-api-key']
        if (!token) {
            return res.status(400).send({ status: false, msg: "Header hona chahiye !" })
        }
        let decode=jwt.verify(token,"BookManagementProject3")
        if(decode){
            next()
        }else{
            return res.status(400).send({status:false,msg:"Invalid token hai"})
        }
    } catch (error) {
        return res.status(500).send({ Error: error.message })
    }
}



const authorization = async function (req, res, next)  {
    try {
        
        let id = req.params.bookId
        
        let book = await BookModel.findById(id)
        if (!book) {
            return res.status(404).send({status:false,msg:"blog is not found given id"})
        }
        let userId=book.userId
        let token = req.headers['x-api-key']
        if (!token) {
            return res.status(400).send({status:false,msg:"Header hona chahiye !"})
        }
        jwt.verify(token,"BookManagementProject3" , function (err, valid) {
            if (err) {
                return res.status(403).send({status:false,msg:"Invalid token hai !"})
            }
            if (valid) {
                
                if (valid.userId == userId) { //here I checked user have permit to access this resources
                    next()
                } else {
                    return res.status(403).send({ status: false, msg: "you have not authorized person!!" })
                }
            }
        });
    } catch (error) {
        return res.status(500).send({ Error: error.message })
    }
}


module.exports.authentication=authentication

module.exports.authorization=authorization
