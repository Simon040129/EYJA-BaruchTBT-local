import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'app',
  password: 'app',
  database: 'app'
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database tables
export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        age INT,
        city VARCHAR(255)
      )
    `);

    // Attempt to modify id to AUTO_INCREMENT if it isn't already (Migration)
    try {
      await connection.query('SET FOREIGN_KEY_CHECKS=0');
      await connection.execute('ALTER TABLE users MODIFY COLUMN id INT AUTO_INCREMENT');
      await connection.query('SET FOREIGN_KEY_CHECKS=1');
      console.log('Successfully migrated users table to AUTO_INCREMENT');
    } catch (err) {
      console.error('Migration warning (AUTO_INCREMENT):', err.message);
      // Ensure checks are back on
      await connection.query('SET FOREIGN_KEY_CHECKS=1');
    }

    // Create textbooks table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS textbooks (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        course_number VARCHAR(255),
        condition_status VARCHAR(50),
        price DECIMAL(10, 2),
        seller_contact VARCHAR(255),
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Attempt to upgrade image_url to TEXT if it exists as VARCHAR (simple migration)
    try {
      await connection.execute('ALTER TABLE textbooks MODIFY COLUMN image_url TEXT');
    } catch (err) {
      // Ignore error if column doesn't exist or other issues, this is just a best-effort fix for dev
    }

    // Create posts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        content TEXT NOT NULL,
        author_name VARCHAR(255),
        category VARCHAR(50) DEFAULT 'General',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Attempt to add category column if it doesn't exist
    try {
      await connection.execute('ALTER TABLE posts ADD COLUMN category VARCHAR(50) DEFAULT "General"');
    } catch (err) {
      // Ignore if column exists
    }

    // Create messages table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        textbook_id INT,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id),
        FOREIGN KEY (receiver_id) REFERENCES users(id)
      )
    `);

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export default pool;
