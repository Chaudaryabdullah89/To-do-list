const mongoose = require('mongoose')

const connectDb = async()=>{
    try{
       mongoose.connect('mongodb+srv://chabdullah:abdullah21@backend.tr2ys.mongodb.net/?retryWrites=true&w=majority&appName=backend',{
           
        })
        console.log('Database connected successfully')
       
    }
    catch(err){
            console.error('Database connection failed:', err.message)        
    }
}

module.exports = connectDb;