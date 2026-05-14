require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();
const express = require("express");

const authRoutes = require("./routes/authRoutes");
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const taskRoutes = require("./routes/tasks");
//const authRoutes = require("./routes/authRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

app.use(express.json({ limit: "1000kb" }));
app.use(cookieParser());

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(":method :url :status :response-time ms - :body"));

app.use((req, res, next) => {
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      console.log(" ⚠️ suspicious request detected: ", {
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
      });
    }
  });
  next();
});

app.use(helmet());
app.use(cors());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use(limiter);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

//app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({
    service: "Team Task Management API",
    status: "Running",
    documentation: "/api-docs",
  });
});

//unknown endpoint handler
app.use((req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
});

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

app.use(notFound);
app.use(errorHandler);

module.exports = app;
