const express  = require("express")
const router =express.Router()
const userController =require("../Controller/userController")
const bookController =require("../Controller/bookController")
// const blogController =require("../Controller/blogController")
// const middleware = require('../middleWare/auth')


router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)

router.post('/books',bookController.createBook)





module.exports = router;