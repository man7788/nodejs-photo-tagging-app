import styles from '../styles/Prompt.module.css';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Prompt = ({ setShowTryAgain }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowTryAgain(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <h2
      className={styles.prompt}
      onClick={(e) => {
        e.stopPropagation();
      }}
      data-testid="prompt">
      Try Again!
    </h2>
  );
};

Prompt.propTypes = {
  setShowTryAgain: PropTypes.func.isRequired,
};

export default Prompt;
