import { useState, useEffect } from 'react';
import styles from '../styles/Highscore.module.css';

const Highscore = ({ show }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    // const unsub = onSnapshot(q, (snapshot) => {
    // let scoreList = [];
    // snapshot.docs.forEach((doc) => {
    //   if (scoreList.length < 5) {
    // scoreList.push({ ...doc.data(), id: doc.id });
    // console.log(doc.data());
    // }
    // });
    // console.log(scoreList);
    //     const listItem = scoreList.map((player) => {
    //       return (
    //         <li key={player.id}>
    //           {player.name}
    //           <br />
    //           {`Time: ${player.time}`}
    //         </li>
    //       );
    //     });
    //     setList(listItem);
    //   });
  }, []);
  return (
    <div
      className={styles.Highscore}
      style={{ display: show ? 'block' : 'none' }}>
      <div className="table">
        <h2>Top 5 Players</h2>
        <ul>{list}</ul>
      </div>
    </div>
  );
};

export default Highscore;
