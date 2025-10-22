import BoardList from "./Components/boardList/BoardList";
import styles from "./Board.module.css"

const Board = () => {
  return (
    <div className={styles.container}>
      {/* 공지사항 게시판 */}
      <BoardList />
    </div>
  );
};

export default Board;
