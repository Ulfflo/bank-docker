import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bank",
  port: 3307,
});

// help function to make code look nicer
async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// Generera engångslösenord
function generateOTP() {
  // Generera en sexsiffrig numerisk OTP
  const token = Math.floor(100000 + Math.random() * 900000);
  return token.toString();
}

// routes/endpoints
app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  // Kryptera lösenordet innan det hamnar i DB
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    // Skapa användaren i users-tabellen
    const userResult = await query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );
    const userId = userResult.insertId; // Få det nya användar-ID:t

    // Skapa ett konto för användaren i accounts-tabellen
    await query(
      "INSERT INTO accounts (user_id, balance) VALUES (?, ?)",
      [userId, 0] // Skapa med 0 kr som saldo
    );

    res.status(201).send("User and account created");
  } catch (error) {
    console.error("Error creating user and account", error);
    res.status(500).send("Error creating user and account");
  }
});

// Endpoint to handle user login and generate tokens
app.post("/sessions", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user from the database
    const result = await query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const user = result[0];

    if (!user) {
      return res.status(401).send("Invalid username or password");
    }

    // Check if passwords match
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send("Invalid username or password");
    }

    // Generate OTP/token
    const token = generateOTP();

    // Insert login info into the sessions table with user_id
    const loginResult = await query(
      "INSERT INTO sessions (user_id, token) VALUES (?, ?)",
      [user.id, token]
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Error during login");
  }
});

// Route to get initial balance after login
app.get("/me/accounts/balance", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header

    // Validate token and get user ID
    const session = await query("SELECT * FROM sessions WHERE token = ?", [
      token,
    ]);
    if (!session || session.length === 0) {
      return res.status(401).send("Invalid session token");
    }

    const userId = session[0].user_id;

    // Fetch balance from database
    const accountResult = await query(
      "SELECT * FROM accounts WHERE user_id = ?",
      [userId]
    );
    const account = accountResult[0];

    if (!account) {
      return res.status(404).send("Account not found");
    }

    const balance = account.balance;

    res.status(200).json({ balance }); // Send balance as JSON response
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).send("Error fetching balance");
  }
});

app.post("/me/accounts/transactions", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
  const session = await query("SELECT * FROM sessions WHERE token = ?", [
    token,
  ]);

  if (!session || session.length === 0) {
    return res.status(401).send("Invalid session token");
  }

  const userId = session[0].user_id;
  const amount = req.body.amount;

  try {
    // Fetch current balance from accounts
    const accountResult = await query(
      "SELECT * FROM accounts WHERE user_id = ?",
      [userId]
    );
    const account = accountResult[0];

    if (!account) {
      return res.status(404).send("Account not found");
    }

    const currentBalance = account.balance;
    const newBalance = currentBalance + amount;

    // Update balance in the accounts table
    await query("UPDATE accounts SET balance = ? WHERE user_id = ?", [
      newBalance,
      userId,
    ]);

    res.status(200).json({ newBalance });
  } catch (error) {
    console.error("Error updating account balance:", error);
    res.status(500).send("Error updating account balance");
  }
});

// Starta servern
app.listen(port, () => {
  console.log(`Bankens backend körs på http://localhost:${port}`);
});
