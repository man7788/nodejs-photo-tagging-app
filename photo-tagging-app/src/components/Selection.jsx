import styles from '../styles/Selection.module.css';
import { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import Album from '../images/Album';
import Choice from './Choice';

const Selection = () => {
  const [updateStyle, setUpdateStyle] = useState(null);
  const [choiceStyles, setChoiceStyles] = useState({});

  useEffect(() => {
    if (updateStyle) {
      if (Object.keys(choiceStyles).includes(updateStyle)) {
        const newChoiceStyles = { ...choiceStyles };
        delete newChoiceStyles[updateStyle];
        setChoiceStyles(newChoiceStyles);
      } else {
        const newStyle = { color: 'grey', filter: 'brightness(50%)' };
        const newChoiceStyles = { ...choiceStyles, [updateStyle]: newStyle };
        setChoiceStyles(newChoiceStyles);
      }
    }
    setUpdateStyle(null);
  }, [updateStyle]);

  return (
    <div
      className={styles.selection}
      onClick={(e) => {
        e.stopPropagation();
      }}>
      {Album.map((peguin) => {
        const name = Object.keys(peguin)[0];
        const style = choiceStyles[name.toLowerCase()];
        return (
          <Choice
            key={name}
            photo={peguin[name]}
            peguin={name}
            style={style}
            setUpdateStyle={setUpdateStyle}
          />
        );
      })}
    </div>
  );
};
export default Selection;
