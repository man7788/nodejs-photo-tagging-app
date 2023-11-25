import styles from '../styles/Dropdown.module.css';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ updateDropdown, names, clickMenu }) => {
  const [menuStyle, setMenuStyle] = useState({ display: 'none' });
  const [boxStyle, setBoxStyle] = useState({ display: 'none' });

  useEffect(() => {
    if (updateDropdown && updateDropdown.show) {
      setMenuStyle({
        top: updateDropdown.position.menu.top,
        left: updateDropdown.position.menu.left,
        display: 'block',
      });
      setBoxStyle({
        top: updateDropdown.position.box.top,
        left: updateDropdown.position.box.left,
        display: 'block',
      });
    }

    if (updateDropdown && !updateDropdown.show) {
      setMenuStyle({
        display: 'none',
      });
      setBoxStyle({
        display: 'none',
      });
    }
  }, [updateDropdown]);

  const itemNames = names.map((name) => {
    const upperLetter = name[0].toUpperCase();
    const lowerString = name.slice(1);
    const wholeString = upperLetter.concat(lowerString);
    return wholeString;
  });

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

Dropdown.propTypes = {
  updateDropdown: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    position: PropTypes.shape({
      menu: PropTypes.shape({
        top: PropTypes.string,
        left: PropTypes.string,
      }).isRequired,
      box: PropTypes.shape({
        top: PropTypes.string,
        left: PropTypes.string,
      }).isRequired,
    }),
  }),
  names: PropTypes.array.isRequired,
  clickMenu: PropTypes.func.isRequired,
};

export default Dropdown;
