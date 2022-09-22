const express  = require("express")
const router =express.Router()
const userController =require("../Controller/userController")
const bookController = require("../Controller/bookController")
const mid =require('../middlewares/auths')
// const blogController =require("../Controller/blogController")
// const middleware = require('../middleWare/auth')


router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)

router.post('/books',mid.authentication, bookController.createBook)



router.get('/books',mid.authentication, bookController.allBooks)
router.get('/books/:bookId',mid.authentication, bookController.getByBookId)

//delete by bookId
router.delete('/books/:bookId', bookController.deleteByBook)

//handling for api route
router.all("/**", (req, res) => {
    try{
        return res.status(400).send({status: false,msg: "The api you request is not available"})
    }catch(err){
        return res.status(500).send(err.message)
    }
})

module.exports = router;