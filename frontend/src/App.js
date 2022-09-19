import './App.css';
import { Board } from './othello/Board'
import { Reload } from './Reload'
import { Message } from './Message';
import { useState, useEffect } from 'react';
import { board, countStone, okList, serchOkCells, getStoneListAndOkList } from './othello/model.js'
import io from "socket.io-client";
const socket = io();

const handlePass = (turn) => {
 socket.emit('clickPass', turn)
}
function App() {
    const [othello, setBoard] =useState(board)
    const [myTurn, setMyTurn] = useState(true);
    const [finish, setFinish] = useState(false);
    const [count, setCount] = useState({ black: 2, white: 2 });
    const [pass, setPass] = useState(false);
    const [okCells, setOkCells] = useState(okList);
    const [isConnected, setIsConnected] = useState(socket.connected);

//接続確認
useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
  };
}, []);

//サーバーから届いた座標で石を置く
useEffect(() => {
    socket.on('putStone', (payload) => {
    const { stoneList, okList } = getStoneListAndOkList(payload.y, payload.x, payload.turn, othello)
        let newBoard = {}
        stoneList.forEach(list => {
            setBoard(pre => {
                newBoard = [...pre]
                newBoard[list.row][list.col] = payload.turn ? 'black': 'white'
                return newBoard
            }
          )
        })
    setOkCells(() => okList)
    //座標がなければpass
    setPass(() => {
        if (okList.length === 0) {
            return true
        }else return false
    })
    //手番の切り替え
    setMyTurn(!payload.turn)
     }
    )
    return () => {
      socket.off('putStone');
  };
}, [othello]);

//パスした場合
useEffect(() => {
 socket.on('putPass', (turn) => {
  //手番の切り替え
  setMyTurn(!turn.turn)
 let okList = serchOkCells(othello, !turn.turn)
     setOkCells(() => okList)
     setPass(() => {
        if (okList.length === 0) {
            setFinish(true)
        }else return false
    })
 })
  return () => {
    socket.off('putPass');
  };
}, [othello]);

//石の数.手番
useEffect(() => {
    setCount(countStone(othello))
}, [othello]);

//終了判定
useEffect(() => {
    if (count.black === 0 || count.white === 0) {
        setPass(false)
        setFinish(true)
    }
    if (count.black + count.white === 64) {
        setPass(false)
        setFinish(true)
    }
}, [count])
    return (
    <div>
    <div className="App">
        {isConnected ? <p>接続中</p> : <p>切断されました！</p>}
        {finish && <div className="finish">
         ゲーム終了!! <span> 黒{count.black}個 </span>
               <span> 白{count.white}個 </span>
        </div>}
        <div className='info'>
        {!finish && <div className={myTurn ? 'turn myTurn' : 'turn'}>黒（{count.black }）</div>}
        {(pass && !finish) && <button className="button -sm" onClick={() => handlePass({ turn: myTurn })}>クリック（パスです！！）</button>}
        {!finish && <div className={!myTurn ? 'turn myTurn' : 'turn'}>白（{count.white }）</div>}
        </div>
            <Board
                othello={othello}
                okCells={okCells}
                myTurn ={myTurn}
                />
            <Reload />
            </div>
    <div className="App Mess">
         <Message />
      </div>
    </div>
  );
}

export default App;
