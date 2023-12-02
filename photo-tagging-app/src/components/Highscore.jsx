import styles from '../styles/Highscore.module.css';
import { useHighScore } from '../api/scoreAPI';

const Highscore = () => {
  const { list, error, loading } = useHighScore();

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
          {list.map((player) => {
            return (
              <li key={player._id}>
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
