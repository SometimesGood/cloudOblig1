const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Customer = require("./models/customer");

const morgan = require("morgan");
const { performance } = require("perf_hooks");

const app = express();

// database user login info {name: heavynedbor, password: leoknut}

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }));

//const MongoClient = require("mongodb").MongoClient;
const uriDB =
  "mongodb+srv://heavynedbor:leoknut@assignment1.sw5vp.mongodb.net/ABC-bank?retryWrites=true&w=majority";

mongoose
  .connect(uriDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((result) => {
    console.log("connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

mongoose.set("debug", function (collection, method, query, doc) {
  console.log(
    `collection: ${collection}, method: ${method}, query ${JSON.stringify(
      query
    )}, doc, ${JSON.stringify(doc)}`
  );
});

// routes

app
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs");

// render main page
app
  .get("/", (req, res) =>
    res.render("pages/index", {
      customerNumber: "Customer Number",
      personalNumberTaken: "",
      updatedUser: "",
      deletedUser: "",
    })
  )

  /* READ -  route for checking if personal number exists in the abc bank DB and retrieving account number
   corresponding to that personal number */
  .get("/customerExist", (req, res) => {
    let personalNumberToFind = req.query.personalNumber;

    Customer.find({ Personal_number: personalNumberToFind })
      .then((result) => {
        // TIMESTAMP 4 HERE
        //  let timestampT4 = Date.now();
        //console.log("timestamp4", timestampT4);

        // if found any personalnumber in db, show the account number that has the personalnumber entered
        if (result.length > 0) {
          res.render("pages/index", {
            customerNumber: "Customer Number: " + result[0].Account_number,
            personalNumberTaken: "",
            updatedUser: "",
            deletedUser: "",
          });
        }
        // if not found anything the send ejs message that nothing was found
        else {
          res.render("pages/index", {
            customerNumber: "Personal number does not exist",
            personalNumberTaken: "",
            updatedUser: "",
            deletedUser: "",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  })

  /* CREATE - Checking if personal number exist in db and either adding user if it does 
  not exist or return the account number if it does exist*/

  .post("/insertCustomer", (req, res) => {
    let personalNumberToFind = req.body.personalNumberInsert;

    Customer.find({ Personal_number: personalNumberToFind }, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("/");
      }

      // if customer does exist then show them the account number
      else {
        if (result.length > 0) {
          console.log("user does exist will not add anything");
          res.render("pages/index", {
            // add a warning with ejs saying that user exists already
            customerNumber: "",
            personalNumberTaken:
              "User with that personal number already exist here is the customer Number: " +
              result[0].Account_number,
            updatedUser: "",
            deletedUser: "",
          });
        }
        // if customer does not exist then create one with entered input
        else {
          console.log("user does not exist");
          //customer object
          let customer = new Customer({
            Personal_number: req.body.personalNumberInsert,
            //account number is a random number
            Account_number: Math.floor(Math.random() * 1000),
            First_name: req.body.fnameInsert,
            Last_name: req.body.lname,
            Date_of_birth: req.body.dob,
            City: req.body.city,
          });
          //saving customer object to db and redirecting to home
          customer
            .save()
            .then((promiseResult) => {
              res.render("pages/index", {
                customerNumber: "",
                personalNumberTaken: "Created user with those input details",
                updatedUser: "",
                deletedUser: "",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });
  })

  // UPDATE - update customer details to customer table
  .post("/updateCustomer", (req, res) => {
    // new values
    let customerToUpdate = req.body.personalNumberUpdate;
    let customerNewName = req.body.fnameUpdate;
    let customerNewLastname = req.body.lnameUpdate;
    let customerNewCity = req.body.cityUpdate;

    Customer.findOneAndUpdate(
      // filter
      { Personal_number: customerToUpdate },
      // values to update with new values
      {
        First_name: customerNewName,
        Last_name: customerNewLastname,
        City: customerNewCity,
      },
      null,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          //if  Personal number does not exist send ejs warning message
          if (!result) {
            console.log("DID NOT found personal number in update");
            res.render("pages/index", {
              customerNumber: "",
              personalNumberTaken: "",
              updatedUser:
                "Did not find any with personal number: " + customerToUpdate,
              deletedUser: "",
            });
          }
          // If personal number matches then update the one it matches and send confirmation ejs message
          else {
            console.log("found personal number in update");
            res.render("pages/index", {
              customerNumber: "",
              personalNumberTaken: "",
              updatedUser:
                "Updated user with personal number: " + result.Personal_number,
              deletedUser: "",
            });
          }
        }
      }
    );
  })
  // DELETE - delete customer details to customer table
  .post("/deleteCustomer", (req, res) => {
    let customerToDelete = req.body.personalNumberDelete;

    Customer.findOneAndDelete(
      { Personal_number: customerToDelete },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          // if Personal number does not exist send ejs warning message
          if (!result) {
            console.log(result);
            res.render("pages/index", {
              customerNumber: "",
              personalNumberTaken: "",
              updatedUser: "",
              deletedUser: `No user with personal number: ${customerToDelete} does exist`,
            });
          }
          // If personal number matches then delete the one it matches and send ejs confirmation message
          else {
            console.log(result);
            res.render("pages/index", {
              customerNumber: "",
              personalNumberTaken: "",
              updatedUser: "",
              deletedUser: `Deleted user with personal number: ${customerToDelete}`,
            });
          }
        }
      }
    );
  });

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
