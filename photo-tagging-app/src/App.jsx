import { useState } from 'react';
import styles from './App.module.css';
import Dropdown from './components/Dropdown';
import Target from './components/Target';

function App() {
  const [dropDownDisplay, setDropDownDisplay] = useState('none');
  const [dropDownPosition, setDropDownPosition] = useState();
  const [cursor, setCursor] = useState('pointer');
  const [onTarget, setOnTarget] = useState('');

  // Fetch from api
  const targets = ['peter', 'sam', 'eric'];
  const [hitboxes, setHitboxes] = useState({
    peter: {
      border: 'none',
      top: '280px',
      left: '110px',
    },
    sam: { border: 'none', top: '360px', left: '230px' },
    eric: { border: 'none', top: '320px', left: '350px' },
  });

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
    }
  };

  return (
    <div
      className={styles.App}
      onClick={dropDownDisplay === 'none' ? showDropDown : clickMenu}
      style={{ cursor: cursor }}
      data-testid="App">
      <div className={styles.title}>{"Where're They?"}</div>
      {targets.map((target) => {
        const position = hitboxes[target];
        return (
          <Target
            key={target}
            name={target}
            position={position}
            clickTarget={clickTarget}
          />
        );
      })}
      <Dropdown
        display={dropDownDisplay}
        position={dropDownPosition}
        clickMenu={clickMenu}
      />
    </div>
  );
}

export default App;
