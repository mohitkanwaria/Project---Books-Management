const express  = require("express")
const router =express.Router()
const userController =require("../Controller/userController")
const bookController = require("../Controller/bookController")
// const blogController =require("../Controller/blogController")
// const middleware = require('../middleWare/auth')


router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)



router.get('/books', bookController.allBooks)
router.get('/books/:bookId', bookController.getByBookId)

module.exports = router;