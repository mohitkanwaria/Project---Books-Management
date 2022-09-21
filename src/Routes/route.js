const express  = require("express")
const router =express.Router()
const userController =require("../Controller/userController")
const bookController = require("../Controller/bookController")
const bookController =require("../Controller/bookController")
const mid =require('../middlewares/auths')
// const blogController =require("../Controller/blogController")
// const middleware = require('../middleWare/auth')


router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)

router.post('/books',mid.authentication, bookController.createBook)



router.get('/books', bookController.allBooks)
router.get('/books/:bookId', bookController.getByBookId)

module.exports = router;