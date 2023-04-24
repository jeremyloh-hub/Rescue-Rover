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
      `INSERT INTO dogs (name, breed, gender, hdbapproved, dob, status, personality, imgurl) VALUES ($1, $2, $3, $4, $5, $6, $7 , $8) RETURNING *;`,
      [
        form.name,
        form.breed,
        form.gender,
        form.hdbapproved,
        form.dob,
        form.status,
        form.personality,
        form.imgurl,
      ],
      (err, result) => {
        if (err) {
          console.error("Error executing query", err.stack);
          return res.status(500).json({ message: "Error executing query" });
        }
        res.json(result.rows[0]);
        console.log("successfully added a post");
        client.release();
      }
    );
  });
};

const editDogPost = async (req, res) => {
  const { name, hdbapproved, dob, personality } = req.body;
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE dogs SET name = $1, hdbapproved = $2, dob = $3, personality = $4 WHERE id = $5",
      [name, hdbapproved, dob, personality, id]
    );
    console.log("successfully updated a dog post");

    // Execute a SELECT query to retrieve the updated row
    const result = await pool.query("SELECT * FROM dogs WHERE name = $1", [
      name,
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", error.stack);
    res.status(500).json({ message: "Error executing query" });
  }
};

const deleteDogPost = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Delete the related records from the foster table
      await client.query("DELETE FROM fosters WHERE dog_id = $1", [id]);

      // Delete the related records from the adoption table
      await client.query("DELETE FROM adoptions WHERE dog_id = $1", [id]);

      // Delete the record from the dogs table
      const result = await client.query("DELETE FROM dogs WHERE id = $1", [id]);

      await client.query("COMMIT");

      console.log("successfully deleted a dog post");

      if (result.rowCount === 0) {
        res.status(404).json({ message: "Dog not found" });
      } else {
        res.json(result.rows);
      }
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error executing query", error.stack);
      res.status(500).json({ message: "Error executing query" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error connecting to database", error.stack);
    res.status(500).json({ message: "Error connecting to database" });
  }
};

const showSelectedDogs = async (req, res) => {
  const { id } = req.params;
  pool.connect((err, client, done) => {
    if (err) {
      console.error("Error acquiring client", err.stack);
      return res.status(500).json({ message: "Error acquiring client" });
    }
    client.query(`SELECT * FROM dogs WHERE id = '${id}';`, (err, result) => {
      if (err) {
        console.error("Error executing query", err.stack);
        return res.status(500).json({ message: "Error executing query" });
      }
      res.json(result.rows[0]);
      client.release();
    });
  });
};

const getSelectedPost = async (req, res) => {
  const { id } = req.params;
  pool.connect((err, client, done) => {
    if (err) {
      console.error("Error acquiring client", err.stack);
      return res.status(500).json({ message: "Error acquiring client" });
    }
    client.query(
      `SELECT name , hdbapproved, dob , personality FROM dogs WHERE id = '${id}';`,
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
  deleteDogPost,
  getSelectedPost,
};
