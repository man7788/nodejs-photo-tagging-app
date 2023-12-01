import styles from '../styles/Game.module.css';
import { useState, useEffect, useRef } from 'react';
import { useTargets, checkTargetAPI } from '../api/targetAPI';
import Dropdown from './Dropdown';
import Popup from './Popup';
import Clock from './Clock';
import Frame from './Frame';
import Prompt from './Prompt';
import TargetBoard from './TargetBoard';
import { targetContext } from '../contexts/targetContext';
import { homeContext } from '../contexts/homeContext';
import App from '../App';

function Game() {
  // Dropdown controls
  const [updateDropdown, setUpdateDropdown] = useState({ show: false });
  const [cursor, setCursor] = useState({ cursor: 'pointer' });

  // Target controls
  const [names, setNames] = useState([]);
  const [tryAgain, setTryAgain] = useState(false);
  const [updateTarget, setUpdateTarget] = useState({});
  const [updateIcon, setUpdateIcon] = useState('');
  const allTargets = useRef({});

  //Popup controls
  const [updatePopup, setUpdatePopup] = useState({ show: false });
  const [score, setScore] = useState([]);

  // API fetch
  const { targets, error, loading } = useTargets();
  const [clickPos, setClickPos] = useState({});
  const [serverError, setServerError] = useState(null);

  // Home controls
  const [showHome, setShowHome] = useState(false);
  const onShowHome = () => setShowHome(true);

  // Reorganize fetched data to useState
  useEffect(() => {
    const nameList = [];

    for (const i in targets) {
      nameList.push(targets[i].name);
    }

    setNames(nameList);
  }, [targets]);

  useEffect(() => {
    if (names?.length && score.length === names.length) {
      setScore(true);
    }
  }, [score]);

  useEffect(() => {
    if (updatePopup && updatePopup.show) {
      setCursor({ cursor: 'default' });

      const targetData = { gameover: true };
      setUpdateTarget(targetData);
    }
  }, [updatePopup]);

  // Show up click anywhere on picture
  const showDropDown = (e) => {
    e.stopPropagation();

    setTryAgain(false);

    if (!updatePopup.show) {
      const target = e.target.getBoundingClientRect();

      const dropdownY = e.pageY - target.y;
      const dropdownX = e.pageX - target.x;

      const position = {
        menu: {
          top: `${dropdownY + 19}px`,
          left: `${dropdownX + 19}px`,
        },
        box: {
          top: `${dropdownY - 28}px`,
          left: `${dropdownX - 28}px`,
        },
      };

      setClickPos({ top: dropdownY, left: dropdownX });
      setUpdateDropdown({ position, show: true });
      setCursor({ cursor: 'default' });
    } else {
      return;
    }
  };

  // (1) Close menu click on menu
  // (2) Close menu click outside of menu
  const clickMenu = (e) => {
    e.stopPropagation();

    setUpdateDropdown({ show: false });
    setCursor({ cursor: 'pointer' });

    const selection = e.target.textContent.toLowerCase();
    if (names.includes(selection)) {
      const element = allTargets.current[selection];
      const range = {
        topRange: element.clientHeight,
        leftRange: element.clientWidth,
      };
      checkTarget(selection, range);
    }
  };

  const checkTarget = async (selection, range) => {
    const postData = {
      selection: selection,
      position: clickPos,
      range: range,
    };

    const result = await checkTargetAPI(postData);

    if (result && result.result) {
      updateStyle(result.position);
    } else {
      setTryAgain(true);
    }

    if (result && result.error) {
      setServerError(true);
    }

    function updateStyle(position) {
      const targetData = { position, selection };
      setUpdateTarget(targetData);

      const iconData = selection;
      setUpdateIcon(iconData);
      checkScore(selection);
    }
  };

  const checkScore = (selection) => {
    const newList = [...score];
    if (!score.includes(selection)) {
      newList.push(selection);
      setScore(newList);
    }
  };

  if (error || serverError)
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
    <div>
      {showHome ? (
        <App />
      ) : (
        <div
          className={styles.Game}
          onClick={!updateDropdown.show ? showDropDown : clickMenu}
          style={cursor}
          data-testid="App">
          <div
            className={styles.title}
            onClick={(e) => {
              e.stopPropagation();
            }}>
            {"Where're They?"}
          </div>
          <targetContext.Provider value={{ allTargets }}>
            <TargetBoard names={names} updateTarget={updateTarget} />
          </targetContext.Provider>
          <Frame updateIcon={updateIcon} />
          <Prompt tryAgain={tryAgain} />
          <Dropdown
            updateDropdown={updateDropdown}
            names={names}
            clickMenu={clickMenu}
          />
          <Clock
            gameover={score}
            setUpdatePopup={setUpdatePopup}
            setScore={setScore}
          />
          <homeContext.Provider value={{ onShowHome }}>
            <Popup updatePopup={updatePopup} score={score} />
          </homeContext.Provider>
        </div>
      )}
    </div>
  );
}

export default Game;
