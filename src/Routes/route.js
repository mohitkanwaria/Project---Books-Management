const express  = require("express")
const router =express.Router()
const userController =require("../Controller/userController")
// const blogController =require("../Controller/blogController")
// const middleware = require('../middleWare/auth')


router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)





module.exports = router;