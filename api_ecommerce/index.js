import express from 'express'
import cors from 'cors'
import path from 'path'
import mongoose from 'mongoose'
import router from './router'

//CONEXIÓN A LA BASE DE DATOS
mongoose.Promise = global.Promise;
const dbUrl = "mongodb://127.0.0.1:27017/ecommerce";
mongoose.connect(
    dbUrl , {
        useNewUrlParser: true,
        useUnifiedTopology: true
   }
).then(mongoose => console.log("CONECTADO A LA BASE DE DATOS EN EL PUERTO 27017"))
.catch(err => console.log(err));

//EXPRESS
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')))
app.use('/api/',router)

app.set('port',process.env.PORT || 3000);

app.listen(app.get('port'), () =>{
    console.log("El servidor se ejecuto perfectamente en el puerto 3000");
})
