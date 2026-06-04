import express from "express";
import cors from "cors";
import db from "./config/database.js"; // Import koneksi database
import UserRoute from "./routes/UserRoute.js";

// Import model agar Sequelize tahu tabel apa yang harus dibuat/sinkron
import User from "./models/UserModel.js";
import Department from "./models/DepartmentModel.js";

const app = express();

/**
 * Sinkronisasi Database
 * Kode ini akan otomatis membuat tabel di MySQL jika belum ada
 * dan memastikan relasi antar tabel terjalin.
 */
(async () => {
    try {
        await db.authenticate();
        console.log('Database Connected...');
        
        // .sync() akan membuat tabel jika belum ada. 
        // Jangan gunakan {force: true} di production karena akan menghapus data lama!
        await db.sync(); 
    } catch (error) {
        console.error('Connection error:', error);
    }
})();

app.use(cors());
app.use(express.json());
app.use(UserRoute);

app.listen(5000, () => console.log('Server up euy... running on port 5000'));