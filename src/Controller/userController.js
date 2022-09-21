const userModel = require('../Models/UserModel')
const validation = require('../validator/validation')
const jwt = require('jsonwebtoken')




//===============createuser========
const createUser = async function(req,res){
try{    
    let user = req.body

    if(!validation.isValidRequestBody(user)){
        return res.status(400).send({
            status: false,
            message: "Invalid request parameter, please provide User Details",
        })
    }
    
    const {title, name, phone, email, password,address} = user

    if (!validation.isValidTitle(title)) {
        return res
          .status(400)
          .send({ status: false, message: "Title is required" });
      }

      if (!validation.isValid(name)) {
        return res.status(400).send({
          status: false,
          message:
            "First name is required."
        });
      }

      if (!validation.isValidMobile(phone)) {
        return res.status(400).send({
          status: false,
          message: "Phone no is required."
        });
      }
      if(await userModel.findOne({phone:phone}))
      return res.status(409).send({status:false,message:'Phone number already present!'})

      if (!validation.isValidEmail(email)) {
        return res.status(400).send({
          status: false,
          message: "email is required."
        });
      }
      if(await userModel.findOne({email:email}))
      return res.status(409).send({status:false,message:'Email Id already present!'})

      if (!validation.isValidPassword(password)) {
        return res.status(400).send({
          status: false,
          message: "provide valid password"
        });
      }

      if (!validation.isValidPincode(address["pincode"])) {
        return res.status(400).send({
          status: false,
          message: "Pincode no is required."
        });
      }

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

    if(!validation.isValidRequestBody(user)){
        return res.status(400).send({
            status: false,
            message: "Invalid request parameter, please provide User Details",
        })
    }

    let email = user.email
    let password = user.password

    if (!validation.isValidEmail(email)) {
        return res.status(400).send({
          status: false,
          message: "email is required."
        });
      }
      

      if (!validation.isValidPassword(password)) {
        return res.status(400).send({
          status: false,
          message: "provide valid password"
        });
      }

    //validation for userLogin
    let loginUser = await userModel.findOne({ email: email, password: password })

    if (!loginUser) {
    
        return res.status(400).send({  status: false, msg: "User Details Invalid" })
    }

    // let currentDate = new Date()
    // const nowTime = Math.floor(currentDate.getTime() / 1000)
    // let token = jwt.sign(
    //     {
    //         loginId:loginUser._id.toString(),
    //         userStatus: "active",
    //         iat:nowTime,  //issueAt
    //         exp:600 + nowTime
    //     },
    //     "BookManagementProject3"
    // );

    let token = jwt.sign(
      {
          loginId:loginUser._id.toString(),
          userStatus: "active",
          iat:Date.now()  //issueAt
      },
      "BookManagementProject3",
      {expiresIn: "120s"}
  );
    
      res.setHeader('token-key',token)
    res.status(200).send({ status: true, message: "Success", data: token });
}catch(err){
    res.status(500).send({status:false, message:err.message})
}
}

module.exports.createUser=createUser
module.exports.userLogin=userLogin






