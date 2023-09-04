const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const path=require("path")
const app = express();
const port = 9000;

app.use(bodyParser.json());

let todos = [{
  id: "260460",
  title: "Biba",
  description: "Biba was a renowed 2023 book"
}];



app.get("/page1", (req, res) => {
  res.json(todos);
});

app.post("/page1", (req, res) => {
  const newTodo = {
    todoid: Math.floor(Math.random() * 1000000),
    title: req.body.title,
    description: req.body.description,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
  writeTodosToFile(todos);
});

function searchelement(todos, id) {
  console.log("search element function called");
  console.log(id);
  console.log(todos);
  for (var i = 1; i <= todos.length; i++) {
    console.log(i);
    console.log(todos[i].todoid);
    if (todos[i].todoid === id) {
      console.log("true got passed for " + todos[i].todoid);
      return i;
    }
  }
  return -1;
}

app.get("/page2", (req, res) => {
  console.log("get request of page 2");
  var index = searchelement(todos, parseInt(req.body.todoid));
  console.log(index);
  if (index == -1) {
    res.status(404).send();
  } else {
    res.status(200).json(todos[index]);
  }
});

app.put("/page1", (req, res) => {
  console.log("Executing PUT");
  const todoIndex = searchelement(todos, parseInt(req.body.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    todos[todoIndex].title = req.body.title;
    todos[todoIndex].description = req.body.description;
    res.json(todos[todoIndex]);
  }
  writeTodosToFile(todos);
});

function removeAtIndex(arr, index) {
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArray.push(arr[i]);
  }
  return newArray;
}

app.delete("/page1", (req, res) => {
  bodyParser.json();
  const todoIndex = searchelement(todos, parseInt(req.body.id));
  console.log("Delete excecuting");
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    todos = removeAtIndex(todos, todoIndex);
    res.status(200).send();
  }
  writeTodosToFile(todos);
});

app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,"index.html"));
})
// for all other routes, return 404


function writeTodosToFile(todos) {
  const data = JSON.stringify(todos);
  fs.writeFile("pages.txt", data, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Todos successfully written to file");
    }
  });
}


// Function to read the todos array from a file
function readTodosFromFile() {
  const data = fs.readFileSync("pages.txt", "utf8");
  const todos = JSON.parse(data);
  return todos;
}

// app.use((req, res, next) => {
//   res.status(404).send();
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  todos=readTodosFromFile();
  console.log("File read before start application"+JSON.stringify(todos));
});




