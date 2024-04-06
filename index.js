const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.json())

// const NAMEs = [];

function readFunc() {
  let List = fs.readFileSync('dataBase.json', 'utf8');
  const readData = JSON.parse(List);
  return readData;
}

function checkNames(objName) {
  let flag = false;
  let NAMEs = readFunc();
  if(NAMEs.length >= 1 ) {
    for(var i = 0; i < NAMEs.length; i++) {
      if(NAMEs[i].nameM===objName.nameM && NAMEs[i].nameF===objName.nameF) {
        flag = true;
        break;
      }
    }
    return flag;
  }
  return flag;  
}

function result(obj) {
  const NAMEs = readFunc();
  for(var i = 0; i < NAMEs.length; i++) {
    if(NAMEs[i].nameM===obj.nameM && NAMEs[i].nameF===obj.nameF) {
      obj.percent = NAMEs[i].percent;
    }
  }
  return obj;
}

app.get('/result', (req,res) => {
  const result = readFunc();
  res.json(result);
})

app.post('/getNames', (req,res) => {
  const nameM = req.body.nameM;
  const nameF = req.body.nameF;
  const percent = Math.floor(Math.random() * 100);
  const obj = {
    nameM: nameM,
    nameF: nameF,
    percent: percent
  };

  const newObj = checkNames(obj);
  console.log(newObj);
  if(newObj) {
    console.log('JSON data already stored!!!!');
    res.status(201).json(result(obj));
  } else {
    fs.readFile("dataBase.json", "utf8", (err, data) => {
      if (err) throw err;
      let NAMEs = JSON.parse(data);
      NAMEs.push(obj);
      let newDATA = JSON.stringify(NAMEs);
      fs.writeFile('dataBase.json', newDATA, (err) => {
        if (err) throw err;
        console.log('JSON data stored successfully');
      })
    })
    res.status(201).json(obj);
  }
})

app.get("/", (req,res) => {
  res.status(200).sendFile(path.join(__dirname+"/index.html"));
})

app.listen(port, (req,res) => {
  console.log(`The server is running at http://localhost:${port}/`);
})