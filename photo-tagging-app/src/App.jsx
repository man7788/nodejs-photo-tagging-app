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
  const hitboxes = {
    peter: {
      top: '280px',
      left: '110px',
    },
    sam: { top: '360px', left: '230px' },
    eric: { top: '320px', left: '350px' },
  };

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
  };

  const clickTarget = (e) => {
    e.stopPropagation();
    console.log('on target');
    setOnTarget(e.target.id);
    console.log(hitboxes[e.target.id]);
    // clickPicture(e);
    // setHide('none');
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
