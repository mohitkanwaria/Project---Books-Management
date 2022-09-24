const express  = require("express")
const router =express.Router()
const userController =require("../Controller/userController")
const bookController = require("../Controller/bookController")
const mid =require('../middlewares/auths')
const reviewController =require('../Controller/reviewController')


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

//--------------------------handling for api routes-------------------------------------
router.all("/**", (req, res) => {
    try{
        return res.status(400).send({status: false,msg: "The api you request is not available"})
    }catch(err){
        return res.status(500).send(err.message)
    }
})

module.exports = router;