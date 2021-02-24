const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser= require('body-parser')
const app = express()

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }))
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://<user_name>:<password>@cluster0.jh6kv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    // To mentioned to document
    const database = client.db('<db_name>');
    const collection = database.collection('<cluster_name>');

    // To insert to data
    const doc = { s_name: "Test 1", s_age: "33",s_city:"Oslo" };
    const result = await collection.insertOne(doc);
    console.log(result)

    // Query for retrive the data from cluster0
    const query = { s_name:"Test 4"};
    const movie = await collection.findOne(query);
    console.log(movie)

    // To update the data
    // create a filter for a movie to update
   const filter = { s_name: "Test 4" };
    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true };
    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: {
        s_name:
          "Updated Test 4",
      },
    };
    // const result = await collection.updateOne(filter, updateDoc, options); // uncomment this to check update
    // To delete the entry
  /*  uncomment this to check delete query
    const delete_query = { s_name: "Updated Test 4" };
    const result_dele = await collection.deleteOne(delete_query);
    if (result_dele.deletedCount === 1) {
      console.dir("Successfully deleted one document.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
    */
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  // routes for check personal number is exists in the bank DB
  .post('/check_customer_exists', (req, res) => { console.log(req.body)})
  // Insert customer details to customer table, return the customer account number
  .post('/insert_customer_details', (req, res) => { console.log(req.body)})
  // update customer details to customer table
  .post('/update_customer_details', (req, res) => { console.log(req.body)})
  // delete customer details to customer table
  .post('/delete_customer_details', (req, res) => { console.log(req.body)})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
