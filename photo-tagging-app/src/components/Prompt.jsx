import styles from '../styles/Prompt.module.css';
import { useEffect, useState } from 'react';

const Prompt = () => {
  const [style, setStyle] = useState({ display: 'flex' });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStyle({ display: 'none' });
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

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

export default Prompt;
