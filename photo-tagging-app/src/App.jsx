import styles from './App.module.css';
import { useState, useEffect } from 'react';
import useTargets from './api/targetAPI';
import Dropdown from './components/Dropdown';
import Target from './components/Target';
import Photo from './components/Photo';
import Album from './images/Album';
import Popup from './components/Popup';
import Clock from './components/Clock';

function App() {
  // Dropdown controls
  const [dropDownDisplay, setDropDownDisplay] = useState('none');
  const [dropDownPosition, setDropDownPosition] = useState(null);
  const [cursor, setCursor] = useState('pointer');

  // Target controls
  const [names, setNames] = useState([]);
  const [hitboxes, setHitboxes] = useState({});
  const [iconStyles, setIconStyles] = useState({
    peter: { filter: 'brightness(100%)' },
    sam: { filter: 'brightness(100%)' },
    eric: { filter: 'brightness(100%)' },
  });

  //Popup controls
  const [popupStyles, setPopupStyles] = useState({ display: 'none' });
  const [score, setScore] = useState([]);

  // API fetch
  const { targets, error, loading } = useTargets();
  const [clickPos, setClickPos] = useState({});

  // Reorganize fetched data to useState
  useEffect(() => {
    const nameList = [];
    const hitboxObj = {};

    for (const i in targets) {
      nameList.push(targets[i].name);
      hitboxObj[targets[i].name] = { top: '', left: '', border: 'none' };
    }

    setNames(nameList);
    setHitboxes(hitboxObj);
  }, [targets]);

  // Show up click anywhere on picture
  const showDropDown = (e) => {
    if (popupStyles.display === 'none') {
      const position = {
        menu: {
          top: `${e.pageY + 25}px`,
          left: `${e.pageX + 25}px`,
        },
        box: {
          top: `${e.pageY - 28}px`,
          left: `${e.pageX - 28}px`,
        },
      };
      setClickPos({ top: e.pageY, left: e.pageX });
      setDropDownPosition(position);
      setDropDownDisplay('block');
      setCursor('default');
    } else {
      return;
    }
  };

  // (1) Close menu click on menu
  // (2) Close menu click outside of menu
  const clickMenu = (e) => {
    e.stopPropagation();

    setDropDownDisplay('none');
    setCursor('pointer');

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
      const response = await fetch('http://localhost:3000/target/check', {
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
    if (score.length === Object.keys(Album).length) {
      setScore(true);
    }
  }, [score]);

  useEffect(() => {
    if (popupStyles.display === 'flex') {
      setCursor('default');

      let newHitboxObj = { ...hitboxes };
      const names = Object.keys(newHitboxObj);

      for (const name of names) {
        newHitboxObj[name] = { ...newHitboxObj[name], border: 'none' };
      }

      setHitboxes(newHitboxObj);
    }
  }, [popupStyles]);

  if (error)
    return <h1 className={styles.error}>A network error was encountered</h1>;

  if (loading) return <h1 className={styles.loading}>Loading...</h1>;

  return (
    <div
      className={styles.App}
      onClick={dropDownDisplay === 'none' ? showDropDown : clickMenu}
      style={{ cursor: cursor }}
      data-testid="App">
      <div className={styles.title}>{"Where're They?"}</div>
      {names.map((name) => {
        const position = hitboxes[name];
        return <Target key={name} name={name} position={position} />;
      })}
      <div className={styles.frame}>
        {Album.map((peguin) => {
          const name = Object.keys(peguin);
          const style = iconStyles[name[0].toLowerCase()];
          return (
            <Photo
              key={name[0]}
              photo={peguin[name[0]]}
              peguin={name[0]}
              style={style}
            />
          );
        })}
      </div>
      <Dropdown
        display={dropDownDisplay}
        position={dropDownPosition}
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
