const userModel = require('../Models/UserModel')
const validation = require('../validator/validation')
const jwt = require('jsonwebtoken')

//===============createuser========
const createUser = async function (req, res) {
  try {
    let user = req.body

    if (!validation.isValidRequestBody(user)) {
      return res.status(400).send({
        status: false,
        message: "data is required",
      })
    }

    const { title, name, phone, email, password, address } = user

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
    if (!validation.isValidMobile(phone)) {
      return res.status(400).send({
        status: false,
        message: "Phone no is required."
      });
    }

    if (await userModel.findOne({ phone: phone }))
      return res.status(400).send({ status: false, message: 'Phone number already present!' })

    //======email validation============
    if (!validation.isValidEmail(email)) {
      return res.status(400).send({
        status: false,
        message: "email is required."
      });
    }
    if (await userModel.findOne({ email: email }))
      return res.status(400).send({ status: false, message: 'Email Id already present!' })

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


    let createNew = await userModel.create(user)
    res.status(201).send({ status: true, message: 'Success', data: createNew })

  } catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }
}

//---------------------- generation of token ----------------------------------- 
const userLogin = async function (req, res) {
  try {
    let user = req.body

    if (!validation.isValidRequestBody(user)) {
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

      return res.status(400).send({ status: false, msg: "User Details Invalid" })
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
        loginId: loginUser._id.toString(),
        userStatus: "active",
        iat: Date.now()  //issueAt
      },
      "BookManagementProject3",
      { expiresIn: "24h" }
    );
    let jwtToken = { token: token, userId: loginUser._id, iat: Date.now(), exp: new Date(Date.now()) }

    res.setHeader('token-key', token)
    res.status(200).send({ status: true, message: "Success", data: jwtToken });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }
}

module.exports.createUser = createUser
module.exports.userLogin = userLogin






