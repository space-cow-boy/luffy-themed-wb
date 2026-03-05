const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const csvParser = require('csv-parser');
const fastCsv = require('fast-csv');

const Team = require('../models/Team');
const Settings = require('../models/Settings');

// ─── Generate admin token from env credentials ───
function generateAdminToken() {
    const secret = process.env.ADMIN_SECRET || 'default-secret';
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin';
    return crypto.createHmac('sha256', secret).update(`${username}:${password}`).digest('hex');
}

// ─── Admin Auth Middleware ───
function requireAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized — no token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (token !== generateAdminToken()) {
        return res.status(403).json({ error: 'Forbidden — invalid credentials' });
    }
    next();
}

// Setup Multer for CSV uploads
const upload = multer({ dest: 'uploads/' });

// ═══════════════════════════════════════════════════
// PUBLIC ROUTES (no auth required)
// ═══════════════════════════════════════════════════

// GET all teams for Leaderboard UI (sorted by points)
router.get('/leaderboard', async (req, res) => {
    try {
        const teams = await Team.find().sort({ points: -1 });
        res.json(teams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET visibility setting
router.get('/settings/visibility', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({ visibility: true });
        }
        res.json({ visibility: settings.visibility });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ═══════════════════════════════════════════════════
// ADMIN AUTH
// ═══════════════════════════════════════════════════

// POST admin login — validates credentials, returns token
router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const envUsername = process.env.ADMIN_USERNAME;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (!envUsername || !envPassword) {
        return res.status(500).json({ error: 'Admin credentials not configured on server' });
    }

    if (username === envUsername && password === envPassword) {
        const token = generateAdminToken();
        return res.json({ success: true, token });
    }

    return res.status(401).json({ error: 'Invalid username or password' });
});

// ═══════════════════════════════════════════════════
// ADMIN-PROTECTED ROUTES
// ═══════════════════════════════════════════════════

// PUT update team points
router.put('/teams/:id', requireAdmin, async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(req.params.id, { points: req.body.points }, { new: true });
        res.json(team);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST update visibility setting
router.post('/settings/visibility', requireAdmin, async (req, res) => {
    try {
        const { visibility } = req.body;
        let settings = await Settings.findOne();
        if (settings) {
            settings.visibility = visibility;
            await settings.save();
        } else {
            settings = await Settings.create({ visibility });
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST parse CSV and import to DB
router.post('/csv/upload', requireAdmin, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (data) => {
            if (data['Team Name'] && data['Leader Name']) {
                results.push({
                    name: data['Team Name'],
                    leader: data['Leader Name'],
                    members: data['Participant Names'] ? data['Participant Names'].split(',').map(n => n.trim()) : [],
                    points: 0
                });
            }
        })
        .on('end', async () => {
            try {
                for (const row of results) {
                    const existingTeam = await Team.findOne({ name: row.name });
                    if (!existingTeam) {
                        await Team.create(row);
                    } else {
                        existingTeam.leader = row.leader;
                        existingTeam.members = row.members;
                        await existingTeam.save();
                    }
                }
                fs.unlinkSync(req.file.path);
                res.json({ message: 'CSV Import successful!' });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
});

// GET export CSV
router.get('/csv/export', requireAdmin, async (req, res) => {
    try {
        const teams = await Team.find();
        const data = teams.map(t => ({
            'Team Name': t.name,
            'Leader Name': t.leader,
            'Participant Names': t.members.join(','),
            'Points': t.points
        }));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="leaderboard_export.csv"');
        fastCsv.write(data, { headers: true }).pipe(res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
