const PORT = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/rmstu";
const express = require("express");
const app = express();
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const {Profile,Faculty,Department,Degree,Course,Major,Classroom,Result} = require("./models/models.js")

app.set("view engine","ejs");
app.engine("ejs",ejsMate);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

main()
    .then(res => console.log("Mongoose: Connection Successful: ", res))
    .catch(err => console.log("Mongoose: Connection Failed: ", err));
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res)=>{
    res.sendFile("index.html");
})


app.get("/profile", async (req, res)=>{
    let students = await Profile.find({role:"student"});
    let faculties = await Profile.find({role:"faculty"});
    res.render("profile/index.ejs", {students,faculties});
})
app.post("/profile", async (req, res)=>{
    try {
        let {profile} = req.body;
        let newProfile = new Profile(profile);
        let result = await newProfile.save();
        console.log(result);
        res.redirect("/profile"); 
    } catch (error) {
        console.log(error);
        res.redirect("/profile"); 
    } 
})

app.get("/profile/new", (req, res)=>{
    res.render("profile/new.ejs");
})


app.get("/profile/:id", async (req, res)=>{
  try{
    let {id} = req.params;
    let profile = await Profile.findById(id);
    res.render("profile/show.ejs",{profile});
  }catch(error){
    console.log(error);
    res.redirect("profile");
  }
})

app.get("/course", async (req, res)=>{
    let departments = await Department.find();
    let faculties = await Faculty.find();
    let degrees = await Degree.find();
    let courses = await Course.find();
    res.render("course/index.ejs", {departments, faculties, degrees, courses});
})
app.post("/course", async (req, res)=>{
    try {
        let {tab} = req.query;
        console.log(tab);
        console.log(req.body);
        if(tab=="faculty"){
            let {faculty} = req.body;
            let newFaculty = new Faculty(faculty);
            var result = await newFaculty.save();
        }else if(tab=="department"){
            let {department} = req.body;
            let newDepartment = new Department(department);
            var result = await newDepartment.save();
        }else if(tab=="degree"){
            let {degree} = req.body;
            let newDegree = new Degree(degree);
            var result = await newDegree.save();
        }else if(tab=="course"){
            let {course} = req.body;
            let newCourse = new Course(course);
            var result = await newCourse.save();
        }
        console.log(result);
        res.redirect("/course"); 
    } catch (error) {
        console.log(error);
        res.redirect("/course"); 
    } 
})

app.get("/course/new", (req, res)=>{
    res.render("course/new.ejs");
})
// END OF COURSES
app.get("/result",async (req, res)=>{
    let results = await Result.find();
    res.render("result/index.ejs",{results});
})
app.get("/result/new", (req, res)=>{
    res.render("result/new.ejs");
});
app.post("/result", async (req, res)=>{
    let {result} = req.body;
    let newResult = new Result(result);
    await newResult.save();
    res.redirect("/result");
})

app.get("/academic", async(req, res)=>{
    
    let departments = await Department.find();
    let faculties = await Faculty.find();
    let degrees = await Degree.find();
    let courses = await Course.find();
    let majors = await Major.find();
    let classrooms = await Classroom.find();
    res.render("academic/index.ejs", {departments, faculties, degrees, courses, majors, classrooms});
})
app.post("/academic", async(req, res)=>{
    const { department, major, className, classCode } = req.body;
    console.log(req.body);

    try {
      // Find or create department
      let departmentDoc = await Department.findOne({ departmentName: department });
      if (!departmentDoc) {
        departmentDoc = new Department({ departmentName: department, departmentCode: department });
        await departmentDoc.save();
      }
  
      // Find or create major
      let majorDoc = await Major.findOne({ majorName: major });
      if (!majorDoc) {
        majorDoc = new Major({ majorName: major, majorCode: major, majorDepartment: departmentDoc._id });
        await majorDoc.save();
      }
  
      // Create the class
      const newClassroom = new Classroom({ classroomName: className, classroomCode: classCode, classroomMajor: majorDoc._id });
      await newClassroom.save();
  
      res.status(201).json({ message: 'Classroom created successfully!' });
    //   res.redirect("/academic");

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})
app.get("/academic/c/:id", async(req, res)=>{
    try{

        let {id} = req.params;
        let classroom = await Classroom.findById(id)
        .populate("classroomMajor")
        .populate({
            path: "classroomStudents",
            model: "Profile"
        });
        // console.log(classroom);
        res.render("academic/classroom.ejs",{classroom});
    }catch(err){
        console.log(err);
    }
})
app.post("/academic/c/:id", async(req, res)=>{
    try {
        let {id} = req.params;
        let {registrationNo} = req.body;
        console.log(registrationNo);
        let student = await Profile.findOne({registrationNo});
        // console.log(student);
        if(!student){
            console.log("profile doesn't exists");
            student = new Profile({
                role: "student",
                name: "Name required",
                registrationNo: registrationNo
            });
            let response = await student.save();
            console.log(response);
        }
        let classroom =  await Classroom.findById(id);
        classroom.classroomStudents.push(student);
        await classroom.save();
        console.log(classroom);
        res.redirect(`/academic/c/${id}`);
    } catch (error) {
        console.log(error);   
    }
})
app.listen(PORT, (req,res)=>{
    console.log(`app listening on ${PORT}`);
})