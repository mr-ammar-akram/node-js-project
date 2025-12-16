// // const http = require('http');
// // const path = require('path');

// // // Importing custom modules
// // const { getCurrentDate, formatCurrency } = require('./utils');
// // const Logger = require('./logger');

// // // Create a logger instance
// // const logger = new Logger('App');

// // // Create server
// // const server = http.createServer((req, res) => {
// //   try {
// //     logger.log(`Request received for ${req.url}`);

// //     res.writeHead(200, { 'Content-Type': 'text/html' });
// //     res.write(`<h1>Welcome to our app!</h1>`);
// //     res.write(`<p>Current date: ${getCurrentDate()}</p>`);
// //     res.write(`<p>Formatted amount: ${formatCurrency(99.99)}</p>`);
// //     res.end();
// //   } catch (error) {
// //     logger.error(error);
// //     res.writeHead(500, { 'Content-Type': 'text/plain' });
// //     res.end('Internal Server Error');
// //   }
// // });

// // // Start server
// // const PORT = process.env.PORT || 3000;
// // server.listen(PORT, () => {
// //   logger.log(`Server running at http://localhost:${PORT}`);
// // });
// const express = require('express');
// const mongodb = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const authRoutes = require('./routes/authRoutes');
// const authMiddleware = require('./middleware/authMiddleware');
// const usersRouter = require("./routes/userRoutes"); 


// const app = express();
// app.use(express.json());
// app.use(cors());

// // Routes
// app.use('/auth', authRoutes);
// app.use("/users", usersRouter);

// // Protected Example Route
// app.get('/admin/dashboard', authMiddleware, (req, res) => {
//     res.json({ message: "Welcome Admin!", adminId: req.admin.id });
// });

// // Connect Database + Start Server
// mongodb.connect(process.env.MONGO_URI)
// .then(() => {
//     console.log("MongoDB Connected");
//     app.listen(5000, () => console.log("Server running on port 5000"));
// })
// .catch(err => console.log(err));
const express = require('express');
const mongodb = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const path = require("path");
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const usersRouter = require("./routes/userRoutes"); // <-- correct

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use("/users", usersRouter); // <-- fix here
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Protected Example Route
app.get('/admin/dashboard', authMiddleware, async (req, res) => {
    try {
    const Admin = require("./models/Admin");
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({ message: `Welcome, ${admin.username}!`, username: admin.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Connect Database + Start Server
mongodb.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
})
.catch(err => console.log(err));
