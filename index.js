import  multer  from 'multer'
import express from 'express'
import docxConverter from 'docx-pdf'
import path from 'path'
import cors from 'cors'
import 'dotenv/config'



const app = express()
const port = process.env.port || 3000
app.get('/', (req, res) => {
    res.send('Hello World working!')
})

app.use(cors({
    // origin: 'https://word-to-pdf-liart.vercel.app'
}))

//storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })


app.post('/convertFile', upload.single('file'), (req, res, next) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            })
        }
        //output file path
        let outputPath = path.join(
              "files", `${req.file.originalname}.pdf`);

        docxConverter(req.file.path, outputPath, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({message:"Error converting docx to pdf ", })
            }
            res.download(outputPath,()=>{
                console.log("file download")
            })
            console.log('result' + result);
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error ", })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})