import styles from '../styles/Frame.module.css';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Album from '../images/Album';
import Photo from './Photo';

const Frame = ({ updateIcon, names }) => {
  const [iconStyles, setIconStyles] = useState({});
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    const newIcons = [];

    names.forEach((name) => {
      const nameToMatch = name[0].toUpperCase() + name.slice(1);
      Album.forEach((peguin) => {
        if (Object.keys(peguin)[0] === nameToMatch) {
          newIcons.push(peguin);
        }
      });
    });

    setIcons(newIcons);
  }, [names]);

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
      {icons.map((peguin) => {
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
