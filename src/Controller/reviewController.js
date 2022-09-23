const reviewModel = require("../Models/ReviewModel")




const createReview = async function(req, res){
    let data = req.body
    let {bookId, reviewedBy, reviewedAt, rating, review, isDeleted} = data
    
    //if entries are empty
    if (!validation.isValidRequestBody(data)) {
        return res.status(400).send({
            status: false,
            message: "Invalid request parameter, please provide User Details",
        })
    }

    //checking for bookId
    if(!bookId)
    return res.status(400).send({status:false, message:'bookId is required'})

    if (!bookId.match(/^[0-9a-fA-F]{24}$/))
    return res.status(400).send({ status: false, msg: "invalid bookId given" })

    if(!await bookModel.findOne({_id:bookId, isDeleted:false}))
    return res.status(404).send({status:false, message:'Please enter valid bookId'})


    let newReview = await reviewModel.create(data)
    return res.status(201).send({status:true, message:'successfully review created', data:newReview})
}

let deleteReview = async function (req,res){
    try{
        let reviewId =req.params.reviewId
        let bookId =req.params.bookId

        let deletereview = await reviewModel.findOneAndUpdate({_id:reviewId, bookId:bookId},{$set:{isDeleted:true, $inc: {review: -1}}})

        res.status(200).send({status:true,message: "review deleted successfully"})

    }catch(error) {
        return res.status(500).send({ message: error.message })
    }
}

module.exports.deleteReview  = deleteReview
module.exports.createReview  = createReview