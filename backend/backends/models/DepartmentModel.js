import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Department = db.define('departments', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    // PERBAIKAN UTAMA: Matikan timestamps agar Sequelize tidak mencari createdAt/updatedAt
    timestamps: false 
});

export default Department;

// Fungsi ini memastikan tabel tersinkronisasi dengan database
(async () => {
    try {
        await db.sync();
        console.log("Department Table Synced!");
    } catch (error) {
        console.error("Error syncing Department table:", error);
    }
})();