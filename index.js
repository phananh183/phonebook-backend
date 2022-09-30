require('dotenv').config()
const express = require('express')
const nodemon = require('nodemon')
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./modules/entry')
const entry = require('./modules/entry')

const URL = `mongodb+srv://phanlan:phanbo96@cluster0.nrw7ci1.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('request-body', (req, res) => {
  return !req.body ? 'Empty' : JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))

app.get("/api/persons", (req, res) => {
  Entry.find({}).then(entries => {
    console.log(req.body)
    res.json(entries)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Entry.findById(req.params.id).then(entry => {
    if (entry) {
      res.json(entry)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => {
    console.log(error)
    res.status(400).send({ error: 'malformated id'})
  })
})
  

app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log(body)
  
  if (!body.name || ! body.number) {
    return res.status(400).json({
      error: "Missing name or number"
    })
  }

  const newEntry = new Entry({
    name: body.name,
    number: body.number
  })

  newEntry.save().then(savedEntry => {
    res.json(savedEntry)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  entries = entries.filter(entry => entry.id !== id)

  res.status(204).end()
})

app.get("/info", (req, res) => {
    const numEntries = entries.length
    res.send(`The phonebook has info of ${numEntries} people <br> ${new Date().toLocaleString()}`)
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: "Unknown endpoint"
  })
}

app.use(unknownEndpoint)

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})