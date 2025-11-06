import sql from 'mssql'

import dotenv from 'dotenv'
dotenv.config();

const config = {
    user: process.env.DB_USERNAME,         // Tên user SQL của bạn
    password: process.env.DB_PASSWORD,    // Mật khẩu
    server: process.env.DB_SERVER,         // Hoặc tên instance nếu có, ví dụ: 'localhost\\SQLEXPRESS'
    database: process.env.DB_DATABASE, // Tên CSDL bạn muốn kết nối
    port: parseInt(process.env.DB_PORT) || 1433, // Cổng SQL Server
    options: {
        encrypt: true, // Bắt buộc nếu bạn dùng Azure, nhưng tốt nhất nên bật
        trustServerCertificate: true // Rất quan trọng cho kết nối local (self-signed certificate)
    }
};

export const connectDB = async () => {
  let pool;
  try {
      console.log("Đang kết nối tới SQL Server...");
      console.log("Config:", {
          user: config.user,
          server: config.server,
          database: config.database,
          port: config.port
      });
      pool = new sql.ConnectionPool(config);
      await pool.connect();
      console.log("Đã kết nối tới SQL Server.");
      return pool;
  } catch (err) {
      console.error("Không thể kết nối tới SQL Server:", err.message);
  }
}

// module.exports = config;