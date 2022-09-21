
const bookModel = require("../Models/BooksModel")

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

        if (userId != null) query.userId = userId;
        if (category != null) query.category = category;
        if (subcategory != null) query.subcategory = subcategory;


        //check for no books
        if (totalBooks.length === 0) {
            res.status(404).send({
                status: false,
                message: "No book found"
            })
        } else if (Object.keys(query).length === 0) {
            return res.status(200).send({
                status: true,
                data: returnBook
            })
        } else {
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


module.exports.allBooks = allBooks
module.exports.getByBookId = getByBookId









