const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require("jsonwebtoken")

mongoose.connect(
    "mongodb+srv://achan809:test123@cluster0.q69epei.mongodb.net/",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.log("Connected to MongoDb")
}).catch((err) => {
    console.log("Error connecting to Mongo Db", err)
});

app.listen(port, () => {
    console.log("server running on port 8000");
})

const User = require("./models/user")
const Message = require("./models/message")

//endpoint for registering a user
app.post("/register", async (req, res) => {
    const { name, email, password, image } = req.body;
    const user = new User({
        name,
        email,
        password,
        image
    });
    //save user to the DB
    await user.save().then(() => {
        res.status(200).json({ message: "User registered successfully" })
    }).catch((err) => {
        console.log("Error registering user", err);
        res.status(500).json({ message: "Error registering user" })
    })
})

//function to createToken based on the user id
const createToken = (userId) => {
    //set the token payload
    const payload = {
        userId: userId,
    };
    // generate the token with a secret key and expiration time
    const token = jwt.sign(payload, "secret-abcde", { expiresIn: "1h" });
    return token;
}

// endpoint for logging in a user
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    //check if the email and password are provided
    if (!email || !password) {
        return res.status(404).json({ message: "Email and password are required" })
    }
    //find the user in the DB
    await User.findOne({ email }).then((user) => {
        if (!user) {
            //user not found
            return res.status(404).json({ message: "User not found" })
        }
        //compare the password
        if (user.password !== password) {
            return res.status(404).json({ message: "Invalid password" })
        }
        const token = createToken(user._id);
        res.status(200).json({ token })
    }).catch((error) => {
        console.log("error in finding the user", error);
        res.status(500).json({ message: "Error finding the user" });
    })
})

//endpoint to get all users except the user who's currently logged in
app.get("/users/:userId", async (req, res) => {
    const loggedInUserId = req.params.userId;
    User.find({ _id: { $ne: loggedInUserId } }).then((users) => {
        res.status(200).json(users)
    }).catch((error) => {
        console.log("Error fetching users", error);
        res.status(500).json({ message: "Error fetching users" })
    })
})