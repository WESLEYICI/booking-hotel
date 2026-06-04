import Department from "../models/DepartmentModel.js";

/**
 * Mengambil semua data jurusan
 * Digunakan untuk dropdown di Frontend (Add & Edit User)
 */
export const getDepartments = async (req, res) => {
    try {
        const response = await Department.findAll({
            // Mengurutkan nama jurusan berdasarkan abjad (A-Z) agar rapi di dropdown
            order: [['name', 'ASC']]
        });

        // Validasi: Jika tabel ada tapi isinya kosong
        if (response.length === 0) {
            return res.status(200).json([]); // Tetap kirim array kosong agar frontend tidak crash
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error GetDepartments:", error.message);
        res.status(500).json({ 
            msg: "Gagal mengambil data jurusan dari server",
            error: error.message 
        });
    }
}