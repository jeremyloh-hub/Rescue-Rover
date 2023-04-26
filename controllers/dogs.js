const pool = require("../config/database");
const yup = require("yup");

const DogSchema = yup.object({
  name: yup.string().required(),
  breed: yup.string().required(),
  gender: yup.string().required(),
  hdbapproved: yup.boolean().required(),
  dob: yup.date().required(),
  status: yup.boolean().required(),
  personality: yup.string().required(),
  imgurl: yup.string().required(),
});

const DogPostSchema = yup.object({
  name: yup.string().required(),
  hdbapproved: yup.boolean().required(),
  dob: yup.date().required(),
  personality: yup.string().required(),
});

const showDogs = async (req, res) => {
  const { hdbapproved } = req.query;

  let query = "SELECT * FROM dogs";

  if (hdbapproved) {
    query += ` WHERE hdbapproved=${hdbapproved}`;
  }

  pool.connect((err, client, done) => {
    if (err) {
      console.error("Error acquiring client", err.stack);
      return res.status(500).json({ message: "Error acquiring client" });
    }
    client.query(query, (err, result) => {
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
  const validatedData = await DogSchema.validate(req.body);
  const form = validatedData;
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
  const validatedData = await DogPostSchema.validate(req.body);
  const { name, hdbapproved, dob, personality } = validatedData;
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE dogs SET name = $1, hdbapproved = $2, dob = $3, personality = $4 WHERE id = $5 RETURNING *",
      [name, hdbapproved, dob, personality, id]
    );
    console.log("successfully updated a dog post");

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

      await client.query("DELETE FROM fosters WHERE dog_id = $1", [id]);

      await client.query("DELETE FROM adoptions WHERE dog_id = $1", [id]);

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
  const { dogName } = req.params;
  pool.connect((err, client, done) => {
    if (err) {
      console.error("Error acquiring client", err.stack);
      return res.status(500).json({ message: "Error acquiring client" });
    }
    client.query(
      `SELECT * FROM dogs WHERE name = '${dogName}';`,
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
