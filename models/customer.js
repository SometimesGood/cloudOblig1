const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema - defining the structure of the model(Skeleton)
const customerSchema = new Schema(
  {
    Personal_number: { type: Number, required: true },
    Account_number: { type: Number, required: true },
    First_name: { type: String, required: true },
    Last_name: { type: String, required: true },
    Date_of_birth: { type: Date, required: true },
    City: { type: String, required: true },
  },
  { timestamps: true }
);

// Model - Surronds schema and provides us a
//interface which we can use to communicate with database collection
customerSchema.pre("find", function () {
  // console.log(this instanceof mongoose.Query); // true
  this.start = Date.now();
  console.log(`start time ${this.start}`);
});

customerSchema.post("find", function (result) {
  // console.log(this instanceof mongoose.Query); // true
  // prints returned documents
  // console.log("find() returned " + JSON.stringify(result));
  // prints number of milliseconds the query took
  this.end = Date.now();
  console.log(`end time ${this.end}`);

  console.log("find() took " + (Date.now() - this.start) + " millis");
});

const Customer = mongoose.model("Customer", customerSchema);
//Customer.db.readyState;

module.exports = Customer;
