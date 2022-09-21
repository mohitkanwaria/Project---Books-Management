const bookModel = require('../Models/BooksModel')
const { findById } = require('../Models/UserModel')
const UserModel = require('../Models/UserModel')
const validation = require('../validator/validation')


const createBook = async function(req, res){
try{    let data = req.body
     let {title,excerpt,userId,ISBN,category,subcategory,reviews,deletedAt, isDeleted, releasedAt}=data

//-----------------------------------------------------------------------------------------
     if(!validation.isValidRequestBody(data)){
        return res.status(400).send({
            status: false,
            message: "Invalid request parameter, please provide User Details",
        })
    }

//------------------------------------------------------------------------------------------------
    if(!validation.isValid(title))
    return res.status(400).send({status:false,message:'Title is required'})
    if( await bookModel.findOne({title:title}))
    return res.status(400).send({status:false, message:'Title is already present Try different'})

    if(!validation.isValid(excerpt))
    return res.status(400).send({status:false,message:'Excerpt is required'})

//-------------------userId validation-------------------------------------------
    if(!validation.isValid(userId))
    return res.status(400).send({status:false,message:'UserId is required'})

    if (!userId.match(/^[0-9a-fA-F]{24}$/))
    return res.status(400).send({ status: false, msg: "invalid userId given" })

    if (!await UserModel.findById(userId))
    return res.status(400).send({ status: false, msg: "Invalid User Id !" })

//---------------------Isbn validation-------------------------------------------
    if(!validation.isValid(ISBN))
    return res.status(400).send({status:false,message:'ISBN is required'})

    if(!validation.isValidISBN(ISBN))
    return res.status(400).send({status:false, message:'Invalid ISBN !'})
    
    if( await bookModel.findOne({ISBN:ISBN}))
    return res.status(400).send({status:false, message:'ISBN is already present'})

//--------------------------------------------------------------------------------
    if(!validation.isValid(category))
    return res.status(400).send({status:false,message:'Category is required'})

//--------------------------------------------------------------------------------
    if(!validation.isValid(subcategory))
    return res.status(400).send({status:false,message:'Subcategory is required'})

//-----------------------------------------------------------------------------------
    if(!validation.isValid(releasedAt))
    return res.status(400).send({status:false,message:'ReleaseAt is required'})

//------------------------BOOK Creation------------------------------------
    const bookCreate = await bookModel.create(data)
    res.status(201).send({status:true, message:'',data:bookCreate})
}catch(err){
    res.status(500).send({status:false,message:err.message})
}
}


module.exports.createBook=createBook