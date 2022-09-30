const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log("Please provide the password as an argument: node mongo.js <password>")
    process.exit(1)
}

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log("Please provide the both name and number to input as an argument: node mongo.js <password> <name> <number>. If the name includes white space. Please use quotation mark to wrap the name.")
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://phanlan:${password}@cluster0.nrw7ci1.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const phonebookEntryScheme = new mongoose.Schema({
    name: String,
    number: String
})

const Entry = mongoose.model("Entry", phonebookEntryScheme)

mongoose
  .connect(url)
  .then((result) => {
    if (process.argv.length === 3) {
      Entry.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(entry => {
          console.log(`${entry.name} ${entry.number}`)
        })
        return mongoose.connection.close()
      })

    } else if (process.argv.length === 5) {
     
      const newEntry = new Entry({
        name: process.argv[3],
        number: process.argv[4]
      })
      newEntry.save().then(() => {
        console.log(`Added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        return mongoose.connection.close()
      })
    }
  })
  .catch((err) => console.log(err))




