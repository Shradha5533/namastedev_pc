const mongoose = require('mongoose');


const connectDB = async () => {
    await mongoose.connect("mongodb+srv://namastenode:3XwEoFVjr7bP4LGZ@namastenode.cbvuw.mongodb.net/devTinder");

}

module.exports = connectDB;