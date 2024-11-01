const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { connectDatabase } = require("./config/database.js");

require("dotenv").config();
app.use(express.json());
app.use(cookieParser());

connectDatabase();

const userRoute = require("./routes/user.js");
const postRoute = require("./routes/post.js");
const commentRoute = require("./routes/comment.js");

app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
