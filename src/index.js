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
  const { username } = request.headers
  const user = users.find(user=> user.username === username);

  if (!user) {
    return response.status(400).json({ error: "User not found ..." })
  }
  request.user = user;
  return next()
}


// novo usuário (nome, username, id, todos)
app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const usersAlreadyExists = users.some((user) => user.username === username)

  if (usersAlreadyExists) {
    return response.status(400).json({ error: "User Already Exists" })
  }
  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  })
  return response.status(201).json(users)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  

  const todo = {
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);
  return response.status(201).send()

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {title, deadline} = request.body;
  const {id} = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    return response.status(400).json({error: "Todos not found..."})
  }

  todo.title = title;
  todo.deadline = new Date(deadline);
  
  return response.status(201).send(user);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request;

  const {id} = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    return response.status(400).json({error: "Todos not found"})
  }

  todo.done = true;
  
  return response.status(201).send(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find(todo => todo.id === id);
  if(todo === -1){
    return response.status(400).json({error: "Todos not found"})
  }
  users.splice(user, 1);
  return response.status(200).json(users)
});

module.exports = app;