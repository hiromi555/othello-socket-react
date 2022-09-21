import { Cell } from './Cell'

export const Board = ({othello, okCells, myTurn, size, active}) => {
return (
   <>
    <div className='outline'>
        {othello.map((row, j) =>
            <div className='column' key={`row-${j}`}>
               {row.map((col,i) =>
                   <Cell key={`col-${i}`}
                       row={j}
                       col={i}
                       stone={othello[j][i]}
                       size={size}
                       active={active}
                       okCells={okCells}
                       myTurn ={myTurn}
                   />
                )}
            </div>
          )}
        </div>

    </>
  );
}
