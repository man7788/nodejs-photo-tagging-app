import { useState } from 'react';
import styles from './App.module.css';
import Dropdown from './components/Dropdown';

function App() {
  const [dropDownDisplay, setDropDownDisplay] = useState('none');
  const [dropDownPosition, setDropDownPosition] = useState();
  const [cursor, setCursor] = useState('pointer');

  const showDropDown = (e) => {
    console.log('click picture');

    const position = {
      menu: {
        top: `${e.nativeEvent.offsetY + 25}px`,
        left: `${e.nativeEvent.offsetX + 25}px`,
      },
      box: {
        top: `${e.nativeEvent.offsetY - 28}px`,
        left: `${e.nativeEvent.offsetX - 28}px`,
      },
    };

    setDropDownPosition(position);
    setDropDownDisplay('block');
    setCursor('default');
  };

  const clickMenu = (e) => {
    console.log('click menu');

    e.stopPropagation();
    setDropDownDisplay('none');
    setCursor('pointer');
  };

  return (
    <div
      className={styles.App}
      onClick={dropDownDisplay === 'none' ? showDropDown : clickMenu}
      style={{ cursor: cursor }}
      data-testid="App">
      <div className={styles.title}>{"Where're They?"}</div>
      <Dropdown
        display={dropDownDisplay}
        position={dropDownPosition}
        clickMenu={clickMenu}
      />
    </div>
  );
}

export default App;
