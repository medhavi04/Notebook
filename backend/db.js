const mongoose= require('mongoose')
mongoose.set('strictQuery', true);
const monoURI="mongodb://127.0.0.1:27017/iNB"

const connectToMongo=()=>{
    mongoose.connect(monoURI,()=>{
        console.log('Connected to mongo successfully');
        
    })
}

module.exports=connectToMongo;