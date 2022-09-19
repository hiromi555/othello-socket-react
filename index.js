import express from 'express'
const app = express()
import path from 'path'
import { fileURLToPath } from 'url'
//環境変数が取得できない場合は3000ポートを使う
const port = process.env.PORT || 3001
//httpモジュールを使いサーバーの処理はexpress
import http from 'http'
const server = http.createServer(app);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//ioインスタンス作成（サーバーを渡す)
import { Server } from 'socket.io'
const io = new Server(server);
//静的ファイル
app.use(express.static(path.join(__dirname, './frontend/build')));
// ホーム（/）にアクセス時に返却するHTMLファイル
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'./frontend/index.html'));
});

//本番　オセロ
io.on('connection', (socket) => {
    socket.on('message', (message) => {
       socket.broadcast.emit('message', message)
    })
    //クライアントから座標が届く
    socket.on('clickCell', (payload) => {
    //届いた座標を全クライアントに送信
     io.emit('putStone', payload)
    })
    //クライアントからパスをクリックしたことが届く
    socket.on('clickPass', (turn) => {
    //パスをクリックしたを全クライアントに送信
     io.emit('putPass', turn)
    })
    //メッセージ
    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })
    socket.on("disconnect", () => {
        io.emit('message', '相手はオフラインです')
    });
});

//server.listen　：app.listenでないことに注意
server.listen(port)
