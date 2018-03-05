const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();

//mongoose Promise
mongoose.Promise= global.Promise;

//Connenct to mongoose
mongoose.connect('mongodb://localhost/vidjot-db',{
})
.then(()=>console.log("MongoDB Connencted"))
.catch(err=> console.log(err));

//Load Idea Model
require('./models/idea');
const Idea = mongoose.model('ideas');

//Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//Index Route
app.get('/',(req,res)=>{
  const title = 'Welcome Vlad';
  res.render('index',{
    title: title
  } );
});

//About Route
app.get('/about',(req,res)=>{
  res.render('about');
});

//ideas index
app.get('/ideas',(req,res)=>{
  Idea.find({})
    .sort({date : 'desc'})
    .then((ideas) => {
      res.render('ideas/index',{
        ideas : ideas
      });
    })

});

//add Ideas Form
app.get('/ideas/add',(req,res)=>{
  res.render('ideas/add');
});

//process Form
app.post('/ideas', (req,res)=>{
  let errors = [];
  if (!req.body.title) {
    errors.push({text:'Please Add a Title'});
  }
  if (!req.body.details) {
    errors.push({text:'Please Enter some Details'});
  }
  if (errors.length > 0) {
    res.render('ideas/add',{
      errors : errors,
      title : req.body.title,
      details : req.body.details
    });
  }
  else {
    const newIdea = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newIdea)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      })
  }

});


const port = 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);

});
