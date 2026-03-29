const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

/* ================= MIDDLEWARE ================= */

// CORS (حل نهائي لمشاكل الاتصال)
app.use(cors());

// JSON body parser
app.use(express.json());

// حل مشاكل OPTIONS (Preflight)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* ================= ROUTES ================= */

// 🟢 Health Check
app.get("/", (req, res) => {
  res.json({ status: "⚖️ Justice System Running" });
});

/* ================= FAKE DB ================= */

const users = [
  {
    id: 1,
    email: "admin@court.tn",
    password: "1234",
    role: "prosecutor",
    courtCode: 12
  }
];

/* ================= LOGIN ================= */

app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "missing credentials" });
    }

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "wrong credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        courtCode: user.courtCode
      },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        courtCode: user.courtCode
      }
    });

  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

/* ================= DASHBOARD (PROTECTED) ================= */

app.get("/dashboard", (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const user = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev_secret"
    );

    res.json({
      totalCases: 120,
      closedCases: 70,
      pendingCases: 50,
      role: user.role,
      courtCode: user.courtCode
    });

  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("⚖️ Justice System Running on port", PORT);
});

