import mysql from 'mysql2/promise';


 let connection;
export const connectDB=async()=>{
  if(!connection){
  connection= await mysql.createConnection({
    host: process.env.DB_HOST,       // Replace with your DB host
    user: process.env.DB_USER,            // Replace with your DB user
    password: process.env.DB_PASSWORD, // Replace with your DB password
    database: process.env.DB_NAME, // Replace with your database name
  });
}
  console.log("DB CONNECTED")

  return connection;
}
