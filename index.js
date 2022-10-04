require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./modules/entry')

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

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

app.get('/api/persons/:id', (req, res, next) => {
  Entry.findById(req.params.id).then(entry => {
    if (entry) {
      res.json(entry)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})
  
app.post('/api/persons', (req, res, next) => {
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

  newEntry.save()
    .then(savedEntry => {
      res.json(savedEntry)
     })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Entry.findByIdAndRemove(req.params.id).then(result => {
    res.status(204).end()
  })
  .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  
  const body = req.body

  const entry = {
    name: body.name,
    number: body.number
  }

  Entry.findByIdAndUpdate(req.params.id, entry, {new: true, runValidators: true, context: 'query'})
    .then(updatedEntry => {
      if (updatedEntry) {
        res.json(updatedEntry)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.get("/info", (req, res) => {
  Entry.countDocuments({}, (err, count) => {
    console.log(count)
    res.send(`The phonebook has info of ${count} people <br> ${new Date().toLocaleString()}`)
  })  
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: "Unknown endpoint"
  })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformated id'})
  } else if (err.name === 'ValidationError') {
    return res.status(400).send( { error: err.message })
  }

  next(err)
}

app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})