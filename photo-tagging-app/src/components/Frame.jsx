import styles from '../styles/Frame.module.css';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Album from '../images/Album';
import Photo from './Photo';

const Frame = ({ updateIcon }) => {
  const [iconStyles, setIconStyles] = useState({});

  useEffect(() => {
    const newStyle = { color: 'grey', filter: 'brightness(50%)' };
    const newIconStyles = { ...iconStyles, [updateIcon]: newStyle };
    setIconStyles(newIconStyles);
  }, [updateIcon]);

  return (
    <div
      className={styles.frame}
      onClick={(e) => {
        e.stopPropagation();
      }}>
      {Album.map((peguin) => {
        const name = Object.keys(peguin)[0];
        const style = iconStyles[name.toLowerCase()];
        return (
          <Photo key={name} photo={peguin[name]} peguin={name} style={style} />
        );
      })}
    </div>
  );
};

Frame.propTypes = {
  updateIcon: PropTypes.string.isRequired,
};

export default Frame;
