const prisma = require('../config/db');

exports.createProject = async (req, res) => {
  try {
    const { title, description, githubUrl, authorId } = req.body;
    const schematicUrl = req.file ? `/uploads/schematics/${req.file.filename}` : null;

    // Validasi sederhana
    if (!title || !githubUrl) {
      return res.status(400).json({ message: "Judul dan Link GitHub wajib diisi" });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        githubUrl,
        schematicUrl,
        authorId: parseInt(authorId) || 1, // Default user ID 1 (karena belum ada login)
      },
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { author: true }
    });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};