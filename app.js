const { error } = require("console");
const express = require("express");
const { get } = require("http");

const app = express();

app.use(express.json())

class Book {
    constructor(id, name, title) {

        this.id = id
        this.name = name
        this.title = title


    }

    ChangeTranslation(language) {

        this.title = `${this.title} - (${language})`

    }

    static validate(book) {
        if (!(book instanceof Book)) return 'book must be instance of the book class'
        if (!book.id || typeof book.id !== "number") return 'Invalid or missing ID'
        if (!book.name || typeof book.name !== "string") return 'invalid or missing Name'
        if (!book.title || typeof book.title !== "string") return 'invalid or missing title'

        return null;

    }



}

let books = []



app.post("/books", (req, res) => {

    const { id, name, title } = req.body

    if (books.some((book) => book.id === id)) {
        return res.status(400).json({ error: "this book already exist" })
    }


    const newBook = new Book(id, name, title)

    const error = Book.validate(newBook)

    if (error) return res.status(400).json({ error })

    books.push(newBook)
    res.status(201).json({ message: "book has been added", book: newBook })

})


app.get("/books", (req, res) => {
    if (books.length == 0) {
        return res.status(209).json({ message: "the liblary is emipty" })
    }
    res.status(201).json({ message: "this is all book", Book: books })
})



app.get("/books/:id", (req, res) => {
    const bookId = parseInt(req.params.id, 10);
    const book = books.find((b) => b.id === bookId);

    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({ Book: book });
});



app.put("/books/:id", (req, res) => {

    const bookID = parseInt(req.params.id, 10)

    const bookIndex = books.findIndex((book) => book.id === bookID)

    if (bookIndex === -1) {
        return res.status(400).json({ error: "sorry book not found unable to update the book " })
    }

    const { name, title } = req.body

    if (name) books[bookIndex].name = name
    if (title) books[bookIndex].title = title

    res.status(200).json({ message: "book has been updated", book: books[bookIndex] })


})


app.delete("/books/:id", (req, res) => {

    const bookID = parseInt(req.params.id, 10)

    const bookIndex = books.findIndex((book) => book.id === bookID)

    if (bookIndex === -1) {
        return res.status(400).json({ error: "sorry book not found unable to delete the book " })
    }

    books.splice(bookIndex, 1)

    return res.status(200).json({ message: "book has been removed " })

})


app.patch("/books/:id/translation", (req, res) => {
    const bookID = parseInt(req.params.id, 10)

    const { language } = req.body

    if (!language || typeof language !== "string") {
        return res.status(400).json({ error: "sorry invalid or missing language" })
    }

    const book = books.find((b) => b.id === bookID)


    if (!book) return res.status(404).json({ error: "sorry the book number is not found " })


    console.log(book instanceof Book)

    book.ChangeTranslation(language)

    return res.status(201).json({ message: " the book language success update ", book: book })

})




const port = 3001;
app.listen(port, () => {
    console.log(`library system is started on http://localhost${port}`)
})
