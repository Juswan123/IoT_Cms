const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');
const authMiddleware = require('../middleware/auth.middleware');

// Public Access (Siapapun bisa lihat list komponen)
router.get('/', componentController.getAllComponents);
router.get('/:id', componentController.getComponentById);

// Protected Access (Hanya user login yang bisa tambah/edit)
router.post('/', authMiddleware, componentController.createComponent);
router.put('/:id', authMiddleware, componentController.updateComponent);
router.delete('/:id', authMiddleware, componentController.deleteComponent);

module.exports = router;