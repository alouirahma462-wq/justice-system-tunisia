const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

/* ================= MIDDLEWARE ================= */

// 🔥 مهم: CORS مفتوح بالكامل للتجربة
app.use(cors());
app.use(express.json());

/* ================= USERS ================= */

const users = [
  {
    id: 1,
    email: "admin@court.tn",
    password: "1234",
    role: "prosecutor",
    courtCode: 12
  }
];

/* ================= TEST ================= */

app.get("/", (req, res) => {
  res.json({
    status: "⚖️ Justice System Running",
    server: "OK",
    time: new Date().toISOString()
  });
});

/* ================= LOGIN ================= */

app.post("/login", (req, res) => {
  console.log("BODY RECEIVED:", req.body); // 🔥 مهم للتشخيص

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      error: "missing credentials"
    });
  }

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      error: "wrong credentials"
    });
  }

  const token = "token-" + Date.now();

  return res.json({
    token,
    user
  });
});

/* ================= START ================= */

app.listen(PORT, "0.0.0.0", () => {
  console.log("⚖️ Justice System Running on port", PORT);
});




