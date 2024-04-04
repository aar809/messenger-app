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
        console.log("users", users);
    }).catch((error) => {
        console.log("Error fetching users", error);
        res.status(500).json({ message: "Error fetching users" })
    })
})

//endpoint to send request to a user
app.post("/friend-request", async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;
    console.log("server function", currentUserId, selectedUserId);
    try {
        // update the recipient's friendRequests array
        await User.findByIdAndUpdate(selectedUserId, {
            $push: { friendRequests: currentUserId }
        });

        // update the sender's sentFriendRequests array
        await User.findByIdAndUpdate(currentUserId, {
            $push: { sentFriendRequests: selectedUserId }
        });

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
})

// endpoint to show all friend requests of a user
app.get("/friend-request/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        // fetch the user document based on User Id
        const user = await User.findById(userId).populate("friendRequests", "name email image").lean();
        const friendRequests = user.friendRequests;
        res.json(friendRequests);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal Server Error" })
    }
})

// endpoint to accept a friend request
app.post("/friend-request/accept", async (req, res) => {
    console.log("made it here")
    try {
        const { senderId, recipientId } = req.body;
        console.log(senderId, recipientId)
        //retrieve the documents of the sender and recipient
        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);

        if (!sender || !recipient) {
            console.log("user id's not found")
            return res.status(404).json({ message: "User not found" });
        }
        sender.friends.push(recipientId);
        recipient.friends.push(senderId);

        recipient.friendRequests = recipient.friendRequests.filter((id) => id.toString() !== senderId.toString());
        sender.sentFriendRequests = sender.sentFriendRequests.filter((id) => id.toString() !== recipientId.toString());

        await sender.save();
        await recipient.save();
        console.log("Friend request successfully accepted")
        res.status(200).json({ message: "Friend request accepted successfully" })
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
})