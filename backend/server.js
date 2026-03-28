const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "secret";

const users = [
  { email: "clerk@test.com", password: "123", role: "CLERK" },
  { email: "pro@test.com", password: "123", role: "PROSECUTOR" },
  { email: "inspect@test.com", password: "123", role: "INSPECTION" }
];

// تسجيل دخول
app.post("/login", (req, res) => {
  const user = users.find(
    u => u.email === req.body.email && u.password === req.body.password
  );

  if (!user) return res.status(401).json({ error: "wrong credentials" });

  const token = jwt.sign(user, SECRET);

  res.json({ token, user });
});

// لوحة التحكم
app.get("/dashboard", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  const user = jwt.verify(token, SECRET);

  res.json({
    totalCases: 120,
    closedCases: 70,
    role: user.role
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
