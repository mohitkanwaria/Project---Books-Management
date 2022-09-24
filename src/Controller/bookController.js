const bookModel = require('../Models/BooksModel')
const UserModel = require('../Models/UserModel')
const reviewModel = require('../Models/ReviewModel')
const validation = require('../validator/validation')



//=========================================creating book===================================================
const createBook = async function (req, res) {
    try {
        const data = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data
        
        data.title = title.toUpperCase()
        //-----------------------------------------------------------------------------------------
        if (!validation.isValidRequestBody(data)) {
            return res.status(400).send({status: false, message: "Invalid request parameter, please provide Book Details"})
        }

        const compare =['title', 'excerpt', 'userId', 'ISBN', 'category', 'subcategory','releasedAt']
        if (!Object.keys(data).every(elem => compare.includes(elem)))
        return res.status(400).send({ status: false, msg: "wrong entries given" });

        //for unquie validation in bookModel for ISBN and Title
        const checkUniqueTitleAndISBN = await bookModel.findOne(({$or:[{title : title, isDeleted: false},{ISBN : ISBN, isDeleted: false}]}))

        //checking for unique title 
        if(checkUniqueTitleAndISBN){
            return res.status(400).send({
                status : false,
                message : "Title is already present please provide unique title"
            
            })
        } 
        
        //----------------------------Title Validation-----------------------------------------------------
        if(!/^[a-zA-Z_]+( [a-zA-Z_]+)*$/.test(title)){
            return res.status(400).send({
                status : false,
                message : "Title should be string and unique"

            })
        }

      //------------------------ISBN validation-------------------------------------------
        if (!validation.isValid(ISBN))
            return res.status(400).send({ status: false, message: 'ISBN is required' })
        

        //---------------------------excerpt validation-------------------------------
        if (!validation.isValid(excerpt))
            return res.status(400).send({ status: false, message: 'Excerpt is required' })

        //-------------------userId validation-------------------------------------------

        if (!await UserModel.findById(userId))
            return res.status(400).send({ status: false, msg: "Invalid User Id !" })


        if (!validation.isValidISBN(ISBN))
            return res.status(400).send({ status: false, message: 'Invalid ISBN !' })

        // if (checkUnique.ISBN)
        //     return res.status(400).send({ status: false, message: 'ISBN is already present' })

        //--------------------------------Category Validation------------------------------------------------
        if (!validation.isValid(category))
            return res.status(400).send({ status: false, message: 'Category is required' })

        //--------------------------------SubCategory Validation------------------------------------------------
        if (!validation.isValid(subcategory))
            return res.status(400).send({ status: false, message: 'Subcategory is required' })

        //----------------------------------releasedAt Validation-------------------------------------------
        if (!validation.isValid(releasedAt))
            return res.status(400).send({ status: false, message: 'ReleaseAt is required' })

        //-----------------------------------BOOK Creation------------------------------------
        const bookCreate = await bookModel.create(data)
        return res.status(201).send({ status: true, message: 'Successfully book created', data: bookCreate })
    
    } catch (err) {
       return res.status(500).send({ status: false, message: err.message })
    }
}

//===============================================get all books via filters==================================
const allBooks = async function (req, res) {
    try {
        // //if nothing is given in req.params then return all books with isDeleted : false
        // const totalBooks = await bookModel.find({
        //     isDeleted: false
        // })

        
        // //returnBook contains only what we have to send in response
        // let returnBook = {
        //     _id: totalBooks._id,
        //     title: totalBooks.title,
        //     excerpt: totalBooks.excerpt,
        //     userId: totalBooks.userId,
        //     category: totalBooks.category,
        //     reviews: totalBooks.reviews,
        //     releasedAt: totalBooks.releasedAt
        // }
        // //alphabetically sorting the title
        // let sortedData = totalBooks.sort(function (a, b){
        //     if(a.title < b.title) { return -1 }
        //     if(a.title > b.title) { return 1 }
        //     return 0
        // })
        // // to filter according to query 
        // const { userId, category, subcategory } = req.query

        // const query = { isDeleted: false }

        // //checking for valid query
        // const comp =['userId', 'category', 'subcategory']
        // if (!Object.keys(req.query).every(elem => comp.includes(elem)))
        // return res.status(400).send({ status: false, msg: "wrong query given" });


        // if(userId){
        //     if(!userId.match(/^[0-9a-fA-F]{24}$/)){
        //        return res.status(400).send({ status: false, msg: "invalid userId given" })
        //     }
        // }

        // if (category != null) query.category = category;
        // if (subcategory != null) query.subcategory = subcategory;


        // //check for no books
        // if (totalBooks.length === 0) {
        //     res.status(404).send({
        //         status: false,
        //         message: "No book found"
        //     })
        // } 
        // // if nothing is given in query
        // else if (Object.keys(query).length === 0) {
        //     return res.status(200).send({
        //         status: true,
        //         data: sortedData
        //     })
        // } else {
        //     //filtering the book as per the query and getting the data in finalFilter
        //     const finalFilter = await bookModel.find(query)
        //     return res.status(200).send({ status: true, data: finalFilter })

        // }
        //===========================check this to get all bokks


        let body = req.query

        //apart from this entries gives error
        const compare =['userId', 'category', 'subcategory']
        if (!Object.keys(body).every(elem => compare.includes(elem)))
        return res.status(400).send({ status: false, msg: "wrong entries given" });

        //setting the isDeleted false in body
        body.isDeleted = false

        //finding the book as per the book_id, title, excerpt, userId, category, reviews, releadedAt
        let findbook = await bookModel.find(body).select({
            ISBN : 0,
            subcategory : 0,
            isDeleted : 0,
            deletedAt : 0
        })

        //checking for no book 
        if(!(findbook.length > 0)){
            return res.status(404).send({
                status : false,
                message : "No book found"
            })
        }

        // alphabetically sorting the title
        let sortedData = findbook.sort(function (a, b){
            if(a.title < b.title) { return -1 }
            // if(a.title > b.title) { return 1 }
        })

        return res.status(200).send({
            status : true,
            data : sortedData
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

//=============================get book details by bookId============================================
const getByBookId = async function (req, res) {

    try {

        //extract the bookId 
        const bookId = req.params.bookId
        //find the book with the bookId in bookModel
        const book = await bookModel.findById(bookId).lean()

        //find all reviews with the prticular book_id
        const reviewData = await reviewModel.find({bookId:bookId,isDeleted:false}).select({isDeleted:0,createdAt:0,updatedAt:0,__v:0})

        //if book not found or isDeleted is true then we can say book not found
        if (!book || book.isDeleted === true) {
            return res.status(404).send({
                status: false,
                message: "Book not found"
            })
        } else {
            book.reviewsData = reviewData
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



//==============================delete by BookId=============================================

const deleteByBook = async function(req, res){
    
try{
    //bookId    
    const bookId = req.params.bookId

    //for checking bookId and isDeleted false and set isDeleted to true
   const bookDeleted=await bookModel.findOneAndUpdate({_id:bookId, isDeleted:false},{$set:{isDeleted:true, deletedAt: Date.now()}},{ new:true})

   return res.status(200).send({status:true, message:'successfully Deleted'})
    
}catch(err){
    res.status(500).send({status:false, message:err.message})
}

}


//==================================updateBook==========================================================

const updateBook = async function (req, res) {

    try {
        //get the bookId
        const bookId = req.params.bookId
        //find the book with bookId
        const book = await bookModel.findById(bookId)

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
            return res.status(400).send({
                status: false,
                message: "Please provide the Upadate details"
            })
        }


        // //checking for update details - title
        // if (title) {
        //     //ckeck for uniqueness of title
        //     if (book.title) {
        //         return res.status(400).send({
        //             status: false,
        //             message: "Title already exists please provide the unique title"
        //         })
        //     } else if (validation.isValid(title)) {
        //         book.title = title.trim()
        //     } else {
        //         return res.status(400).send({
        //             status: false,
        //             message: "Title required"
        //         })
        //     }
        // }

        //checking for unique title
        const uniqueTitle = await bookModel.findOne({title : title})
        if(uniqueTitle){
            return res.status(400).send({
                status : false,
                message : "Title is already present"
            })
        } else { book.title = title}
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

        // //checking for update details - ISBN
        // //check for unique ISBN
        // if (ISBN) {
        //     if (book.ISBN) {
        //         return res.status(400).send({
        //             status: false,
        //             message: "ISBN already exists please provide the unique ISBN"
        //         })
        //     }
        //     else if (validation.isValidISBN(ISBN)) {
        //         book.ISBN = ISBN
        //     } else {
        //         return res.status(400).send({
        //             status: false,
        //             message: "ISBN required"
        //         })
        //     }
        // }

        //check for unique ISBN

        const uniqueISBN = await bookModel.findOne({ISBN : ISBN})
        if(uniqueISBN){
            return res.status(400).send({
                status : false,
                message : "isbn already exists"
            })
        } else { book.ISBN = ISBN}
        //checking for upade details - releasedAt
        book.releasedAt = releasedAt

        //updating the book
        const updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, book, { new: true })
        return res
            .status(200)
            .send({ status: true, message: "successfully updated", data: updatedBook })

    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}









module.exports.updateBook = updateBook
module.exports.createBook = createBook
module.exports.allBooks = allBooks
module.exports.getByBookId = getByBookId
module.exports.deleteByBook = deleteByBook
