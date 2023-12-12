import styles from '../styles/Game.module.css';
import { useState, useEffect, useRef, useReducer } from 'react';
import { useTargets } from '../api/targetAPI';
import Dropdown from './Dropdown';
import Popup from './Popup';
import Clock from './Clock';
import Frame from './Frame';
import Prompt from './Prompt';
import TargetBoard from './TargetBoard';
import { targetContext } from '../contexts/targetContext';
import App from '../App';
import Home from '../images/home.svg';
import manageTargets from '../controls/targetControls';
import manageDropdown from '../controls/dropdownControls';
import gameReducer from '../reducers/gameReducer';

function Game() {
  // Reducers
  const [gameState, gameDispatch] = useReducer(gameReducer, gameDefaultValue);

  // API fetch
  const { targets, error, loading } = useTargets();

  // Dropdown controls
  const [defaultCursor, setDefaultCursor] = useState(false);

  // Target controls
  const [names, setNames] = useState([]);
  const allTargets = useRef({});
  const [showTargetBoard, setShowTargetBoard] = useState(true);

  // Popup controls
  const [gameover, setGameOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [finishClock, setFinishClock] = useState('');

  // Home controls
  const [showHome, setShowHome] = useState(false);
  const onShowHome = () => setShowHome(true);

  // Time controls
  const [startTime, setStartTime] = useState(0);
  const [finishTime, setFinishTime] = useState(0);

  // Record start time
  useEffect(() => {
    setStartTime(Date.now());
  }, [loading]);

  // Reorganize fetched data to useState
  useEffect(() => {
    const nameList = [];

    for (const i in targets) {
      nameList.push(targets[i].name);
    }

    setNames(nameList);
  }, [targets]);

  // Game over and tell clock to stop
  useEffect(() => {
    if (names?.length && gameState.score.length === names.length) {
      setGameOver(true);
      setFinishTime(Math.floor((Date.now() - startTime) / 1000));
    }
  }, [gameState.score]);

  // Set cursor and clear target highlight
  useEffect(() => {
    if (showPopup) {
      setDefaultCursor(true);
      setShowTargetBoard(false);
    }
  }, [showPopup]);

  const onShowDropdown = (e) => {
    manageDropdown(e, showPopup, gameDispatch);
  };

  const clickMenu = (e) => {
    manageTargets(
      e,
      names,
      allTargets,
      gameState.clickPos,
      gameState.score,
      gameDispatch,
    );
  };

  if (error || gameState.serverError)
    return (
      <div className={styles.error}>
        <h1>A network error was encountered</h1>
      </div>
    );

  if (loading)
    return (
      <div className={styles.loading}>
        <h1>Loading...</h1>
      </div>
    );

  return (
    <>
      {showHome ? (
        <App />
      ) : (
        <div
          className={styles.Game}
          onClick={gameState.showDropdown ? clickMenu : onShowDropdown}
          style={defaultCursor ? { cursor: 'default' } : gameState.cursor}
          data-testid="App">
          <div
            className={styles.title}
            onClick={(e) => {
              e.stopPropagation();
            }}>
            {"Where're They?"}
          </div>
          {showTargetBoard && (
            <targetContext.Provider value={{ allTargets }}>
              <TargetBoard
                names={names}
                updateTarget={gameState.updateTarget}
              />
            </targetContext.Provider>
          )}
          <Frame updateIcon={gameState.updateIcon} />
          {gameState.showTryAgain && <Prompt dispatch={gameDispatch} />}
          {gameState.showDropdown && (
            <Dropdown
              updateDropdown={gameState.updateDropdown}
              names={names}
              clickMenu={clickMenu}
            />
          )}
          <Clock
            gameover={gameover}
            setShowPopup={setShowPopup}
            setFinishClock={setFinishClock}
          />
          {showPopup && (
            <Popup finishTime={finishTime} finishClock={finishClock} />
          )}
          <button onClick={onShowHome}>
            <img src={Home} className={styles.home}></img>
          </button>
        </div>
      )}
    </>
  );
}

export default Game;

const gameDefaultValue = {
  showDropdown: false,
  clickPos: {},
  serverError: null,
  updateDropdown: {},
  cursor: { cursor: 'pointer' },
  showTryAgain: false,
  updateTarget: {},
  updateIcon: '',
  score: [],
};
