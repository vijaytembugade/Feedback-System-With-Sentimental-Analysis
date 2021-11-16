const express =require("express")
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const cookieParser=require("cookie-parser")
const logger=require("morgan")
const cors=require("cors")
const path = require('path')

const app=express();
app.use(cors());

dotenv.config();

const server = require('http').createServer(app);

// const dbConfig=require("./config/secret")


const student = require('./routes/studentRoute')
const teacher = require('./routes/teacherRoute')
const question = require('./routes/questionRoute')
const section = require('./routes/sectionRoute')
const feedbackForm = require('./routes/feedbackFormRoute')
const response = require('./routes/responseRoute')
const auth = require('./routes/authRoute')
const report = require('./routes/reportRoute')


app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Credentials","true");
  res.header("Access-Control-Allow-Methods",'GET','POST','DELETE','PUT','OPTION');
  res.header(
      'Access-Control-Allow-Headers',
      'Origin,X-Requested-With,Content-Type,Accept,Authorization'
  );
  next();
})

app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({extended:true,limit:'50mb'}))
app.use(cookieParser());    
//app.use(logger('dev'))

// Connect to MongoDB
mongoose.promise=global.promise;
mongoose
    .connect(process.env.DB_CONNECT,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));


// Routes
app.use("/api/auth", auth)
app.use("/api/students", student)
app.use("/api/teachers", teacher)
app.use("/api/questions", question)
app.use("/api/sections", section)
app.use("/api/feedbackforms", feedbackForm)
app.use("/api/responses", response)
app.use('/api/reports', report)
// app.get('/', (req, res) => { res.send('Hello from Express!')})


if( process.env.NODE_ENV === 'production' ) {
    app.use(express.static('./client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

server.listen(process.env.PORT || 5001,()=>{
    console.log("Running 5001!!")
})
