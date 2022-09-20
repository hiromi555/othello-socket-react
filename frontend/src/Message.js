import { useState, useEffect } from 'react';
import io from "socket.io-client";
import xssFilters from 'xss-filters'

const socket = io();

export const Message = ({size}) => {
    const [message, setText] = useState('');
    const [messageList, setMessageList] = useState(['オセロゲームへようこそ!!']);
    //メッセージを送る
    const addMessage = (e) => {
        e.preventDefault()
        if(message !==''){
         socket.emit('sendMessage', xssFilters.inHTMLData(message))
        }
        setText('')
    }
    useEffect(() => {
        socket.on('message', (message) => {
           setMessageList(pre => {
                const newMessages = [...pre]
                newMessages.unshift(message)
                return newMessages
            })
        })
      return () => {
      socket.off('message');
    };
    },[message])

    return (
        <div className='mess-wrap' style={{ width: size * 9 }}>
           <ul className='message'>
             {messageList.map((message, index) =>
             <li key={`m-${index}`}>{message}</li>
             )}
            </ul>
             <p>＊（サーバー情報）諸事情により15分間隔で自動アクセスしています</p>
            <form onSubmit={addMessage} className="fixed">
            <input
                style={{ width: size*7}}
                placeholder=" メッセージ"
                type="text"
                value={message}
                onChange={(e) => setText( e.target.value )}/>
                <button className="button" style={{ width: size*2}}>送信</button>
            </form>
        </div>
    )
}
