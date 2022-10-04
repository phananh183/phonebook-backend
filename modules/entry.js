const mongoose = require('mongoose')

const URL = process.env.MONGODB_URI

console.log('connecting to', URL)

mongoose.connect(URL)
  .then(result => {
    console.log('Connected to mongoDB')
  })
  .catch(err => {
    console.log("Error connecting to mongoDB:", err.message)
  })

const phonebookEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true
  },
  number: {
    type: String,
    minLength: 5,
    required: true
  }
})

phonebookEntrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Entry", phonebookEntrySchema)