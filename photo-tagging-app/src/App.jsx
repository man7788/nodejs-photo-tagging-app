import styles from './App.module.css';
import { useState, useEffect } from 'react';
import Game from './components/Game';
import Highscore from './components/Highscore';
import Selection from './components/Selection';

function App() {
  const [startGame, setStartGame] = useState(false);
  const [showHighscore, setHighscore] = useState(false);
  const [gameTargets, setGameTargets] = useState(false);
  const [choiceStyles, setChoiceStyles] = useState({});
  const [noTargetError, setNoTargetError] = useState(false);
  const [highscoreMessage, setHighscoreMessage] = useState(false);

  useEffect(() => {
    setGameTargets(Object.keys(choiceStyles));
  }, [choiceStyles]);

  useEffect(() => {
    if (gameTargets.length > 0) {
      setNoTargetError(false);
    }

    if (gameTargets.length > 0 && gameTargets.length < 3) {
      setHighscoreMessage(true);
    } else {
      setHighscoreMessage(false);
    }
  }, [gameTargets]);

  const onStartGame = () => {
    if (gameTargets.length > 0) {
      setStartGame(true);
    } else {
      setNoTargetError(true);
    }
  };

  const onShowHighscore = () => {
    setHighscore(true);
  };

  const onShowHome = () => {
    setHighscore(false);
  };

  return (
    <div>
      {startGame ? (
        <Game gameTargets={gameTargets} />
      ) : (
        <div className={styles.home}>
          <div className={styles.title}> {"Where're They?"}</div>
          {!showHighscore && (
            <div className={styles.homeContainer}>
              <h1>Select Your Target</h1>
              <div className={styles.selection}>
                <Selection
                  setChoiceStyles={setChoiceStyles}
                  choiceStyles={choiceStyles}
                />
                {highscoreMessage && (
                  <div className={styles.message}>
                    Select all targets to compete for highscore
                  </div>
                )}
                {noTargetError && (
                  <div className={styles.error}>Select at least one target</div>
                )}
              </div>

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
