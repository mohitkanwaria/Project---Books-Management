const reviewModel = require("../Models/ReviewModel")
const bookModel = require("../Models/BooksModel")
const validation = require("../validator/validation")



/*
- Add a review for the book in reviews collection.
- Check if the bookId exists and is not deleted before adding the review. 
Send an error response with appropirate status code like [this](#error-response-structure) if the book does not exist
- Get review details like review, rating, reviewer's name in request body.
- Update the related book document by increasing its review count
- Return the updated book document with reviews data on successful operation. 
The response body should be in the form of JSON object like [this](#successful-response-structure)
*/

const createReview = async function(req, res){
 try{   
    let data = req.body
    let bookId = req.params.bookId
    // let {reviewedBy, rating, review} = data

      //if entries are empty
      if (!validation.isValidRequestBody(data)) {
        return res.status(400).send({
            status: false,
            message: "Invalid request parameter, please provide User Details",
        })
    }
    
    let checkBook = await bookModel.findOne({_id:bookId,isDeleted:false})
   
    //if bookId not present take bookId from bookModel
    if (!data.bookId) data.bookId = checkBook._id;
    if (!data.reviewedBy) data.reviewedBy = "Guest";
    if (!data.reviewedAt) data.reviewedAt = new Date;
    

    //creating review
    const newreview = await reviewModel.create(data);

    //checking for bookId
    if(!bookId)
    return res.status(400).send({status:false, message:'bookId is required'})

    if (!bookId.match(/^[0-9a-fA-F]{24}$/))
    return res.status(400).send({ status: false, msg: "invalid bookId given" })

    if(!checkBook)
    return res.status(400).send({status:false, message:'Book not found'})

    //regex for rating
    if(!/[1-5]/.test(data.rating))
    return res.status(400).send({status:false, message:'rating is required and should be in the range of 1-5'})

    //finding book and updating review
    const updatebookReview = await bookModel.findOneAndUpdate({ _id: data.bookId }, { $inc: { reviews: +1 } }, { new: true })

    //if isDeleted is true
    if (updatebookReview.isDeleted == true)
    res.status(200).send({ status: true, message: "the book is already deleted" });

    //taking all newreview
    updatebookReview.reviewsdata = newreview;

    return res.status(200).send({ status: true, message: "Success", data: updatebookReview })
   
}catch(err){
    return res.status(500).send({status:false, message:err.message})
}
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

/* ### PUT /books/:bookId/review/:reviewId
- Update the review - review, rating, reviewedBy.
- Check if the bookId exists and is not deleted before updating the review. Check if the review exist before updating the review. Send an error response with appropirate status code like [this](#error-response-structure) if the book does not exist
- Get review details like review, rating, reviewer's name in request body.
- Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like [this](#book-details-response)
*/

 const updateReview = async function(req, res){
        try {
            //getting the bookId
            const bookId = req.params.bookId
            //getting the reviewId
            const reviewId = req.params.reviewId

            //checking for valid bookId
            if (!bookId.match(/^[0-9a-fA-F]{24}$/)){
                return res.status(400).send({ 
                    status: false,
                    message: "invalid bookId given" 
                })
            } 
                
            //finding the book as per the bookId
            const book = await bookModel.findOne({_id : bookId})

            //checking for book and isDeleted is false
            if(!book || book.isDeleted === true){
                return res.status(404).send({
                    status : false,
                    message : "This book is already deleted"
                })
            }

            //checking for valid reviewId
            if (!reviewId.match(/^[0-9a-fA-F]{24}$/)){
                return res.status(400).send({ 
                    status: false,
                    message: "invalid reviewId given" 
                })
            } 
            //checking for the reviewData
            const reviewData = await reviewModel.findOne({_id : reviewId})

            //taking update details in request.body
            let updateDetails = req.body

            //checking for empty updateDetails
            if(!validation.isValidRequestBody(updateDetails)){
                return res.status(400).send({
                    status : false,
                    message : "please give update details in request body"
                })
            }
            // destructuring the updateDetails
            const { review, rating, reviewedBy } = updateDetails

            //filtering as per the request body
            let filterUpdate = { isDeleted: false }

            let compare  = ['review', 'rating', 'reviewedBy']

            //checking for only the request body enteries only 
            if (!Object.keys(updateDetails).every(elem => compare.includes(elem))){
                return res.status(400).send({ 
                    status: false,
                    message : "wrong entry given" });
            }

        // getting all the requested enteries in the filterUpdate   
        if(review != null) filterUpdate.review = review
        if(rating != null) filterUpdate.rating = rating;
        if(reviewedBy != null) filterUpdate.reviewedBy = reviewedBy;

        //updating the filterUpdate in the reviewModel and sending finalUpdate in response
        const finalUpdate = await reviewModel.findOneAndUpdate({_id : reviewId}, filterUpdate, {new : true})
        res.status(200).send({
            status : true,
            message : "Successfully updated",
            data : finalUpdate
        })
   
        } catch (error) {
            return res.status(500).send({
                status : false,
                message : error.message
            })
        }
 }

module.exports.updateReview = updateReview
module.exports.deleteReview  = deleteReview
module.exports.createReview  = createReview