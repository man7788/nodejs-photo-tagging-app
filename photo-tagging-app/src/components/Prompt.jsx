import styles from '../styles/Prompt.module.css';
import { useEffect, useState } from 'react';

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
      }}>
      Try Again!
    </h2>
  );
};

export default Prompt;
