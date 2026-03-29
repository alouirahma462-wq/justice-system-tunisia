const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// 🟢 اختبار السيرفر
app.get("/", (req, res) => {
  res.json({ status: "Justice System Running" });
});

// 👤 مستخدم تجريبي (مرحلة أولى فقط)
const users = [
  {
    id: 1,
    email: "admin@court.tn",
    password: "1234",
    role: "prosecutor",
    courtCode: 12
  }
];

// 🔐 تسجيل الدخول
app.post("/login", (req, res) => {
  const { email, password } = req.body;

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

  res.json({ token, user });
});

// 📊 داشبورد بسيط
app.get("/dashboard", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");

    res.json({
      totalCases: 120,
      closedCases: 70,
      role: user.role
    });

  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// 🚀 تشغيل السيرفر
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Justice System Running on port", PORT);
});

