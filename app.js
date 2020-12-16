const express =require('express');
const app = express();
const fs=require('fs');
const multer=require('multer');
const createWorker = require("tesseract.js");
const worker =new createWorker();
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads");// if file get uploaded it will upload the file else cb will return error that is null
    },
    filename : (req, file, cb) => {
      cb(null, file.originalname); //filename decides what filename we want to give to the file
    }
});  
const upload =multer({storage: storage}).single('avatar');
app.set('view engine', "ejs");

app.get('/', (req, res) => {
});
app.post("/upload", (req, res) => {
  upload(req, res, err  => {
    fs.readFile(` ./uploads/${req.file.originalname}`, (err, data) => {
      if(err) return console.log('this is error', err);
      worker
      .recognize(data, "eng", {tessjs_create_pdf: '1'})
      .progress(progress => {
        console.log(progress);
      })
      .then(result => {
        res.send(result.text);
      })
      .finally(() => worker.terminate());
    });
  });
const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log('hey im working'));
});
