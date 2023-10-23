import styles from '../styles/Dropdown.module.css';

const Dropdown = ({ display, position, clickMenu }) => {
  const itemNames = ['Peter', 'Sam', 'Eric'];

  let menuStyle = { display };
  let boxStyle = { display };

  if (position) {
    menuStyle = {
      display,
      top: position.menu.top,
      left: position.menu.left,
    };
    boxStyle = { display, top: position.box.top, left: position.box.left };
  }

  return (
    <div className="Dropdown">
      <div className={styles.menu} style={menuStyle} data-testid="menu">
        <ul>
          {itemNames.map((item) => (
            <li key={item} onClick={clickMenu}>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.box} style={boxStyle} data-testid="box"></div>
    </div>
  );
};
export default Dropdown;
