require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

let mongoUri = process.env.MONGO_URL;
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

const studentRoute = require("./Routes/studentRoute");
const authRoute = require("./Routes/authRoute");
const classRoute = require("./Routes/classRoute");
const sectionRoute = require("./Routes/sectionRoute");
const feeRoute = require("./Routes/feeRoute");
const subjectRoute = require("./Routes/subjectRoute");
const examRoute = require("./Routes/examRoute");
const marksRoute = require("./Routes/marksRoute");
const bookRoute = require("./Routes/bookRoute");
const driverRoute = require("./Routes/driverRoute");
const vehicleRoute = require("./Routes/vehicleRoute");
const studentTransportRoute = require("./Routes/studentTransportRoute");
const transportRoute = require("./Routes/transportRoute");
const financeRoute = require("./Routes/financeRoute");

app.use("/api/v1/students", studentRoute);
app.use("/api/v1/users", authRoute);
app.use("/api/v1/classes", classRoute);
app.use("/api/v1/sections", sectionRoute);
app.use("/api/v1/fee", feeRoute);
app.use("/api/v1/subjects", subjectRoute);
app.use("/api/v1/exams", examRoute);
app.use("/api/v1/marks", marksRoute);
app.use("/api/v1/books", bookRoute);
app.use("/api/v1/drivers", driverRoute);
app.use("/api/v1/vehicle", vehicleRoute);
app.use("/api/v1/studentTransport", studentTransportRoute);
app.use("/api/v1/transport", transportRoute);
app.use("/api/v1/finance", financeRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is runiing on port " + PORT);
});
