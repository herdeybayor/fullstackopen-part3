require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((result) => {
      const info = `Phonebook has info for ${result.length} people\n${Date()}`;
      res.status(200).send(info);
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.status(200).json(persons);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((savedPerson) => res.status(200).json(savedPerson))
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.status(200).json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  Person.findByIdAndDelete(id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
  }
  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Server listening on port ${PORT}\nVisit http://localhost:${PORT}`
  );
});
