import styles from '../styles/Highscore.module.css';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHighScore } from '../api/scoreAPI';
import { homeContext } from '../contexts/homeContext';

const Highscore = ({ showHomeButton }) => {
  const { list, error, loading } = useHighScore();
  const { onShowHome } = useContext(homeContext);

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
        {showHomeButton && <button onClick={onShowHome}>Home</button>}
      </div>
    </div>
  );
};

Highscore.propTypes = {
  showHomeButton: PropTypes.bool.isRequired,
};

export default Highscore;
