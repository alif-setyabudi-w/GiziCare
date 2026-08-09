import db from './src/config/db.js';

const fixData = async () => {
    try {
        console.log('🔧 Fixing database data...\n');
        
        // Fix role kosong menjadi ahli_gizi (untuk test user petugas)
        console.log('⏳ Fixing empty role to ahli_gizi...');
        const [result] = await db.query(`
            UPDATE users 
            SET role = 'ahli_gizi' 
            WHERE role = '' OR role IS NULL
        `);
        console.log(`✅ ${result.affectedRows} rows fixed`);
        
        // Insert test users
        console.log('\n⏳ Creating test users...');
        
        // Delete existing test users
        await db.query(`DELETE FROM users WHERE email IN ('test-pasien@gmail.com', 'test-ahli@gmail.com')`);
        
        // Insert new test users
        await db.query(`
            INSERT INTO users (nama, email, password_hash, role, is_verified) VALUES 
            ('Test Pasien', 'test-pasien@gmail.com', '$2b$10$test', 'pasien', 1),
            ('Test Ahli Gizi', 'test-ahli@gmail.com', '$2b$10$test', 'ahli_gizi', 1)
        `);
        console.log('✅ Test users created');
        
        // Check final data
        const [users] = await db.query('SELECT id, nama, email, role FROM users ORDER BY id');
        console.log('\n📊 Final data:');
        console.table(users);
        
        console.log('\n✅ Database fixed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

fixData();
