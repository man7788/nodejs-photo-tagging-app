import styles from '../styles/Prompt.module.css';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Prompt = ({ tryAgain }) => {
  const [style, setStyle] = useState({ display: 'none' });
  const [timeoutId, setTimeouId] = useState('');

  useEffect(() => {
    if (tryAgain) {
      setStyle({ display: 'flex' });
      const timeout = setTimeout(() => {
        setStyle({ display: 'none' });
      }, 2000);
      setTimeouId(timeout);
    } else {
      clearTimeout(timeoutId);
      setStyle({ display: 'none' });
    }
  }, [tryAgain]);

  return (
    <h2
      className={styles.prompt}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
      }}
      data-testid="prompt">
      Try Again!
    </h2>
  );
};

Prompt.propTypes = {
  tryAgain: PropTypes.bool.isRequired,
};

export default Prompt;
