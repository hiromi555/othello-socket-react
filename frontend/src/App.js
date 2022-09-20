import './App.css';
import { Board } from './othello/Board'
import {Info} from './othello/Info'
import { Reload } from './Reload'
import { Message } from './Message';
import { useState, useEffect } from 'react';
import { board, countStone, okList, serchOkCells, getStoneListAndOkList } from './othello/model.js'
import io from "socket.io-client";
const socket = io();
socket.emit('message', '接続しました')

function App() {
    const [size, setSize] = useState(64);
    const [othello, setBoard] =useState(board)
    const [myTurn, setMyTurn] = useState(true);
    const [finish, setFinish] = useState(false);
    const [count, setCount] = useState({ black: 2, white: 2 });
    const [pass, setPass] = useState(false);
    const [okCells, setOkCells] = useState(okList);
    const [active, setActive] = useState(false);
    //クリックできるマスの表示非表示
    const ShowCells = () => {
        setActive(true)
    }

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
        setActive(false)
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
//Cellのサイズ
useEffect(() => {
     window.innerWidth <= window.innerHeight ? setSize( window.innerWidth*0.09):setSize( window.innerHeight*0.09)
}, []);

    return (
    <>
      <div className="App">
        <Info
            finish={finish}
            myTurn={myTurn}
            count={count}
            pass={pass}
         />
        <Board
          size={size}
          othello={othello}
          okCells={okCells}
          myTurn={myTurn}
          active={active}
          />
         <div className="button-wrap -show">
            <button className="button" onClick={ShowCells}>クリックできるマスを見る</button>
         </div>
        <Reload />
     </div>
     <div className="App Mess">
        <Message
          size={size}
        />
      </div>
    </>
  );
}

export default App;
