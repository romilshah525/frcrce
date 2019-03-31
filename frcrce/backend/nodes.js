const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const fs=require('fs')
const clarifai=require('clarifai')

let answer=null;
let concepts=null;

function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer.from(bitmap).toString('base64');
}

app.use(express.static('public'))
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({
    storage
})

app.use(cors());

app.post('/upload', upload.single('image'), (req, res) => {
    console.log('inside')
    if (req.file){
            var base64str = base64_encode('public/images/uploads/'+req.file.filename);
            const clarifai_app=new clarifai.App({
                apiKey:'011406c56bd84ee99f85c893bb7874f2'
            });
            clarifai_app.models.predict(Clarifai.GENERAL_MODEL, {base64: base64str}).then(
                 function (response) {
                    concepts =  response['outputs'][0]['data']['concepts']
                    answer= concepts.find(e=>{
                        return e.name=="food"
                    })
                    console.log(answer)
                    res.json({
                        imageUrl: `images/uploads/${req.file.filename}`,
                        answer:answer,
                        concepts:concepts
                    });
                },
                function(err) {
                  console.log(err);
                }
              )
        
    }
    else
        res.status("409").json("No Files Uploaded...");
});

app.listen(4000,()=>{
    console.log('Listening on port 4000')
})