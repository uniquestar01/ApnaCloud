const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const shareRoutes = require('./routes/sharing');
const systemRoutes = require('./routes/system');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin images/videos
}));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));


// Static files for storage (if needed) - Security note: Direct access is restricted by route logic
// app.use('/storage', express.static(process.env.STORAGE_PATH));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/system', systemRoutes);

const fsExtra = require('fs-extra');
const multer = require('multer');

// Ensure local storage exists
const LOCAL_STORAGE = path.join(__dirname, 'storage');
if (!fsExtra.existsSync(LOCAL_STORAGE)) {
  fsExtra.mkdirSync(LOCAL_STORAGE, { recursive: true });
}

const upload = multer({ dest: LOCAL_STORAGE });

app.get('/files', auth, (req, res) => {
  const files = db.prepare('SELECT * FROM files WHERE owner_id = ?').all(req.user.id);
  res.json(files);
});

app.post('/upload', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const finalPath = path.join(LOCAL_STORAGE, req.file.originalname);
  
  try {
    fsExtra.moveSync(req.file.path, finalPath, { overwrite: true });
    db.prepare('INSERT INTO files (name, path, size, type, is_folder, owner_id, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(req.file.originalname, req.file.originalname, req.file.size, req.file.mimetype, 0, req.user.id, 0);
    res.json({ message: 'Uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/download/:name', auth, (req, res) => {
    const file = db.prepare('SELECT * FROM files WHERE name = ? AND owner_id = ?').get(req.params.name, req.user.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    const fullPath = path.join(LOCAL_STORAGE, file.path);
    if (fsExtra.existsSync(fullPath)) {
        res.download(fullPath, file.name);
    } else {
        res.status(404).json({ error: 'File missing on disk' });
    }
});

app.delete('/delete/:name', auth, async (req, res) => {
  const file = db.prepare('SELECT * FROM files WHERE name = ? AND owner_id = ?').get(req.params.name, req.user.id);
  if (!file) return res.status(404).json({ error: 'File not found' });
  try {
    const fullPath = path.join(LOCAL_STORAGE, file.path);
    if (await fsExtra.exists(fullPath)) {
      await fsExtra.remove(fullPath);
    }
    db.prepare('DELETE FROM files WHERE id = ?').run(file.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ApnaCloud is Online' }));


const seedAdmin = () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@apnacloud.me';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  
  const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);
  if (!existing) {
    const hashedPassword = bcrypt.hashSync(adminPass, 10);
    db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)')
      .run(adminEmail, hashedPassword, 'admin');
    console.log(`[Admin Seed] Admin user created: ${adminEmail} / ${adminPass}`);
  }
};

app.listen(PORT, '0.0.0.0', async () => {
  seedAdmin();
  // '0.0.0.0' allows access from any device on your local network/WIFI
  console.log(`[ApnaCloud] Server running on port ${PORT} (Network Access Enabled)`);
  console.log(`[ApnaCloud] Local URL: http://10.150.250.115:${PORT}`);
  
  // Automate Ngrok if Token is present
  if (process.env.NGROK_AUTH_TOKEN) {
    try {
        const ngrok = require('ngrok');
        await ngrok.authtoken(process.env.NGROK_AUTH_TOKEN);
        const url = await ngrok.connect({
            addr: PORT,
            domain: "rodolfo-daughterly-darci.ngrok-free.dev" // Custom domain provided by user
        });
        console.log(`[ApnaCloud] 🌐 Tunnel Securely Active: ${url}`);
        console.log(`[ApnaCloud] Dashboard: ${url}/api/system/stats`);
    } catch (err) {
        console.error(`[ApnaCloud] ⚠️ Ngrok failed to start: ${err.message}`);
    }
  }
});

