import { useState, useEffect } from 'react';
import styles from '../styles/Highscore.module.css';

const Highscore = () => {
  const [list, setList] = useState([]);

  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/highscore', { mode: 'cors' })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error('server error');
        }
        return response.json();
      })
      .then((response) => setList(response))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div>
        <p>A network error was encountered</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.Highscore}>
      <div className={styles.table}>
        <h2>Top 5 Players</h2>
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
