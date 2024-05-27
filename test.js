const PORT = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/devtest";
const mongoose = require('mongoose');
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


main()
    .then(res => console.log("Mongoose: Connection Successful: ", res))
    .catch(err => console.log("Mongoose: Connection Failed: ", err));
async function main() {
  await mongoose.connect(MONGO_URL);
}


const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  courseCredit: { type: Number, required: true },
});

const sectionSchema = new mongoose.Schema({
  sectionName: { type: String, required: true },
  courses: [courseSchema],
});

const curriculumSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  sections: [sectionSchema],
});

const Curriculum = mongoose.model('Curriculum', curriculumSchema);

////////////////////////////////////////////////////////////////

app.post('/', async (req, res) => {
    const { year, sections } = req.body;
    try {
      const newCurriculum = new Curriculum({ year, sections });
      await newCurriculum.save();
      console.log(newCurriculum);
      res.status(201).json(newCurriculum);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
app.get("/", async (req, res)=>{
    let data = await Curriculum.find()
    .populate({
        path: 'sections',
        model: 'Curriculum',
    })
    res.status(201).json(data);
})


/////////////////////////////////////////////////////////////////

app.listen(PORT, (req,res)=>{
    console.log(`app listening on ${PORT}`);
})