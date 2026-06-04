import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Department from "./DepartmentModel.js"; // Import model Department untuk relasi

const { DataTypes } = Sequelize;

const User = db.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false, // Nama wajib diisi
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Email tidak boleh sama antar user
        validate: {
            notEmpty: true,
            isEmail: true // Validasi format email
        }
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    // Menambahkan kolom Foreign Key untuk menghubungkan ke tabel departments
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Boleh null sementara, atau set false jika wajib punya jurusan
        references: {
            model: 'departments',
            key: 'id'
        }
    }
}, {
    freezeTableName: true
});

/** * DEFINISI RELASI (Association)
 * One-to-Many: Satu Jurusan memiliki banyak Mahasiswa
 */
Department.hasMany(User, { foreignKey: 'departmentId' });
User.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

export default User;

// Sinkronisasi database
(async () => {
    await db.sync();
})();