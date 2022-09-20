const express  = require("express")
const router =express.Router()
const authorController =require("../Controller/authorController")
const blogController =require("../Controller/blogController")
const middleware = require('../middleWare/auth')





module.exports = router;