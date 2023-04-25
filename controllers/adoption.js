const pool = require("../config/database");
const yup = require("yup");

const AdoptionFormSchema = yup.object({
  dog_id: yup.number().required(),
  user_id: yup.number().required(),
  history: yup.boolean().required(),
  activity_level: yup.string().required(),
  existing_pet: yup.string().required(),
  reason: yup.string().required(),
});

const addAdoption = async (req, res) => {
  const validatedData = await AdoptionFormSchema.validate(req.body);
  const { dog_id, user_id, history, activity_level, existing_pet, reason } =
    validatedData;
  try {
    const { rows } = await pool.query(
      "INSERT INTO adoptions(dog_id, user_id, history, activity_level, existing_pet, reason) VALUES($1, $2, $3 , $4 , $5 , $6) RETURNING *",
      [dog_id, user_id, history, activity_level, existing_pet, reason]
    );
    const newAdoptionForm = rows[0];
    res.status(201).json(newAdoptionForm);
  } catch (error) {
    res.status(500).json(error);
  }
};

const checkAdoptionForm = async (req, res) => {
  const { userid } = req.query;
  console.log(userid);
  try {
    const { rows } = await pool.query(
      `SELECT * FROM adoptions WHERE user_id=${userid} AND status='processing'`
    );
    const checkuser = rows[0];
    res.status(200).json(checkuser || null);
  } catch (error) {
    res.status(500).json(error);
  }
};

const showAdoptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const client = await pool.connect();
    const result = await client.query(
      `SELECT u.name AS user_name, d.name AS dog_name, a.status 
       FROM users u 
       LEFT JOIN adoptions a ON u.id = a.user_id 
       LEFT JOIN dogs d ON a.dog_id = d.id 
       WHERE a.user_id = $1;`,
      [id]
    );
    res.json(result.rows);
    console.log(result.rows);
    client.release();
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ message: "Error executing query" });
  }
};

module.exports = { addAdoption, checkAdoptionForm, showAdoptionStatus };
