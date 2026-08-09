import db from './src/config/db.js';

const runMigration = async () => {
    try {
        console.log('🔄 Starting role migration...\n');
        
        // 1. Cek data sebelum migration
        const [before] = await db.query('SELECT role, COUNT(*) as count FROM users GROUP BY role');
        console.log('📊 Data sebelum migration:');
        console.table(before);
        
        // 2. Jalankan migration
        console.log('\n⏳ Modifying enum...');
        await db.query(`ALTER TABLE users MODIFY role enum('ahli_gizi','pasien') DEFAULT 'pasien'`);
        console.log('✅ ENUM modified');
        
        console.log('⏳ Updating petugas -> ahli_gizi...');
        const [result1] = await db.query(`UPDATE users SET role = 'ahli_gizi' WHERE role = 'petugas'`);
        console.log(`✅ ${result1.affectedRows} rows updated to ahli_gizi`);
        
        console.log('⏳ Updating user -> pasien...');
        const [result2] = await db.query(`UPDATE users SET role = 'pasien' WHERE role = 'user'`);
        console.log(`✅ ${result2.affectedRows} rows updated to pasien`);
        
        // 3. Cek data sesudah migration
        const [after] = await db.query('SELECT id, nama, email, role FROM users ORDER BY id');
        console.log('\n📊 Data sesudah migration:');
        console.table(after);
        
        console.log('\n✅ Migration selesai!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration gagal:', error.message);
        process.exit(1);
    }
};

runMigration();
