const prisma = require('../config/db');
const fs = require('fs'); // Import FS untuk hapus file
const path = require('path');

// Helper untuk hapus file fisik
const deleteFile = (filePathUrl) => {
  if (!filePathUrl) return;
  // Ubah URL "/uploads/schematic/file.jpg" menjadi path fisik sistem
  // Sesuaikan nama folder 'schematic' atau 'schematics' dengan middleware Anda
  const fileName = filePathUrl.split('/').pop();
  const filePath = path.join(__dirname, '../../public/uploads/schematic', fileName);
  
  fs.unlink(filePath, (err) => {
    if (err) console.error("Gagal menghapus file lama:", err);
    else console.log("File lama terhapus:", fileName);
  });
};

// ==========================================
// 1. CREATE PROJECT
// ==========================================
exports.createProject = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const { title, description, githubUrl, componentIds } = req.body;
    
    // URL file (Sesuaikan folder 'schematic' dengan middleware upload Anda)
    const schematicUrl = req.file ? `/uploads/schematic/${req.file.filename}` : null;

    // Logika connect components (Data sudah berupa Array Number berkat parseFormBody di route)
    let componentsToConnect = [];
    if (componentIds && Array.isArray(componentIds) && componentIds.length > 0) {
        componentsToConnect = componentIds.map(id => ({
          component: { connect: { id: id } }
        }));
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        githubUrl,
        schematicUrl,
        authorId: userId,
        components: {
          create: componentsToConnect 
        }
      },
      include: { components: { include: { component: true } } }
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error); 
  }
};

// ==========================================
// 2. GET ALL PROJECTS
// ==========================================
exports.getAllProjects = async (req, res, next) => {
    try {
        const { search = '', page = 1, limit = 10, componentId, sortBy = 'latest' } = req.query;
        
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
    
        const whereClause = {
          title: { contains: search }
        };
    
        if (componentId) {
          whereClause.components = {
            some: { componentId: parseInt(componentId) }
          };
        }
    
        let orderBy = { createdAt: 'desc' };
        if (sortBy === 'popular') {
            orderBy = { views: 'desc' };
        } else if (sortBy === 'title') {
            orderBy = { title: 'asc' }; 
        }
    
        const projects = await prisma.project.findMany({
          where: whereClause,
          skip: skip,
          take: limitNum,
          include: { 
            author: { select: { name: true, email: true } },
            components: { include: { component: true } } 
          },
          orderBy: orderBy
        });
    
        const totalData = await prisma.project.count({ where: whereClause });
    
        res.json({
          success: true,
          data: projects,
          pagination: {
            totalData,
            totalPage: Math.ceil(totalData / limitNum),
            currentPage: pageNum,
            limit: limitNum
          }
        });
      } catch (error) {
        next(error);
      }
};

// ==========================================
// 3. GET PROJECT BY ID
// ==========================================
exports.getProjectById = async (req, res, next) => {
    try {
        const { id } = req.params;
    
        const project = await prisma.project.update({
          where: { id: parseInt(id) },
          data: { 
              views: { increment: 1 } 
          }, 
          include: { 
            author: { select: { id: true, name: true, email: true, jobTitle: true, bio: true } },
            components: { include: { component: true } } 
          }
        });
    
        res.json({ success: true, data: project });
    
      } catch (error) {
        if (error.code === 'P2025') { 
            const err = new Error("Project tidak ditemukan");
            err.statusCode = 404;
            return next(err);
        }
        next(error);
      }
};

// ==========================================
// 4. UPDATE PROJECT
// ==========================================
exports.updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, githubUrl, componentIds } = req.body;
        const userId = req.user.id; 
    
        const existingProject = await prisma.project.findUnique({ where: { id: parseInt(id) } });
    
        if (!existingProject) {
            const error = new Error("Project tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }
    
        if (existingProject.authorId !== userId && req.user.role !== 'ADMIN') {
            const error = new Error("Forbidden: Anda bukan pemilik proyek ini");
            error.statusCode = 403;
            throw error;
        }
    
        // Logic Update Components
        let componentsUpdate = {};
        if (componentIds && Array.isArray(componentIds)) {
             componentsUpdate = {
                components: {
                    deleteMany: {}, 
                    create: componentIds.map(cid => ({ component: { connect: { id: cid } } })) 
                }
            };
        }
    
        // Logic Update File Gambar
        let schematicUrl = existingProject.schematicUrl;
        
        // Jika user upload file baru
        if (req.file) {
            // 1. Hapus file lama fisik
            if (existingProject.schematicUrl) {
                deleteFile(existingProject.schematicUrl);
            }
            // 2. Set URL baru
            schematicUrl = `/uploads/schematic/${req.file.filename}`;
        }
    
        const updatedProject = await prisma.project.update({
          where: { id: parseInt(id) },
          data: {
            title,
            description,
            githubUrl,
            schematicUrl,
            ...componentsUpdate
          },
          include: { components: { include: { component: true } } }
        });
    
        res.json({ success: true, message: "Update berhasil", data: updatedProject });
    
      } catch (error) {
        next(error);
      }
};

// ==========================================
// 5. DELETE PROJECT
// ==========================================
exports.deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; 
    
        const existingProject = await prisma.project.findUnique({ where: { id: parseInt(id) } });
    
        if (!existingProject) {
            const error = new Error("Project tidak ditemukan");
            error.statusCode = 404;
            throw error;
        }
    
        if (existingProject.authorId !== userId && req.user.role !== 'ADMIN') {
            const error = new Error("Forbidden: Anda tidak berhak menghapus proyek ini");
            error.statusCode = 403;
            throw error;
        }

        // Hapus file fisik gambarnya dulu sebelum hapus data di DB
        if (existingProject.schematicUrl) {
            deleteFile(existingProject.schematicUrl);
        }
    
        await prisma.project.delete({
          where: { id: parseInt(id) }
        });
    
        res.status(204).send(); 
      } catch (error) {
        next(error);
      }
};