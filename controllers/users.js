const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const pool = require("../config/database");
const yup = require("yup");

const userSchema = yup.object({
  name: yup.string().required(),
  userid: yup.string().required().min(3),
  password: yup.string().required().min(3),
  email: yup.string().required().email(),
  age: yup.number().positive().integer(),
  residential: yup.string().required(),
});

const loginSchema = yup.object({
  userid: yup.string().required().min(3),
  password: yup.string().required().min(3),
});

const checkavailability = async (req, res) => {
  const { userid, email } = req.query;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE userid='${userid}' OR email='${email}'`
    );
    const checkuser = rows[0];
    res.status(200).json(checkuser || null);
  } catch (error) {
    res.status(500).json(error);
  }
};

const create = async (req, res) => {
  const validatedData = await userSchema.validate(req.body);
  const { name, userid, password, email, age, residential } = validatedData;
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const { rows } = await pool.query(
      "INSERT INTO users(name, userid, password, email, age, residential) VALUES($1, $2, $3 , $4 , $5 , $6) RETURNING *",
      [name, userid, hashedPassword, email, age, residential]
    );
    const newUser = rows[0];
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

const login = async (req, res) => {
  try {
    const validatedData = await loginSchema.validate(req.body);
    const { userid, password } = validatedData;

    const { rows } = await pool.query("SELECT * FROM users WHERE userid = $1", [
      userid,
    ]);
    const user = rows[0];
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }
    const payload = { user };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
    res.status(200).json({ token, user });
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.status(400).json({ message: error.errors.join(", ") });
    }
    res.status(500).json({ message: error.message });
  }
};

const isAuth = async (req, res, next) => {
  const token = req.headers.authorization.replace(/"/g, "").split(" ")[1];
  console.log("token in authcontroller", token);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { rows } = await pool.query(
        "SELECT * FROM users WHERE userid = $1",
        [decoded.user.userid]
      );

      if (rows.length > 0) {
        req.user = decoded.user;
        next();
      } else {
        res.status(403).send("Forbidden");
      }
    } catch (error) {
      res.status(401).send("Invalid token");
    }
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = {
  isAuth,
  create,
  login,
  checkavailability,
};
