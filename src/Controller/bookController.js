const bookModel = require('../Models/BooksModel')
const validation = require('../validator/validation')


const createBook = async function(req, res){
    let data = req.body
     let {title,excerpt,userId,ISBN,category,subcategory,reviews,deletedAt, isDeleted, releasedAt}=data
     if(!validation.isValidRequestBody(data)){
        return res.status(400).send({
            status: false,
            message: "Invalid request parameter, please provide User Details",
        })
    }

    if(!validation.isValid(title))
    return res.status(400).send({status:false,message:'Title is required'})

    if(!validation.isValid(excerpt))
    return res.status(400).send({status:false,message:'Excerpt is required'})

    if(!validation.isValid(userId))
    return res.status(400).send({status:false,message:'UserId is required'})

    if(!validation.isValid(ISBN))
    return res.status(400).send({status:false,message:'ISBN is required'})

    if(!validation.isValid(category))
    return res.status(400).send({status:false,message:'Category is required'})

    if(!validation.isValid(subcategory))
    return res.status(400).send({status:false,message:'Subcategory is required'})

    if(!validation.isValid(releasedAt))
    return res.status(400).send({status:false,message:'ReleaseAt is required'})

    const bookCreate = await bookModel.create(data)
    res.status(201).send({status:true, message:'',data:bookCreate})

}


module.exports.createBook=createBook