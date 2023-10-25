import styles from './App.module.css';
import { useState, useEffect } from 'react';
import useTargets from './api/targetAPI';
import Dropdown from './components/Dropdown';
import Target from './components/Target';
import Photo from './components/Photo';
import Album from './images/Album';

function App() {
  // Dropdown controls
  const [dropDownDisplay, setDropDownDisplay] = useState('none');
  const [dropDownPosition, setDropDownPosition] = useState();
  const [cursor, setCursor] = useState('pointer');

  // Target controls
  const [names, setNames] = useState([]);
  const [hitboxes, setHitboxes] = useState({});
  const [onTarget, setOnTarget] = useState('');
  const [iconStyles, setIconStyles] = useState({
    peter: { filter: 'brightness(100%)' },
    sam: { filter: 'brightness(100%)' },
    eric: { filter: 'brightness(100%)' },
  });

  // API fetch
  const { targets, error, loading } = useTargets();

  // Reorganize fetched data to useState
  useEffect(() => {
    const nameList = [];
    let styleObj = {};

    for (const i in targets) {
      nameList.push(targets[i].name);
      styleObj = { ...styleObj, [targets[i].name]: targets[i].style };
    }

    setNames(nameList);
    setHitboxes(styleObj);
  }, [targets]);

  // (1) Show up click anywhere on picture
  // (2) Show up click on target
  const showDropDown = (e) => {
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

    setDropDownPosition(position);
    setDropDownDisplay('block');
    setCursor('default');
  };

  // (1) Close menu click on menu
  // (2) Close menu click outside of menu
  const clickMenu = (e) => {
    e.stopPropagation();

    setDropDownDisplay('none');
    setCursor('pointer');

    const selection = e.target.textContent.toLowerCase();
    checkTarget(selection);
  };

  const clickTarget = (e) => {
    e.stopPropagation();

    setOnTarget(e.target.id);

    showDropDown(e);
    // clickPicture(e);
    // setHide('none');
  };

  const checkTarget = (selection) => {
    if (selection === onTarget) {
      const newTargetbox = {
        ...hitboxes[selection],
        border: '3px solid cyan',
      };
      const newHitboxes = { ...hitboxes, [selection]: newTargetbox };
      setHitboxes(newHitboxes);

      const newStyle = { color: 'grey', filter: 'brightness(50%)' };
      const newIconStyles = { ...iconStyles, [selection]: newStyle };
      setIconStyles(newIconStyles);
    }
  };

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
        return (
          <Target
            key={name}
            name={name}
            position={position}
            clickTarget={clickTarget}
          />
        );
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
    </div>
  );
}

export default App;
