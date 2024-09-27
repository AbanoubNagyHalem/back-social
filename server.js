import express from "express";
import usersRouter from "./users/user.router.js";
import postsRouter from "./posts/post.router.js";
import connectDB from "./db/database.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
