const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

//gerando BD fake para armazenar dados
const users = [];

//midleware
function checksExistsUserAccount(request, response, next) {
  // Complete aqui
}

// novo usuário (nome, username, id, todos)
app.post('/users', (request, response) => {
  const {name, username} = request.body;

  const usersAlreadyExists = users.some((user) => user.name === name)
  
  if(usersAlreadyExists){
    return response.status(400).json({error: "Use Already Exists"})
  }

  users.push({
    name, 
    username,
    id: uuidv4(),
    todos: []
  })
  return response.status(201).json({message:"Successfully registered user"})
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;