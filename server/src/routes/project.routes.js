const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const upload = require('../middleware/upload.middleware');

// POST: Upload gambar (single file 'schematic') + Data Project
router.post('/', upload.single('schematic'), projectController.createProject);
router.get('/', projectController.getAllProjects);

module.exports = router;