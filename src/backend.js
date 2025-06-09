const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const app = express();

const PORT = process.env.PORT || 3000;
app.use(cors(), express.json());

const pool = mysql.createPool({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, '..', 'dist')));



wss.on('connection', (ws) => {
  console.log('Пользователь подключился');
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'online', count: wss.clients.size }));
    }
  });

  ws.on('message', (data,isBinary) => {
    
    const getData= isBinary ? data : JSON.parse(data.toString())
    let txt=''
    if(getData.type=='join'){
      ws.username=getData.name
      console.log(ws.username)
    }
    else if(getData.type=='message') txt=getData.text 
    

    const fullMessage={
        name:ws.username,
        text:txt,
        time:new Date().toLocaleTimeString()
      }
    if(txt){
         pool.query('INSERT INTO chat (user_name,text) VALUES (?,?)', [ws.username,txt], (err) => {
      if (err) {
        console.error('Ошибка сохранения в БД:', err);
        return;
      }


      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(fullMessage));
        
      });

    });
  }
  });

});


server.listen(PORT,'0.0.0.0', () => {
  console.log(`Сервер запущен`);
});
