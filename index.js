const express = require('express')
const nodemon = require('nodemon')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let entries = [
  { 
    id: 1,
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: 3,
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: 4,
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

app.use(cors())
app.use(express.json())

morgan.token('request-body', (req, res) => {
  return !req.body ? 'Empty' : JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))

app.get("/api/persons", (req, res) => {
    console.log(req.body)
    res.json(entries)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const entry = entries.find(entry => entry.id === id)

    if (entry) {
        res.json(entry)
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const id = Math.floor((Math.random() * 100) + 1)

    if (!body.name || ! body.number) {
      return res.status(400).json({
        error: "Missing name or number"
      })
    }

    else if (entries.find(entry => entry.name === body.name)) {
      return res.status(400).json({
        error: "Name has already existed"
      })
    }
    const newEntry = {
      id: id,
      name: body.name,
      number: body.number
    }

    entries = entries.concat(newEntry)
    res.json(newEntry)
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})