const bodyParser = require("body-parser");
const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const localSrategi = require("passport-local");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/UserSchema");
const multer = require("multer");
const path = require("path");
const Message = require("./models/messageSchema");
const app = express();
const port = 8080;
require("dotenv").config();

app.use(cors());

app.use(bodyParser.json());
app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGOO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect to mongodb");
  })
  .catch((error) => {
    console.log("can not connect to mongodb", error);
  });

app.listen(port, () => {
  console.log("server is listening on port 8080");
});

// app.get("/", (req, res) => {
//   res.send("okok");
// });

app.use("/files", express.static(path.join(__dirname, "files")));

const storageProfile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/profile"); // Menyimpan file di dalam folder 'uploads/'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Menamai file dengan timestamp
  },
});

const uploadProfile = multer({ storage: storageProfile });

//! register
app.post("/register", uploadProfile.single("image"), async (req, res) => {
  const { name, password, email } = req.body;
  try {
    const newuser = await new User({
      name,
      password,
      email,
      image: req.file.path,
    }).save();

    res.status(200).json({
      success: true,
      message: "user created successfull",
      newuser,
    });
  } catch (error) {
    console.log(error);
  }
});

//! Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(500).json({
        success: false,
        message: "email or password is requried",
      });
    }

    const theUser = await User.findOne({ email });

    if (email !== theUser.email) {
      res.status(500).json({
        success: false,
        message: "Email is not registed, please register first",
      });
    }
    if (password !== theUser.password) {
      res.status(500).json({
        success: false,
        message: "Email is not registed, please register first",
      });
    }
    const token = jwt.sign({ id: theUser._id }, "secret000", {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Login is successfull",
      user: theUser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      success: false,
      message: "something is wrong",
    });
  }
});

// ! find all user except the user curenly login

app.get("/user/:userId", async (req, res) => {
  const userNow = req.params.userId;
  try {
    const allUserExceptMe = await User.find({ _id: { $ne: userNow } });
    if (allUserExceptMe) {
      res.status(200).json({
        message: "show all user except me successfull",
        success: true,
        users: allUserExceptMe,
      });
    } else {
      res.status(400).json({
        message: "show all user except me failed",
        success: false,
      });
    }
  } catch (error) {
    console.log("eror", error);
  }
});

// ! request friens
app.post("/friend-request", async (req, res) => {
  try {
    const { curentlyUserId, selectedUserId } = req.body;

    // check friend request
    const friendRequest = await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequest: curentlyUserId },
    });

    // check friend request have been sent
    const sendFriendRequest = await User.findByIdAndUpdate(curentlyUserId, {
      $push: { sendFriendRequests: selectedUserId },
    });

    if (friendRequest && sendFriendRequest) {
      res.status(200).json({
        success: true,
        message: "request has been sent",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "sent request failed ",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// ! friend Requests
app.get("/friend-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate("friendRequest", "name email image")
      .lean();

    // const friendRequests = user.friendRequests;

    res.status(200).json({
      success: true,
      message: "find frien-request is successful",
      friendRequest: user.friendRequest,
    });
  } catch (error) {
    console.log("error", error);
    res
      .status(200)
      .json({ erorr: error, success: false, message: "something went wrong" });
  }
});

// ! friends request accepted
app.post("/friend-request-accepted", async (req, res) => {
  const { senderID, reciverID } = req.body;
  try {
    const sender = await User.findById(senderID);
    const reciver = await User.findById(reciverID);

    sender.friends.push(reciverID);
    reciver.friends.push(senderID);

    sender.sendFriendRequests = sender.sendFriendRequests.filter(
      (a) => a._id.toString() !== reciverID.toString()
    );
    reciver.friendRequest = reciver.friendRequest.filter(
      (a) => a._id.toString() !== senderID.toString()
    );

    await sender.save();
    await reciver.save();

    res.status(200).json({
      success: true,
      message: "accept request is successfull",
    });
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ success: false, message: "something went wrong", error });
  }
});

// ! show all your friends

app.get("/your-friends/:currentId", async (req, res) => {
  const { currentId } = req.params;
  try {
    const user = (await User.findById(currentId)).populate(
      "friends",
      "name email image"
    );

    const yourFriends = (await user).friends;

    res.status(200).json({
      success: true,
      message: "get all your friend is successfull",
      yourFriends,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "something went wrong" });
  }
});

// ! show list of send friends request
app.get("/all-send-request-id/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId)
      .populate("sendFriendRequests", "name email image")
      .lean();
    if (user) {
      res.status(200).json({
        message: "get all id sendRequesis t successful",
        success: true,
        sendFriendRequests: user.sendFriendRequests,
      });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(502).json({
      message: "something went wrong",
      success: false,
    });
  }
});

//! get ID all friend
app.get("/all-friends-id/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const user = await User.findById(userId).populate("friends");

    if (!user.friends) {
      res.status(400).json({
        message: "user not found",
        success: false,
      });
    }
    const friendsId = user.friends.map((a) => a._id);
    res.status(200).json({
      message: "get all friends Id is successfull",
      success: true,
      friendsId,
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(502).json({
      message: "something went wrong",
      success: false,
    });
  }
});

// ! multer upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Menyimpan file di dalam folder 'uploads/'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Menamai file dengan timestamp
  },
});
const upload = multer({ storage: storage });

//! messages full
app.post("/messages", upload.single("imageFile"), async (req, res) => {
  try {
    const { senderId, reciverId, messageType, messageText } = req.body;

    const newMessage = new Message({
      senderId,
      reciverId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      ImageUrl: messageType === "image" ? req.file.path : null,
    });

    await newMessage.save();

    res.status(200).json({
      success: true,
      message: "create message successfull",
      newMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "something went wrong",
      success: false,
    });
  }
});

// ! show user target/ Reciver
app.get("/user-target/:reciverId", async (req, res) => {
  try {
    const { reciverId } = req.params;
    const userTarget = await User.findById(reciverId);

    res.status(200).json({
      message: "get user target successfull",
      success: true,
      user: userTarget,
    });
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
      success: false,
    });
  }
});

// ! get message beatwen 2 user
app.get("/messages-send/:senderId/:reciverId", async (req, res) => {
  try {
    const { senderId, reciverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, reciverId: reciverId },
        { senderId: reciverId, reciverId: senderId },
      ],
    }).populate("senderId", "_id name");
    res.status(200).json({
      message: "get text message succesfull",
      success: true,
      messages,
    });
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
      success: false,
    });
  }
});

// ! delate messsage
app.post("/deleteMessage", async (req, res) => {
  try {
    const { messageId } = req.body;
    console.log(messageId);

    if (!Array.isArray(messageId) || messageId.length === 0) {
      res.status(400).json({
        message: "query req.body wrong",
        success: false,
      });
    }
    await Message.deleteMany({ _id: { $in: messageId } });

    res.status(200).json({
      message: "delate message is successfull",
      success: true,
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(502).json({
      message: "something went wrong",
      success: false,
    });
  }
});
