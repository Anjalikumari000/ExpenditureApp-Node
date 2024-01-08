const express = require("express"); 
const app = express(); 
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");  
const bodyParser = require("body-parser");   

mongoose.connect("mongodb://127.0.0.1:27017/moneytracker"); 
const db = mongoose.connection 

db.on("error", () => {
    console.log("Error Occured Connecting to database"); 
}) 

db.once("open", () => {
    console.log("Connection Established Successfully!");  
});  

const Expense = require("./model"); 

app.use(bodyParser.urlencoded({limit:"10mb", extended:false}))  
app.use(expressLayouts); 
app.use(express.json()) 
app.set("view engine", "ejs") 
app.set("views", "./views")   
app.set("layout", "./layouts/layout") 
app.use(express.static("public")) 


app.get("/", async (req,res) => {

    try{
        const expenses = await Expense.find();   
        let sum = 0; 
        expenses.forEach(exp => sum += exp.amount);  
        console.log(sum)  
        res.render("index.ejs", {expenses:expenses, sum:sum});  
        // res.render("index.ejs",{errorMessage:"Internel Server Error Occured"})   

    }catch(err){
        res.render("index.ejs",{errorMessage:"Internal Server Error Occured"})  
        console.log(err);  
    }

}) 

app.post("/add", async (req,res) => {
    try{
        const expense = new Expense({desc:req.body.desc, amount:req.body.amount}) 
        const newExpense = await expense.save();  
        // res.status(200).send(newExpense);
        res.redirect("/")       
        // res.status(200).send("Successfully Added Data!")   
    }catch(err){
        console.log(err); 
        // res.status(500).send("Error Occured While Adding Expense")  
        res.render("index.ejs", {errorMessage:"Internal Error Occured!, Refresh The Page"})    
    }
}); 

app.get("/get", async (req,res) => {
    try{
        const expenses = await Expense.find(); 
        res.status(200).json(expenses);  
    }catch(err){
        console.log(err);  
        res.status(500).send("Unexpected Error Occured!"); 
    }
}); 

app.get("/getsum", async (req,res) => {
    try{
        const expenses = await Expense.find({}, {amount:1, _id:0}); 
        let sum = 0; 
        expenses.forEach(exp => {sum += exp.amount})  
        res.status(200).json({total:sum});   
    }catch(err){
        res.status(500).send("Error Fetching Sum!"); 
        console.log(err);  
    }
}); 


const PORT = 8000; 
app.listen(PORT, () => {
    console.log(`[SERVER STARTED]: http://localhost:${PORT}`)   
}) 