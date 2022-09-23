const review = require("../Models/ReviewModel")
const reviewModel = require("../Models/ReviewModel")

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