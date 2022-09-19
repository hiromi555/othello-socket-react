//board
export const board = Array.from(new Array(8), () =>
    new Array(8).fill(0).map(() => {
    return '';
    }));
//初期値
 board[3][3] = 'white';
 board[3][4] ='black';
 board[4][4] ='white';
 board[4][3] = 'black';

export const okList = [{ row: 2, col: 3 }, { row: 3, col: 2 }, { row: 4, col: 5 }, { row: 5, col: 4 }]

//手番から石の色を返す
const _myTrun=(myTurn) =>{
    return myTurn === true
        ? { myStone: 'black', yourStone: 'white' }
        : { myStone: 'white', yourStone: 'black' }
}
//石の数をカウントする
export const countStone =(newBoard) => {
    const count = {
        black: 0,
        white: 0
    }
    newBoard.forEach((rows) => {
        rows.forEach((cell) => {
          if (cell === 'black') {
            count.black += 1
          }
          if (cell === 'white') {
            count.white += 1
          }
        })
    })
    return count
}

//検索用の関数
 const _serch=(row, col, myTurn, othello, incY, incX) =>{
    const list = []
    const { myStone, yourStone } = _myTrun(myTurn)
     let y = row + incY
     let x = col + incX
     if (y < 0 || y > 7 || x < 0 || x > 7) return //進行方向が座標からはみ出る
     if (othello[y][x] === '') return //進行方向が空
     if (othello[y][x] === myStone) return //進行方向が自分の石
     //次の座標が相手の石
     while (othello[y][x] === yourStone) {
         list.push({ row: y, col: x })
             y += incY
             x += incX
          //斜め方向に検索した場合、最後の座標がリストに残るので
          if (y < 0 || y > 7 || x < 0 || x > 7) {
             if (incY !== 0 || incX !== 0) {
                 list.splice(0)
             }
             break
          }
     }
     //最後の場合は0に戻す
         if (y < 0) { y = 0 }
         if (x < 0) { x = 0 }
         if (y > 7) { y = 7 }
         if (x > 7) { x = 7 }
    //自分と同じ石がない場合、リストは削除
     if (othello[y][x] !== myStone ) {
            list.splice(0)
     } else return list
 }

//８方向検索する（クリックした時に反転できる石の座標）
//下1,0/上-1, 0 /左0, -1 /右0, 1
//左上-1,-1 /　左下1,-1 / 右上-1, 1 /右下1, 1
const _changeStoneLists =(row, col, myTurn, othello)=> {
    let cells = []
    cells = cells.concat(_serch(row, col, myTurn, othello, 1, 0))
    cells = cells.concat(_serch(row, col, myTurn, othello, -1, 0))
    cells =cells.concat(_serch(row, col, myTurn, othello, 0, -1))
    cells=cells.concat(_serch(row, col, myTurn, othello, 0, 1))
    cells = cells.concat(_serch(row, col, myTurn, othello, -1, -1))
    cells = cells.concat(_serch(row, col, myTurn,othello, 1, -1))
    cells= cells.concat(_serch(row, col, myTurn, othello, -1, 1))
    cells =cells.concat(_serch(row, col, myTurn, othello, 1, 1))
    return cells.filter((list) => list !== undefined)
 }

//空のセルを取得する
const _getEmptyCells=(nextBoard)=> {
    const emptysList = []
    nextBoard.forEach((row, j) => {
        row.forEach((cell, i) => {
            if (cell === '') {
              emptysList.push({row:j, col:i})
            }
        })
     })
    return emptysList
}

// クリックできる座標のリスト
export const serchOkCells = (nextBoard, myTurn) => {
    const emptysList = _getEmptyCells(nextBoard)
    const okCells = []
    emptysList.forEach(cell => {
        const result = _changeStoneLists(cell.row, cell.col, myTurn, nextBoard)
        if (result.length !== 0) {
           okCells.push(cell)
        }
    })
    return okCells
}

//反転できる石の座標と次の手番でクリックできる座標を取得
export const getStoneListAndOkList = (row, col, myTurn, othello) => {
    const stoneList = _changeStoneLists(row, col, myTurn, othello)
    stoneList.push({ row: row, col: col })
    const nextBoard =[...othello]
    stoneList.forEach(list => {
        nextBoard[list.row][list.col] = myTurn ? 'black' : 'white'
    })
    const okList = serchOkCells(nextBoard, !myTurn)
    return {
        stoneList,
        okList
    }
}
