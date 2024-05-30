const mongoose = require("mongoose");

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
module.exports.Profile = mongoose.model("Profile", profileSchema);

const facultySchema = new mongoose.Schema({
    facultyName : String,
    facultyCode : String,
})
module.exports.Faculty = mongoose.model("Faculty", facultySchema);

const departmentSchema = new mongoose.Schema({
    departmentName : String,
    departmentCode : String
})
module.exports.Department = mongoose.model("Department", departmentSchema);

const degreeSchema = new mongoose.Schema({
    degreeName : String,
    degreeCode : String
})
module.exports.Degree = mongoose.model("Degree", degreeSchema);

const majorSchema = new mongoose.Schema({
    majorName: { type: String, required: true },
    majorCode: { type: String, required: true, unique: true },
    majorDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
});
module.exports.Major = mongoose.model('Major', majorSchema);

const courseSchema = new mongoose.Schema({
    courseName : String,
    courseCode : String
})
module.exports.Course = mongoose.model("Course", courseSchema);

const classroomSchema = new mongoose.Schema({
    classroomName: { type: String, required: true },
    classroomCode: { type: String, required: true, unique: true },
    classroomMajor: { type: mongoose.Schema.Types.ObjectId, ref: 'Major' },
    classroomStudents: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Profile' 
    }]
});

module.exports.Classroom = mongoose.model('Classroom', classroomSchema);


const resultSchema = new mongoose.Schema({
    registrationNo: Number,
    marks: [{
        courseName: String,
        courseCode: String,
        courseCredit: Number,
        attainedMarks: Number,
        attainedGpa: Number
    }]
})
module.exports.Result = mongoose.model("Result", resultSchema);

