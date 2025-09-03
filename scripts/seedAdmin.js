const pool = require('../src/config/database');
const { hashPassword } = require('../src/utils/password');
require('dotenv').config({ path: './.env' }); // Asegúrate de que apunte al .env correcto

/**
 * @purpose Crea el usuario superadministrador inicial en la base de datos.
 * Este script debe ejecutarse una sola vez para configurar el sistema.
 */
const seedAdminUser = async () => {
    console.log('Starting admin user seeding...');
    const admin = {
        name: 'Super Admin',
        email: 'admin@gym.com',
        password: 'supersecret' // La contraseña que se va a hashear
    };

    try {
        // 1. Verificar si el usuario ya existe
        const [existingUsers] = await pool.query('SELECT id FROM system_users WHERE email = ?', [admin.email]);
        if (existingUsers.length > 0) {
            console.log('Admin user already exists. Seeding skipped.');
            return;
        }

        // 2. Hashear la contraseña
        const hashedPassword = await hashPassword(admin.password);

        // 3. Insertar el nuevo usuario administrador
        await pool.query(
            'INSERT INTO system_users (name, email, password, is_super_admin) VALUES (?, ?, ?, ?)',
            [admin.name, admin.email, hashedPassword, true]
        );

        console.log('✅ Admin user created successfully!');
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password: ${admin.password}`);

    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        // 4. Cerrar la conexión a la base de datos
        await pool.end();
    }
};

seedAdminUser();