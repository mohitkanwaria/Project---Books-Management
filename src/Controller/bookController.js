const bookModel = require('../Models/BooksModel')
const UserModel = require('../Models/UserModel')
const validation = require('../validator/validation')
const reviewModel = require('../Models/ReviewModel')
// const bookModel = require("../Models/BooksModel")

const allBooks = async function (req, res) {
    try {
        //if nothing is given in req.params then return all books with isDeleted : false
        let totalBooks = await bookModel.find({
            isDeleted: false
        })

        //returnBook contains only what we have to send in response
        let returnBook = {
            _id: totalBooks._id,
            title: totalBooks.title,
            excerpt: totalBooks.excerpt,
            userId: totalBooks.userId,
            category: totalBooks.category,
            reviews: totalBooks.reviews,
            releasedAt: totalBooks.releasedAt
        }
        // to filter according to query 
        let { userId, category, subcategory } = req.query

        let query = { isDeleted: false }
 
        //validating the userID and if valid then sending to query object
        // if (userId != null) query.userId = userId
        // if (!userId.match(/^[0-9a-fA-F]{24}$/))
        // res.status(400).send({ status: false, msg: "invalid userId given" })

        //checking for valid query
        let comp =['userId', 'category', 'subcategory']
        if (!Object.keys(req.query).every(elem => comp.includes(elem)))
        return res.status(400).send({ status: false, msg: "wrong query given" });


        if(userId){
            if(!userId.match(/^[0-9a-fA-F]{24}$/)){
               return res.status(400).send({ status: false, msg: "invalid userId given" })
            }
        }

        if (category != null) query.category = category;
        if (subcategory != null) query.subcategory = subcategory;


        //check for no books
        if (totalBooks.length === 0) {
            res.status(404).send({
                status: false,
                message: "No book found"
            })
        } 
        // if nothing is given in query
        else if (Object.keys(query).length === 0) {
            return res.status(200).send({
                status: true,
                data: returnBook
            })
        } else {
            //filtering the book as per the query and getting the data in finalFilter
            let finalFilter = await bookModel.find(query)
            return res.status(200).send({ status: true, data: finalFilter })

        }

    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}


const getByBookId = async function (req, res) {

    try {

        //extract the bookId 
        let bookId = req.params.bookId
        //find the book with the bookId in bookModel
        let book = await bookModel.findById(bookId)

        //if book not found or isDeleted is true then we can say book not found
        if (!book || book.isDeleted === true) {
            return res.status(404).send({
                status: false,
                message: "Book not found"
            })
        } else {
            return res.status(200).send({
                status: true,
                data: book
            })
        }
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }

}



const createBook = async function (req, res) {
    try {
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, deletedAt, isDeleted, releasedAt } = data

        //-----------------------------------------------------------------------------------------
        if (!validation.isValidRequestBody(data)) {
            return res.status(400).send({
                status: false,
                message: "Invalid request parameter, please provide User Details",
            })
        }

        //------------------------------------------------------------------------------------------------
        if (!validation.isValid(title))
            return res.status(400).send({ status: false, message: 'Title is required' })
        if (await bookModel.findOne({ title: title }))
            return res.status(400).send({ status: false, message: 'Title is already present Try different' })

        if (!validation.isValid(excerpt))
            return res.status(400).send({ status: false, message: 'Excerpt is required' })

        //-------------------userId validation-------------------------------------------
        if (!validation.isValid(userId))
            return res.status(400).send({ status: false, message: 'UserId is required' })

        if (!userId.match(/^[0-9a-fA-F]{24}$/))
            return res.status(400).send({ status: false, msg: "invalid userId given" })

        if (!await UserModel.findById(userId))
            return res.status(400).send({ status: false, msg: "Invalid User Id !" })

        //---------------------Isbn validation-------------------------------------------
        if (!validation.isValid(ISBN))
            return res.status(400).send({ status: false, message: 'ISBN is required' })

        if (!validation.isValidISBN(ISBN))
            return res.status(400).send({ status: false, message: 'Invalid ISBN !' })

        if (await bookModel.findOne({ ISBN: ISBN }))
            return res.status(400).send({ status: false, message: 'ISBN is already present' })

        //--------------------------------------------------------------------------------
        if (!validation.isValid(category))
            return res.status(400).send({ status: false, message: 'Category is required' })

        //--------------------------------------------------------------------------------
        if (!validation.isValid(subcategory))
            return res.status(400).send({ status: false, message: 'Subcategory is required' })

        //-----------------------------------------------------------------------------------
        if (!validation.isValid(releasedAt))
            return res.status(400).send({ status: false, message: 'ReleaseAt is required' })

        //------------------------BOOK Creation------------------------------------
        const bookCreate = await bookModel.create(data)
        res.status(201).send({ status: true, message: '', data: bookCreate })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

//==============================delete by BookId=============================================

const deleteByBook = async function(req, res){
    
try{
    //bookId    
    let bookId = req.params.bookId

    //if bookId is not present
    if(!bookId)
    return res.status(400).send({status:false, message:'BookId is required'})

    //for invalid bookId 
    if (!bookId.match(/^[0-9a-fA-F]{24}$/))
    return res.status(400).send({ status: false, msg: "invalid bookId given" })

    //for checking bookId and isDeleted false and set isDeleted to true
   if(await bookModel.findOneAndUpdate({_id:bookId, isDeleted:false},{$set:{isDeleted:true, deletedAt: Date.now()}},{ new:true})){

    return res.status(200).send({status:true, message:'successfully Deleted'})
   }
    //if isDeleted is true and no book found
    return res.status(400).send({status:false, message:'book not found or already deleted'})
    
    

}catch(err){
    res.status(500).send({status:false, message:err.message})
}

}


//============updateBook=======

const updateBook = async function (req, res) {

    try {
        //get the bookId
        let bookId = req.params.bookId
        //find the book with bookId
        let book = await bookModel.findById(bookId)

        //check for book not presetn and isDelete true - book not available
        if (!book || book.isDeleted == true) {
            return res.status(404).send({
                status: false,
                message: "Book not found in db or it is deleted"
            })
        }

        //updating 
        //checking for requestBody
        const requestBody = req.body

        //destructure the requestbody
        const { title, excerpt, ISBN, releasedAt } = requestBody


        if (!validation.isValidRequestBody(requestBody)) {
            return res.send(400).send({
                status: false,
                message: "Please provide the Upadate details"
            })
        }


        //checking for update details - title

        if (title) {
            //ckeck for uniqueness of title
            if (await bookModel.findOne({ title: title })) {
                return res.status(400).send({
                    status: false,
                    message: "Title already exists please provide the unique title"
                })
            } else if (validation.isValid(title)) {
                book.title = title.trim()
            } else {
                return res.status(400).send({
                    status: false,
                    message: "Title required"
                })
            }
        }
        //checking for update details - excerpt
        if (excerpt) {

            if (validation.isValid(excerpt)) {
                book.excerpt = excerpt.trim()
            } else {
                return res.status(400).send({
                    status: false,
                    message: "excerpt required"
                })
            }
        }

        //checking for update details - ISBN
        //check for unique ISBN
        if (ISBN) {
            if (await bookModel.findOne({ ISBN: ISBN })) {
                return res.status(400).send({
                    status: false,
                    message: "ISBN already exists please provide the unique ISBN"
                })
            }
            else if (validation.isValidISBN(ISBN)) {
                book.ISBN = ISBN
            } else {
                return res.status(400).send({
                    status: false,
                    message: "ISBN required"
                })
            }
        }

        //checking for upade details - releasedAt
        book.releasedAt = releasedAt

        //updating the book
        let updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, book, { new: true })
        return res
            .status(200)
            .send({ status: true, message: "successfully updated", data: updatedBook })

    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}



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








module.exports.updateBook = updateBook
module.exports.createBook = createBook
module.exports.allBooks = allBooks
module.exports.getByBookId = getByBookId
module.exports.deleteByBook = deleteByBook
