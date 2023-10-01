import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors"




const app = express()
const PORT=8000;

app.use(cors());
app.use(express.json());

// Mongodb Connection

const mongo_url = process.env.mongo_url

async function createConnection(){
const client = new MongoClient(mongo_url);
await client.connect();
console.log("Mongodb connected successfully")
return client
}

const client = await createConnection()

app.get('/',  (req, res) => {
  res.send('Hello World')
})

// Get all books data

app.get('/books', async (req, res)=> {
   const books = await client.db("book-app").collection("books").find().toArray();
  res.send(books)
})


// Delete books by ID

app.delete('/books/:id', async (req, res)=> {
    const {id} = req.params;
   const book = await client.db("book-app").collection("books").deleteOne({id:id});
  res.send(book)
})

// Add books

app.post('/books', async (req, res)=> {
    const newBooks = req.body;
   const output = await client.db("book-app").collection("books").insertMany(newBooks);
  res.send(output)
})


// Update books

app.put('/books/:id', async (req, res)=> {
    const {id} = req.params
    const updatedBooks = req.body;
   const input = await client.db("book-app").collection("books").updateOne({id:id},{ $set: updatedBooks});
  res.send(input)
})



app.listen(PORT, ()=>console.log("Server Started",PORT))