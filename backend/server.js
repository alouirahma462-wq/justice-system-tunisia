const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

/* ================= SECURITY + MIDDLEWARE ================= */

app.use(express.json());

// ✅ CORS production ready
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://your-frontend.vercel.app" // 👈 بدّلها برابط React الحقيقي
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ✅ Preflight fix (مهم جدًا لـ Render + React)
app.options("*", cors());

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.status(200).json({
    status: "⚖️ Justice System Running",
    server: "OK",
    time: new Date().toISOString()
  });
});

/* ================= FAKE USERS DB ================= */

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

/* ================= AUTH MIDDLEWARE ================= */

function auth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev_secret"
    );

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* ================= DASHBOARD ================= */

app.get("/dashboard", auth, (req, res) => {
  return res.json({
    totalCases: 120,
    closedCases: 70,
    pendingCases: 50,
    role: req.user.role,
    courtCode: req.user.courtCode
  });
});

/* ================= 404 HANDLER ================= */

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ================= START SERVER (RENDER FIXED) ================= */

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("⚖️ Justice System Running on port", PORT);
});
