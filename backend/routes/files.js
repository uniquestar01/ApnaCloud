const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const db = require('../config/db');
const auth = require('../middleware/auth');
const logActivity = require('../utils/activityLogger');
require('dotenv').config();

const STORAGE_PATH = process.env.STORAGE_PATH || '/home/sakshi/apnacloud-storage';

// Ensure storage path exists recursively
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH, { recursive: true });
}


// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const parentId = req.body.parentId || 0;
    let uploadPath = STORAGE_PATH;
    
    if (parentId && parentId !== '0') {
      const parent = db.prepare('SELECT path FROM files WHERE id = ?').get(parentId);
      if (parent) {
        uploadPath = path.join(STORAGE_PATH, parent.path);
      }
    }
    
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// List files/folders
router.get('/', auth, (req, res) => {
  const parentId = req.query.parentId || 0;
  const files = db.prepare('SELECT * FROM files WHERE owner_id = ? AND parent_id = ?').all(req.user.id, parentId);
  res.json(files);
});

// Create Folder
router.post('/folder/create', auth, async (req, res) => {
  const { name, parentId } = req.body;
  if (!name) return res.status(400).json({ error: 'Folder name is required' });

  let parentPath = '';
  if (parentId && parentId !== 0) {
    const parent = db.prepare('SELECT path FROM files WHERE id = ?').get(parentId);
    if (parent) parentPath = parent.path;
  }

  const relativePath = path.join(parentPath, name);
  const fullPath = path.join(STORAGE_PATH, relativePath);

  try {
    if (await fs.exists(fullPath)) {
      return res.status(400).json({ error: 'Folder already exists' });
    }

    await fs.mkdir(fullPath);
    const stmt = db.prepare('INSERT INTO files (name, path, is_folder, owner_id, parent_id) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(name, relativePath, 1, req.user.id, parentId || 0);
    
    logActivity(req.user.id, 'FOLDER_CREATE', `Created folder: ${name}`);
    res.json({ id: info.lastInsertRowid, name, is_folder: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload Multiple Files
router.post('/upload', auth, upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
  const { parentId } = req.body;
  
  let parentPath = '';
  if (parentId && parentId !== '0') {
    const parent = db.prepare('SELECT path FROM files WHERE id = ?').get(parentId);
    if (parent) parentPath = parent.path;
  }

  const results = [];
  try {
    const stmt = db.prepare('INSERT INTO files (name, path, size, type, is_folder, owner_id, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
    
    for (const file of req.files) {
      const relativePath = path.join(parentPath, file.originalname);
      const info = stmt.run(file.originalname, relativePath, file.size, file.mimetype, 0, req.user.id, parentId || 0);
      results.push({ id: info.lastInsertRowid, name: file.originalname });
      logActivity(req.user.id, 'FILE_UPLOAD', `Uploaded file: ${file.originalname}`);
    }
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rename File/Folder
router.put('/rename/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;
  if (!newName) return res.status(400).json({ error: 'New name is required' });

  const file = db.prepare('SELECT * FROM files WHERE id = ? AND owner_id = ?').get(id, req.user.id);
  if (!file) return res.status(404).json({ error: 'Item not found' });

  const parentPath = path.dirname(file.path);
  const newRelativePath = path.join(parentPath === '.' ? '' : parentPath, newName);
  const oldFullPath = path.join(STORAGE_PATH, file.path);
  const newFullPath = path.join(STORAGE_PATH, newRelativePath);

  try {
    if (await fs.exists(newFullPath)) {
      return res.status(400).json({ error: 'An item with this name already exists' });
    }

    await fs.move(oldFullPath, newFullPath);
    db.prepare('UPDATE files SET name = ?, path = ? WHERE id = ?').run(newName, newRelativePath, id);
    
    // If folder, update paths of all children
    if (file.is_folder) {
      const children = db.prepare('SELECT * FROM files WHERE path LIKE ?').all(file.path + '/%');
      const updateStmt = db.prepare('UPDATE files SET path = ? WHERE id = ?');
      for (const child of children) {
          const updatedChildPath = child.path.replace(file.path, newRelativePath);
          updateStmt.run(updatedChildPath, child.id);
      }
    }

    logActivity(req.user.id, 'RENAME', `Renamed ${file.name} to ${newName}`);
    res.json({ message: 'Renamed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rename File/Folder endpoint is listed as /rename/:id in requirements
// But usually it is /files/rename/:id. I will keep it consistent with the router base.
// The user specified: PUT /rename/:id in BACKEND FEATURES list.
// However, my router is mounted at /api/files. So it will be /api/files/rename/:id.

// Preview File
router.get('/preview/:id', auth, async (req, res) => {

  const { id } = req.params;
  const file = db.prepare('SELECT * FROM files WHERE id = ? AND owner_id = ?').get(id, req.user.id);
  if (!file) return res.status(404).json({ error: 'File not found' });

  const fullPath = path.join(STORAGE_PATH, file.path);
  if (await fs.exists(fullPath)) {
    res.sendFile(fullPath);
  } else {
    res.status(404).json({ error: 'File not found on disk' });
  }
});

module.exports = router;
