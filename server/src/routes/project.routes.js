const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const componentController = require('../controllers/componentController');
const upload = require('../middleware/upload.middleware');
const authMiddleware = require('../middleware/auth.middleware');

// IMPORT VALIDATION (Ambil keduanya)
const validate = require('../middleware/validation.middleware');
const { createProjectSchema, updateProjectSchema } = require('../validators/project.schema');

// --- MIDDLEWARE BANTUAN ---
const parseFormBody = (req, res, next) => {
  // 1. Inject authorId dari Token
  if (req.user) {
    req.body.authorId = req.user.id;
  }

  // 2. Fix componentIds
  if (req.body.componentIds) {
    if (typeof req.body.componentIds === 'string') {
       // Jika string kosong (""), jadikan array kosong biar tidak error NaN
       if (!req.body.componentIds.trim()) {
          req.body.componentIds = [];
       } else {
          req.body.componentIds = req.body.componentIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
       }
    } 
    else if (Array.isArray(req.body.componentIds)) {
       req.body.componentIds = req.body.componentIds.map(id => parseInt(id)).filter(id => !isNaN(id));
    }
  }

  next();
};

// Route Component
router.get('/components', componentController.getAllComponents); 

// Route Project Public
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

// Route Project Protected
// CREATE: Pakai createProjectSchema
router.post('/', 
  authMiddleware,               
  upload.single('schematic'),   
  parseFormBody,                
  validate(createProjectSchema), // Validasi KETAT
  projectController.createProject 
);

// UPDATE: Pakai updateProjectSchema
router.put('/:id', 
  authMiddleware, 
  upload.single('schematic'), 
  parseFormBody,                
  validate(updateProjectSchema), // Validasi LONGGAR (Fix Error 400)
  projectController.updateProject
);

router.delete('/:id', authMiddleware, projectController.deleteProject);

module.exports = router;