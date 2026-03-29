const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

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

/* ================= ROUTES ================= */

// test route
app.get("/", (req, res) => {
  res.json({
    status: "⚖️ Justice System Running",
    server: "OK",
    time: new Date()
  });
});

// LOGIN ROUTE (IMPORTANT)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      error: "بيانات الدخول غير صحيحة"
    });
  }

  const token = "fake-jwt-token-" + Date.now();

  res.json({
    token,
    user
  });
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log("⚖️ Justice System Running on port", PORT);
});



