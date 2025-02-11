import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost:27017/MiBD')
.then(() =>{
    console.log('Connection to mongoDB successful!')
})
.catch((error)=>{
    console.error('MONGODB CONNECTION ERROR:', error)
})

export default mongoose
