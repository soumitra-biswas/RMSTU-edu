const MONGO_URL = "mongodb://127.0.0.1:27017/rmstu";
const {Profile} = require("./models/models.js");
let data = require("./data.json");
const mongoose = require("mongoose");
// data = JSON.parse(data);
main()
    .then(res => {
        console.log("Mongoose: Connection Successful: ", res);
        db();
    })
    .catch(err => console.log("Mongoose: Connection Failed: ", err));
async function main() {
  await mongoose.connect(MONGO_URL);

}
console.log(data);
const db = async () => {
    try {
        await Profile.deleteMany({});
        let res = await Profile.insertMany(data);
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}
