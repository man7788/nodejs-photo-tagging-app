import { useEffect, useState } from 'react';
import styles from '../styles/Highscore.module.css';
import { useHighScore } from '../api/scoreAPI';

const Highscore = () => {
  const { list, error, loading } = useHighScore();
  const [score, setScore] = useState([]);

  useEffect(() => {
    const clock = makeClock(list);
    setScore(clock);
  }, [list]);

  const makeClock = (list) => {
    const newList = list.map((item) => {
      const newObj = { name: item.name, id: item._id };

      let hours = Math.floor(item.time / 3600);
      let minutes = Math.floor((item.time - hours * 3600) / 60);
      let seconds = item.time - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = '0' + hours;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }

      const formattedTime = hours + ':' + minutes + ':' + seconds;
      newObj.time = formattedTime;

      return newObj;
    });
    return newList;
  };

  if (error) {
    return (
      <div>
        <h1>A network error was encountered</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className={styles.Highscore} data-testid="highscore">
      <div className={styles.table}>
        <h1>Top 5 Players</h1>
        <ul>
          {score.map((player) => {
            return (
              <li key={player.id}>
                {player.name}
                <br /> {`Time: ${player.time}`}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Highscore;
