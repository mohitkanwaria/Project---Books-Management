const express  = require("express")
const router =express.Router()
const userController =require("../Controller/userController")
const bookController = require("../Controller/bookController")
const mid =require('../middlewares/auths')
const reviewController =require('../Controller/reviewController')

router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)

router.post('/books',mid.authentication, bookController.createBook)


//get details book
router.get('/books',mid.authentication, bookController.allBooks)
router.get('/books/:bookId', mid.authentication, bookController.getByBookId)

//update book by id
router.put('/books/:bookId',mid.authentication, mid.authorization, bookController.updateBook)

//delete by bookId
router.delete('/books/:bookId', mid.authentication, mid.authorization, bookController.deleteByBook)

//review controller
router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReview)

router.put('/books/:bookId/review/:reviewId', reviewController.updateReview)

router.post('/books/:bookId/review', reviewController.createReview)

//handling for api route
router.all("/**", (req, res) => {
    try{
        return res.status(400).send({status: false,msg: "The api you request is not available"})
    }catch(err){
        return res.status(500).send(err.message)
    }
})

module.exports = router;