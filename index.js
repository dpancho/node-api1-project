// implement your API here
const express = require('express');
const db = require('./data/db');

const server = express();

server.use(express.json());


// #1 new user entered
server.post("/users", (req, res) => {
    const userDesc = req.body;
    if (!userDesc.name || !userDesc.bio) {
      res
        .status(400)
        .json({error: "Enter a name and bio for this user." });
    } else {
      db
        .insert(userDesc)
        .then(user => {
          res.status(201).json(user);
        })
        .catch(err => {
          res.json({error: "The user was not added!" });
        });
    }
  });

// #2 get users
server.get('/users', (req, res) => {
    db.find()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the user to the database" });
        })
})

// #3 get user by id 
server.get('/users/:id', (req, res) => {
    const id = Number(req.params.id)

    db.findById(id)
    .then(userID => {
        console.log(userID, id)
        if(!userID){
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        } else {
            res.status(200).json(userID)
        }
    })
    .catch(err => {
        console.log('error', err)
        res.status(500).json({ error: "The users information could not be retrieved."})
    })
})

// #4 delete user by id

server.delete('/users/:id', (req, res) => {
    const id = req.params.id

    db.remove(id)
    .then(count => {
        console.log(count, id)
        if(count === 0){
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        } else {
            res.status(200).json({ message: `Item with id ${id} deleted`})
        }

    })
    .catch(err => {
        console.log('error', err)
        res.status(500).json({ error: "The user could not be removed" })
    })
})

// #5 updates user

server.put('/users/:id', (req, res) => {
    const id = Number(req.params.id)
    const info = req.body
    const { name, bio } = info

    if(!name || !bio){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }

    db.update(id, info)
    .then(count => {
        console.log(count)
        if(count === 0){
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        } else {
            res.status(200).json(info)
        }
    })
    .catch(err => {
        console.log('error', err)
        res.status(500).json({error: "The user information could not be modified."})
    })
})

const port = 5000;
server.listen(port, () => console.log('\n API running on port 5000 \n'));
