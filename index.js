const express = require("express");

const app = express();
const PORT = 3001;

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Phonebook Backend" });
});

app.get("/info", (req, res) => {
  const info = `Phonebook has info for ${persons.length} people\n${Date()}`;
  res.status(200).send(info);
});

app.get("/api/persons", (req, res) => {
  res.status(200).json(persons);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const person = persons.find((person) => person.name === body.name);
  const generateId = () => {
    return Math.floor(Math.random() * 9999) + 1;
  };
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "all fields are required" });
  }
  //   console.log(body, person);
  if (person) {
    return res.status(409).json({ error: "name must be unique" });
  }
  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  persons = [...persons, newPerson];
  res.status(200).json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.status(200).json(person);
  } else {
    res.status(404).json({ error: "resource not found" });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    persons = persons.filter((person) => person.id !== id);
    res.status(204).end();
  } else {
    res.status(404).json({ error: "resource not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
