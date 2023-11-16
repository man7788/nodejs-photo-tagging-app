import styles from './App.module.css';
import { useState, useEffect } from 'react';
import useTargets from './api/targetAPI';
import apiDomain from './api/apiDomain';
import Dropdown from './components/Dropdown';
import Target from './components/Target';
import Popup from './components/Popup';
import Clock from './components/Clock';
import Frame from './components/Frame';

function App() {
  // Dropdown controls
  const [dropDownDisplay, setDropDownDisplay] = useState({ display: 'none' });
  const [dropDownPosition, setDropDownPosition] = useState(null);
  const [cursor, setCursor] = useState({ cursor: 'pointer' });

  // Target controls
  const [names, setNames] = useState([]);
  const [hitboxes, setHitboxes] = useState({});
  const [iconStyles, setIconStyles] = useState({});

  //Popup controls
  const [popupStyles, setPopupStyles] = useState({ display: 'none' });
  const [score, setScore] = useState([]);

  // API fetch
  const { targets, error, loading } = useTargets();
  const [clickPos, setClickPos] = useState({});
  const api = apiDomain();

  // Reorganize fetched data to useState
  useEffect(() => {
    const nameList = [];
    const hitboxObj = {};
    const styleObj = {};

    for (const i in targets) {
      nameList.push(targets[i].name);
      hitboxObj[targets[i].name] = { top: '', left: '', border: 'none' };
      styleObj[targets[i].name] = {
        [[targets[i].name]]: { filter: 'brightness(100%)' },
      };
    }

    setNames(nameList);
    setHitboxes(hitboxObj);
    setIconStyles(styleObj);
  }, [targets]);

  // Show up click anywhere on picture
  const showDropDown = (e) => {
    e.stopPropagation();

    if (popupStyles.display === 'none') {
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
      setDropDownPosition(position);
      setDropDownDisplay({ display: 'block' });
      setCursor({ cursor: 'default' });
    } else {
      return;
    }
  };

  // (1) Close menu click on menu
  // (2) Close menu click outside of menu
  const clickMenu = (e) => {
    e.stopPropagation();

    setDropDownDisplay({ display: 'none' });
    setCursor({ cursor: 'pointer' });

    const selection = e.target.textContent.toLowerCase();
    if (names.includes(selection)) {
      const doc = document.querySelector(`#${selection}`);
      const range = { topRange: doc.clientHeight, leftRange: doc.clientWidth };
      checkTarget(selection, range);
    }
  };

  const checkTarget = async (selection, range) => {
    // API fetch
    const postData = {
      selection: selection,
      position: clickPos,
      range: range,
    };
    try {
      const response = await fetch(`${api}/target/check`, {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      data.result && updateStyle(data.position);
    } catch (err) {
      console.error(err);
    }

    function updateStyle(position) {
      const newTargetbox = {
        border: '3px solid cyan',
        top: position.top,
        left: position.left,
      };
      const newHitboxes = { ...hitboxes, [selection]: newTargetbox };
      setHitboxes(newHitboxes);

      const newStyle = { color: 'grey', filter: 'brightness(50%)' };
      const newIconStyles = { ...iconStyles, [selection]: newStyle };
      setIconStyles(newIconStyles);
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

  useEffect(() => {
    if (names?.length && score.length === names.length) {
      setScore(true);
    }
  }, [score]);

  useEffect(() => {
    if (popupStyles.display === 'flex') {
      setCursor({ cursor: 'default' });

      let newHitboxObj = { ...hitboxes };
      const names = Object.keys(newHitboxObj);

      for (const name of names) {
        newHitboxObj[name] = { ...newHitboxObj[name], border: 'none' };
      }

      setHitboxes(newHitboxObj);
    }
  }, [popupStyles]);

  if (error)
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
    <div
      className={styles.App}
      onClick={dropDownDisplay.display === 'none' ? showDropDown : clickMenu}
      style={cursor}
      data-testid="App">
      <div
        className={styles.title}
        onClick={(e) => {
          e.stopPropagation();
        }}>
        {"Where're They?"}
      </div>
      {names.map((name) => {
        const position = hitboxes[name];
        return <Target key={name} name={name} position={position} />;
      })}
      <Frame iconStyles={iconStyles} />
      <Dropdown
        display={dropDownDisplay}
        position={dropDownPosition}
        names={names}
        clickMenu={clickMenu}
      />
      <Clock
        gameover={score}
        setPopupStyles={setPopupStyles}
        setScore={setScore}
      />
      <Popup style={popupStyles} score={score} />
    </div>
  );
}

export default App;
