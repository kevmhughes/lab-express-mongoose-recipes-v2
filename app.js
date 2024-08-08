const express = require("express");
const logger = require("morgan");
const Recipe = require('./models/Recipe.model.js');

const app = express();

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());

const mongoose = require("mongoose");

// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION
const MONGODB_URI = "mongodb+srv://kevhughes24:kevhughes24@cluster0.qjzwuwk.mongodb.net/express-mongoose-recipes-dev";

mongoose
  .connect(MONGODB_URI)
  .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to mongo", err));

// ROUTES
//  GET  / route - This is just an example route
app.get('/', (req, res) => {
    res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});


//  Iteration 3 - Create a Recipe route
//  POST  /recipes route
app.post('/recipes', async  (req, res) => {

    try {
        const { title, instructions, level, ingredients, image, duration, isArchived, created } = req.body;

        // Check for required fields
        if (!title || !instructions) {
            return res.status(400).json({
                error: "Validation error",
                message: "Title and instructions are required"
            });
        }

        const newRecipe = await Recipe.create({
            // If the key and value are the same, one word can be used (see below):
            // title: title => title
            title,
            instructions,
            level, 
            ingredients,
            image,
            duration,
            isArchived,
            created
        })
        
        res.status(201).json({
            message: "recipe created successfully",
            item: newRecipe,
        });
    } catch (error) {
        res.status(500).json({
            error: "Server error", 
            details: error.message
        })
    }

});

//  Iteration 4 - Get All Recipes
//  GET  /recipes route
app.get('/recipes', async (req, res) => {
    try {
        const allRecipes = await Recipe.find({}) 

        res.status(200).json({
            message: "All recipes found",
            data: allRecipes 
        });
    } catch (error) {
        res.status(500).json({
            error: "Error while retrieving all recipes", 
            details: error.message
        })
    }

});

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route

app.get('/recipes/:_id', async (req, res) => {
    try {
        const singleRecipe = await Recipe.findOne({ _id: req.params._id }) 
        res.status(200).json({
            message: "that recipe has been found",
            data: singleRecipe 
        });
    } catch (error) {
        res.status(500).json({
            error: "Error while retrieving a single recipe", 
            details: error.message
        })
    }
});

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route

app.put('/recipes/:_id', async (req, res) => {
    try {
        await Recipe.findOneAndUpdate({ _id: req.params._id }, req.body, {new: true}) 
        res.status(200).json({
            message: "that recipe has been updated",
        });
    } catch (error) {
        res.status(500).json({
            error: "Error while trying to update the recipe", 
            details: error.message
        })
    }
});


//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route
app.delete('/recipes/:_id', async (req, res) => {
    try {
        await Recipe.deleteOne({ _id: req.params._id }) 
        res.status(200).json({
            message: "that recipe has been deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: "Error while trying to delete the recipe", 
            details: error.message
        })
    }
});


// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));



//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
