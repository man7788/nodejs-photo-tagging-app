import styles from '../styles/Prompt.module.css';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Prompt = ({ dispatch }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch({ type: 'hide_try_again', showTryAgain: false });
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
  dispatch: PropTypes.func.isRequired,
};

export default Prompt;
