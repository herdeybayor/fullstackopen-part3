require("dotenv").config()
const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  )
  process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const DB_STRING = `mongodb+srv://admin-dprince:${password}@cluster0.5uocq.mongodb.net/phonebookDB?retryWrites=true&w=majority`

mongoose.connect(DB_STRING, () => {
  console.log("Connection to database successful!")
})

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else {
  const generateId = () => {
    return Math.floor(Math.random() * 9999) + 1
  }

  const person = new Person({
    id: generateId(),
    name: newName,
    number: newNumber.toString(),
  })

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
