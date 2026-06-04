import express from "express";
import { 
    getUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser 
} from "../controllers/UserController.js";
// 1. Import DepartmentController yang baru saja dibuat
import { getDepartments } from "../controllers/DepartmentController.js"; 

const router = express.Router();

// --- Rute untuk Tabel Mahasiswa ---
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// --- Rute untuk Tabel Jurusan ---
// 2. Tambahkan rute ini agar dropdown di Frontend berfungsi
router.get('/departments', getDepartments); 

export default router;