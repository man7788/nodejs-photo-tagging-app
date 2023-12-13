import styles from './App.module.css';
import { useState } from 'react';
import Game from './components/Game';
import Highscore from './components/Highscore';
import Selection from './components/Selection';

function App() {
  const [startGame, setStartGame] = useState(false);
  const [showHighscore, setHighscore] = useState(false);

  const onStartGame = () => setStartGame(true);
  const onShowHighscore = () => {
    setHighscore(true);
  };
  const onShowHome = () => {
    setHighscore(false);
  };

  return (
    <div>
      {startGame ? (
        <Game />
      ) : (
        <div className={styles.home}>
          <div className={styles.title}> {"Where're They?"}</div>
          {!showHighscore && (
            <div className={styles.homeContainer}>
              <h1>Find Them All:</h1>
              <Selection />
              <button onClick={onStartGame}>Start</button>
              <button onClick={onShowHighscore}>Highscore</button>
            </div>
          )}
          {showHighscore && (
            <div className={styles.homeContainer}>
              <Highscore showHomeButton={false} />
              <button onClick={onShowHome}>Home</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
