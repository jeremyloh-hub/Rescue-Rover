const pool = require("../config/database");

const showDogs = async (req, res) => {
  pool.connect((err, client, done) => {
    if (err) {
      console.error("Error acquiring client", err.stack);
      return res.status(500).json({ message: "Error acquiring client" });
    }
    client.query("SELECT * FROM dogs", (err, result) => {
      if (err) {
        console.error("Error executing query", err.stack);
        return res.status(500).json({ message: "Error executing query" });
      }
      res.json(result.rows);
      client.release();
    });
  });
};

const addDogPost = async (req, res) => {
  const form = req.body;
  pool.connect((err, client, done) => {
    if (err) {
      console.error("Error acquiring client", err.stack);
      return res.status(500).json({ message: "Error acquiring client" });
    }
    client.query(
      `INSERT INTO dogs (name, breed, gender, hdbapproved, dob, status, personality) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [
        form.name,
        form.breed,
        form.gender,
        form.hdbapproved,
        form.dob,
        form.status,
        form.personality,
      ],
      (err, result) => {
        if (err) {
          console.error("Error executing query", err.stack);
          return res.status(500).json({ message: "Error executing query" });
        }
        res.json(result.rows);
        console.log("successfully added a post");
        client.release();
      }
    );
  });
};

const editDogPost = async (req, res) => {
  const { name, hdbapproved, dob, personality } = req.body;
  const { dogID } = req.query;
  try {
    const result = await pool.query(
      `UPDATE dogs SET name = '${name}', hdbapproved = ${hdbapproved}, dob = '${dob}', personality = '${personality}' WHERE id = ${dogID}`
    );
    console.log("successfully updated a dog post");
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query", error.stack);
    res.status(500).json({ message: "Error executing query" });
  }
};

const showSelectedDogs = async (req, res) => {
  const name = req.params.dogName;
  pool.connect((err, client, done) => {
    if (err) {
      console.error("Error acquiring client", err.stack);
      return res.status(500).json({ message: "Error acquiring client" });
    }
    client.query(
      `SELECT * FROM dogs WHERE name = '${name}';`,
      (err, result) => {
        if (err) {
          console.error("Error executing query", err.stack);
          return res.status(500).json({ message: "Error executing query" });
        }
        res.json(result.rows[0]);
        client.release();
      }
    );
  });
};

module.exports = {
  showDogs,
  addDogPost,
  showSelectedDogs,
  editDogPost,
};
