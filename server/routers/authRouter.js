import { Router } from "express";
import { hashPassword, comparePassword } from "../util/passwordUtil.js";
import db from "../database/connection.js";
import { sendWelcomeMail } from '../util/fakeMailUtil.js';

const router = Router();

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const cleanEmail = email?.trim().toLowerCase();
        const cleanUsername = username?.trim();

        if (!cleanUsername || !cleanEmail || !password) {
            return res.status(400).json({
                message: "Missing fields"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }

        const existing = await db.get(
            'SELECT id FROM users WHERE email = ?',
            [cleanEmail]
        );

        if (existing) {
            return res.status(400).json({
                message: "Email already in use"
            });
        }

        const hashed = await hashPassword(password);

        await db.run(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [cleanUsername, cleanEmail, hashed, 'user']
        );

        const emailResult = await sendWelcomeMail(cleanEmail, cleanUsername);

        res.status(201).json({
            message: "User created successfully",
            emailPreview: emailResult.preview
        });
    } catch (error) {
        console.error('Signup error:', error);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const cleanEmail = email?.trim().toLowerCase();

        if (!cleanEmail || !password) {
            return res.status(400).json({
                message: 'Missing fields'
            });
        }

        const user = await db.get(
            'SELECT id, username, email, password, role FROM users WHERE email = ?',
            [cleanEmail]
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        res.json({
            message: "Logged in",
            user: req.session.user
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({
            message: "Logged out"
        });
    });
});

router.get("/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            message: "Not logged in"
        });
    }

    res.json({ user: req.session.user });
});

router.get("/users", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({
                message: "Not logged in"
            });
        }

        if (req.session.user.role !== "admin") {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        const users = await db.all(
            "SELECT id, username, email, role, created_at FROM users ORDER BY id ASC"
        );

        res.json({ users });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

export default router;