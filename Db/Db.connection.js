const mongoose = require('mongoose')

const connectDb = async()=>{
    try{
       mongoose.connect('mongodb://localhost:27017/todolist',{
           
        })
        console.log('Database connected successfully')
       
    }
    catch(err){
            console.error('Database connection failed:', err.message)        
    }
}

module.exports = connectDb;