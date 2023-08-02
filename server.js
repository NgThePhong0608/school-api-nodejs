const app = require("./app/app");
const http = require("http");
const dbConnect = require("./config/database");

// connect db
dbConnect();
const port = process.env.PORT || 8000;

// server
const server = http.createServer(app);
server.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
});
