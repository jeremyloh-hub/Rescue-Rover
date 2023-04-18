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

const addDogs = async (req, res) => {
  const body = {
    name: "bao",
    breed: "Pomeranian",
    gender: "male",
    hdbapproved: "true",
    dob: "2023-05-12",
    status: "true",
    personality: "energectic and playful",
    imgurl: null,
  };
  pool.connect((err, client, done) => {
    if (err) {
      console.error("Error acquiring client", err.stack);
      return res.status(500).json({ message: "Error acquiring client" });
    }
    client.query(
      `INSERT INTO dogs (name, breed, gender, hdbapproved, dob, status, personality) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [
        body.name,
        body.breed,
        body.gender,
        body.hdbapproved,
        body.dob,
        body.status,
        body.personality,
      ],
      (err, result) => {
        if (err) {
          console.error("Error executing query", err.stack);
          return res.status(500).json({ message: "Error executing query" });
        }
        res.json(result.rows);
        console.log("successfully added a dog");
        client.release();
      }
    );
  });
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

module.exports = { showDogs, addDogs, showSelectedDogs };
