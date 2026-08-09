import db from './src/config/db.js';

const checkDatabase = async () => {
    try {
        console.log('🔍 Checking users table...\n');
        
        // Check current data
        const [users] = await db.query('SELECT id, nama, email, role FROM users');
        console.log('Current users:');
        console.table(users);
        
        // Check table structure
        const [structure] = await db.query("DESCRIBE users");
        console.log('\nTable structure (relevant columns):');
        const relevant = structure.filter(col => ['id', 'role', 'email'].includes(col.Field));
        console.table(relevant);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkDatabase();
