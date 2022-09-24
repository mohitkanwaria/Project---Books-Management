const userModel = require('../Models/UserModel')
const validation = require('../validator/validation')
const jwt = require('jsonwebtoken')

//===============createuser========
const createUser = async function (req, res) {
  try {
    const user = req.body

    if (!validation.isValidRequestBody(user)) {
      return res.status(400).send({
        status: false,
        message: "data is required",
      })
    }

    const { title, name, phone, email, password, address } = user

    //checking uniqueness for email and phone in usermodel
    const checkUser =  await userModel.findOne({$or:[{phone:phone, isDeleted: false},{email:email,isDeleted: false}]});
    if(checkUser)
    return res.status(400).send({status:false, message:'email id and phone number already present in database try different one!'})

    //if entries are empty
    if (!validation.isValidTitle(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Title is required" });
    }
    //============name validation============
    if (!validation.regixValidator(name)) {
      return res.status(400).send({
        status: false,
        message:
          "First name is required."
      });
    }
    //===========phone validation=========
    if (!validation.isValidMobile(phone)) 
      return res.status(400).send({
        status: false,
        message: "Phone no is required."
      });
    

    //======email validation============
    if (!validation.isValidEmail(email)) {
      return res.status(400).send({
        status: false,
        message: "email is required."
      });
    }

    //============password validation=======
    if (!validation.isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message: "provide valid password"
      });
    }

    //==============address validation===========
    if (address) {

      if (!validation.isValid(address.street)) {
        return res
          .status(400)
          .send({ status: false, message: "invalid street" })
      }

      if (!validation.isValid(address.city) || !validation.regixValidator(address.city)) {
        return res
          .status(400)
          .send({ status: false, message: "invalid city" });
      }

      if (! /^\+?([1-9]{1})\)?([0-9]{5})$/.test(address.pincode) || !validation.isValid(address.pincode)) {
        return res
          .status(400)
          .send({ status: false, message: "invalid pincode" })
      }

    }


    const createNew = await userModel.create(user)
    res.status(201).send({ status: true, message: 'Success', data: createNew })

  } catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }
}

//---------------------- generation of token ----------------------------------- 
const userLogin = async function (req, res) {
  try {
    const user = req.body

    if (!validation.isValidRequestBody(user)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameter, please provide User Details",
      })
    }

    const email = user.email
    const password = user.password

    if (!validation.isValidEmail(email)) {
      return res.status(400).send({
        status: false,
        message: "email is required."
      });
    }

    if (!validation.isValidPassword(password)) {
      return res.status(400).send({status: false, message: "provide valid password"});
    }
    //validation for userLogin
    const loginUser = await userModel.findOne({ email: email, password: password })

    if (!loginUser) {
    return res.status(400).send({ status: false, msg: "User Details Invalid" })
    }

    let token = jwt.sign(
      {
        loginId: loginUser._id.toString(),
        userStatus: "active",
        iat: Date.now()  //issueAt
      },
      "BookManagementProject3",
      { expiresIn: "24h" }
    );
    let jwtToken = { token: token, userId: loginUser._id, iat: Date.now(), exp: new Date(Date.now()) }

    res.setHeader('token-key', token)
    return res.status(200).send({ status: true, message: "Success", data: jwtToken });
  
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}

module.exports.createUser = createUser
module.exports.userLogin = userLogin






