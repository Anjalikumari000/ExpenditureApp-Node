const mongoose = require("mongoose"); 

const expenseSchema = new mongoose.Schema({
    amount:{
        type:Number, 
        required:true 
    }, 

    desc:{
        type:String, 
        required:true 
    } 
}); 

module.exports = mongoose.model("Expense", expenseSchema);  