const PORT = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/rmstu";
const express = require("express");
const app = express();
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");

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

const profileSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["student","faculty"]
    },
    name: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date
    },
    email: String,
    phoneNumber: String,
    address: String,
    impactScore: {
        type: Number,
        default: 0
    },
    mastersInfo: String,
    bachelorInfo: String,
    joinDate: String,
    designation: String,
    session: String,
    rollNo: Number,
    registrationNo: Number
})

const Profile = mongoose.model("Profile", profileSchema);

app.get("/profile", async (req, res)=>{
    let profiles = await Profile.find();
    res.render("profile/index.ejs", {profiles});
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

const facultySchema = new mongoose.Schema({
    facultyName : String,
    facultyCode : String
})
const Faculty = mongoose.model("Faculty", facultySchema);

const departmentSchema = new mongoose.Schema({
    departmentName : String,
    departmentCode : String
})
const Department = mongoose.model("Department", departmentSchema);

const degreeSchema = new mongoose.Schema({
    degreeName : String,
    degreeCode : String
})
const Degree = mongoose.model("Degree", degreeSchema);

const courseSchema = new mongoose.Schema({
    courseName : String,
    courseCode : String
})
const Course = mongoose.model("Course", courseSchema);

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

app.listen(PORT, (req,res)=>{
    console.log(`app listening on ${PORT}`);
})