const express = require('express');
const cors = require('cors');
const fs = require('fs');
const  {IncomingForm} = require('formidable');
const path = require('path');
const app = express();


app.use(cors());

app.get("/", (req, res) => {
    res.send("this is main page")
})

app.post("/file", (req, res) => {
    const form = new IncomingForm({multiples: true});
    form.parse(req, (err, fields, files) => {
        console.log(files)
        fs.readFile(files.payload.filepath, {}, (err, data) => {
            try {
                fs.writeFileSync(path.join(__dirname, files.payload.originalFilename), data)
                res.send(files)
            } catch (error) {
                res.send("Theirs is an error")
            }
        })
    })
})
const max_size = 10 * 1024 * 1024;
app.post("/stream", (req, res) => {
    const form = new IncomingForm({maxFileSize:max_size});
    form.parse(req, (err, fields, files) =>{
       
        try {
            const filePlace = `${Date.now()}_${files.another.originalFilename}`
            if (files.another.mimetype !== "video/mp4") {
                res.send("Informat file type")
            }
            else{
                const readStream  = fs.createReadStream(files.another.filepath, {});
                const writeStream  = fs.createWriteStream(path.join(__dirname, filePlace), {} ,{flags:"w"});
                readStream.pipe(writeStream);

                writeStream.on('finish', () => {
                    res.send("done");
                })
            }
        // let name = String(files.another.originalFilename).replace(/\s/ig, "_"); 
        
        } catch (error) {
            res.send("File Too Large");
        }
    })
})

app.listen(4000, ()=> console.log("app runnig on port 4000"));