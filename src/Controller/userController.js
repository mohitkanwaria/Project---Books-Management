const userModel = require('../Models/UserModel')
const validation = require('../validator/validation')
const jwt = require('jsonwebtoken')




//===============createuser========
const createUser = async function(req,res){
try{    
    let user = req.body
    const {title,name,phone,email,password,address} = user

    let createNew = await userModel.create(user)
    res.status(201).send({status:true,message:'Success',data:createNew})
    }catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}

//---------------------- generation of token ----------------------------------- 
const userLogin = async function(req,res){
try{    
    let user = req.body
    let email = user.email
    let password = user.password

    //validation for userLogin
    let loginUser = await userModel.findOne({ email: email, password: password })

    if (!loginUser || !(loginUser.email === email && loginUser.password === password)) {
    
        return res.status(401).send({  status: false, msg: "User Details Invalid" })
    }

    let currentDate = new Date()
    const nowTime = Math.floor(currentDate.getTime() / 1000)
    let token = jwt.sign(
        {
            loginId:loginUser._id.toString(),
            userStatus: "active",
            iat:nowTime,  //issueAt
            exp:600 + nowTime
        },
        "BookManagementProject3"
    )

    res.status(200).send({ status: true, message: "Success", data: token });
}catch(err){
    res.status(500).send({status:false, message:err.message})
}
}

module.exports.createUser=createUser
module.exports.userLogin=userLogin






