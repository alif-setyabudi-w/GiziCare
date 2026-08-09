import db from '../config/db.js'; // Pastikan import db benar (tanpa kurung kurawal)

export const getAllUsers = async (req, res) => {
    try {
        // Query dengan field yang ada di database (id, nama, email, password_hash, role, created_at)
        const [users] = await db.query(
            `SELECT 
                id, 
                nama as name, 
                email, 
                role, 
                created_at 
            FROM users 
            WHERE role = 'pasien'
            ORDER BY created_at DESC`
        );
        
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ 
            success: false,
            message: "Gagal mengambil data pengguna",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Hitung Total Pasien (Role = 'pasien')
        const [userResult] = await db.query(
            "SELECT COUNT(*) as total FROM users WHERE role = 'pasien'"
        );
        const totalUsers = userResult[0].total;

        res.json({
            success: true,
            stats: {
                totalUsers
            }
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Gagal mengambil data statistik" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validasi userId
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "ID user harus disediakan"
            });
        }

        // Cek apakah user ada
        const [user] = await db.query(
            "SELECT id, nama, role FROM users WHERE id = ?",
            [userId]
        );

        if (!user || user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        // Jangan biarkan delete admin/ahli_gizi, hanya bisa delete pasien biasa
        if (user[0].role !== 'pasien') {
            return res.status(403).json({
                success: false,
                message: "Hanya pasien yang dapat dihapus"
            });
        }

        // Hapus data konsultasi user terlebih dahulu (cascade delete)
        await db.query("DELETE FROM konsultasi WHERE user_id = ?", [userId]);

        // Hapus data konsumsi user
        await db.query("DELETE FROM konsumsi_makanan WHERE user_id = ?", [userId]);

        // Hapus data rekomendasi user
        await db.query("DELETE FROM rekomendasi WHERE user_id = ?", [userId]);

        // Hapus user
        await db.query("DELETE FROM users WHERE id = ?", [userId]);

        res.json({
            success: true,
            message: `User ${user[0].nama} berhasil dihapus`
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus user",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};