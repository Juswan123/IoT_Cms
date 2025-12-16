const prisma = require('../config/db');

// ==========================================
// 1. GET ALL COMPONENTS (Public)
// ==========================================
exports.getAllComponents = async (req, res, next) => {
  try {
    const { search = '' } = req.query;

    const components = await prisma.component.findMany({
      where: {
        name: {
          contains: search // Bisa cari nama komponen
        }
      },
      orderBy: {
        name: 'asc' // Urutkan sesuai abjad
      }
    });

    res.json({ success: true, data: components });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. GET COMPONENT BY ID (Detail)
// ==========================================
exports.getComponentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const component = await prisma.component.findUnique({
      where: { id: parseInt(id) },
      include: {
        projects: { select: { project: true } } // Lihat project apa saja yang pakai komponen ini
      }
    });

    if (!component) {
      const error = new Error("Komponen tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, data: component });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. CREATE COMPONENT (Admin/User)
// ==========================================
exports.createComponent = async (req, res, next) => {
  try {
    const { name, description, type, datasheetUrl } = req.body;

    // Cek Duplikat
    const existing = await prisma.component.findFirst({
        where: { name: name }
    });

    if (existing) {
        return res.status(400).json({ message: `Komponen '${name}' sudah ada di database.` });
    }

    const newComponent = await prisma.component.create({
      data: {
        name,
        description,
        type: type || 'Hardware', // Default type jika kosong
        datasheetUrl
      }
    });

    res.status(201).json({ success: true, message: "Komponen berhasil ditambahkan", data: newComponent });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. UPDATE COMPONENT
// ==========================================
exports.updateComponent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, type, datasheetUrl } = req.body;

    const updatedComponent = await prisma.component.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        type,
        datasheetUrl
      }
    });

    res.json({ success: true, message: "Update berhasil", data: updatedComponent });
  } catch (error) {
    if (error.code === 'P2025') {
        return res.status(404).json({ message: "Komponen tidak ditemukan" });
    }
    next(error);
  }
};

// ==========================================
// 5. DELETE COMPONENT
// ==========================================
exports.deleteComponent = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.component.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: "Komponen berhasil dihapus" });
  } catch (error) {
    if (error.code === 'P2025') {
        return res.status(404).json({ message: "Komponen tidak ditemukan" });
    }
    // Handle jika komponen sedang dipakai oleh project (Constraint Error)
    if (error.code === 'P2003') {
        return res.status(400).json({ message: "Gagal hapus: Komponen ini sedang digunakan di Project lain." });
    }
    next(error);
  }
};