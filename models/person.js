const mongoose = require("mongoose");

const DB_STRING = process.env.DB_STRING;

mongoose
  .connect(DB_STRING)
  .then((result) => console.log("Connection to database successful!"))
  .catch((err) => console.log("error connecting to Database", err));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 3,
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
