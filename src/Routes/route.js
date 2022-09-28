const express  = require("express")
const router =express.Router()
const userController =require("../Controller/userController")
const bookController = require("../Controller/bookController")
const mid =require('../middlewares/auths')
const reviewController =require('../Controller/reviewController')
const aws = require('aws-sdk')


//-------------------------step 1------------------------------------
//for registration of user
router.post('/register', userController.createUser)

//for user login and generating token
router.post('/login', userController.userLogin)

//creating book for authenticate user
router.post('/books',mid.authentication, mid.authorization, bookController.createBook)

//----------------------------step 2----------------------------------------
//get details book by using query for authenticate user
router.get('/books',mid.authentication, bookController.allBooks)

//get details book by using bookId for authenticate user
router.get('/books/:bookId', mid.authentication, bookController.getByBookId)

//update book by id for authorise user
router.put('/books/:bookId',mid.authentication, mid.authorization, bookController.updateBook)

//delete by bookId for authorise user
router.delete('/books/:bookId', mid.authentication, mid.authorization, bookController.deleteByBook)

//----------------------------step 3--------------------------------------------------
//giving review for particular book
router.post('/books/:bookId/review', reviewController.createReview)

//updating particular review for particular book
router.put('/books/:bookId/review/:reviewId', reviewController.updateReview)

//updating particular review for particular book
router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReview)

//Aws route
router.post("/write-file-aws", bookController.awsFileUploader)

// aws.config.update({
//     accessKeyId: "AKIAY3L35MCRZNIRGT6N",
//     secretAccessKey: "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",
//     region: "ap-south-1"
// })

// let uploadFile= async ( file) =>{
//    return new Promise( function(resolve, reject) {
//     // this function will upload file to aws and return the link
//     let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws

//     var uploadParams= {
//         ACL: "public-read",
//         Bucket: "classroom-training-bucket",  //HERE
//         Key: "abc/" + file.originalname, //HERE 
//         Body: file.buffer
//     }


//     s3.upload( uploadParams, function (err, data ){
//         if(err) {
//             return reject({"error": err})
//         }
//         console.log(data)
//         console.log("file uploaded succesfully")
//         return resolve(data.Location)
//     })

//     // let data= await s3.upload( uploadParams)
//     // if( data) return data.Location
//     // else return "there is an error"

//    })
// }

// router.post("/write-file-aws", async function(req, res){

//     try{
//         let files= req.files
//         if(files && files.length>0){
//             //upload to s3 and get the uploaded link
//             // res.send the link back to frontend/postman
//             let uploadedFileURL= await uploadFile( files[0] )
//             res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
//         }
//         else{
//             res.status(400).send({ msg: "No file found" })
//         }
        
//     }
//     catch(err){
//         res.status(500).send({msg: err})
//     }
    
// })

//--------------------------handling for api routes-------------------------------------
router.all("/**", (req, res) => {
    try{
        return res.status(400).send({status: false,msg: "The api you request is not available"})
    }catch(err){
        return res.status(500).send(err.message)
    }
})

module.exports = router;