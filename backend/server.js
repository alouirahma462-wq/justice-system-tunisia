const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

// 🔐 CORS مضبوط للـ production
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 🟢 Health Check
app.get("/", (req, res) => {
  res.json({ status: "⚖️ Justice System Running" });
});

// 👤 Users DB (مرحلة تجريبية)
const users = [
  {
    id: 1,
    email: "admin@court.tn",
    password: "1234",
    role: "prosecutor",
    courtCode: 12
  }
];

// 🔐 LOGIN
app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "missing credentials" });
    }

    const user = users.find(
      u => u.email === email && u.password === password
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

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        courtCode: user.courtCode
      }
    });

  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
});

// 📊 DASHBOARD (protected)
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

    return res.json({
      totalCases: 120,
      closedCases: 70,
      pendingCases: 50,
      role: user.role,
      courtCode: user.courtCode
    });

  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

// 🚀 START SERVER (Render compatible)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("⚖️ Justice System Running on port", PORT);
});
