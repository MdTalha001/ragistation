import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Show Registration Form
router.get("/register", (req, res) => {
    res.sendFile("register.html", { root: "./views" });
});

// Create - Add Student
router.post("/register", async (req, res) => {
    const { name, Roll, address, gender, Parents, password } = req.body;
    await pool.query("INSERT INTO students (name, roll, address, gender, parents, password) VALUES (?, ?, ?, ?, ?, ?)",
        [name, Roll, address, gender, Parents, password]);
    res.redirect("/students");
});

// Read - All Students
router.get("/students", async (req, res) => {
    const [students] = await pool.query("SELECT * FROM students");
    res.render("students", { students });
});

// Delete Student
router.get("/delete/:id", async (req, res) => {
    await pool.query("DELETE FROM students WHERE id = ?", [req.params.id]);
    res.redirect("/students");
});

// Edit Form
router.get("/edit/:id", async (req, res) => {
    const [student] = await pool.query("SELECT * FROM students WHERE id = ?", [req.params.id]);
    res.render("edit", { student: student[0] });
});

// Update
router.post("/update/:id", async (req, res) => {
    const { name, Roll, address, gender, Parents, password } = req.body;
    await pool.query("UPDATE students SET name=?, roll=?, address=?, gender=?, parents=?, password=? WHERE id = ?",
        [name, Roll, address, gender, Parents, password, req.params.id]);
    res.redirect("/students");
});

export default router;
