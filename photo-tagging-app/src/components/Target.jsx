import { useEffect, useRef, useContext } from 'react';
import styles from '../styles/Target.module.css';
import PropTypes from 'prop-types';
import { targetContext } from '../contexts/targetContext';

const Target = ({ name, targetStyle }) => {
  const targetDom = useRef(null);
  const { allTargets } = useContext(targetContext);

  useEffect(() => {
    allTargets.current[name] = targetDom.current;
  }, []);

  return (
    <div
      ref={targetDom}
      id={name}
      className={styles[name]}
      style={targetStyle}
      onClick={(e) => {
        e.stopPropagation();
      }}
      data-testid="target"></div>
  );
};

Target.propTypes = {
  name: PropTypes.string.isRequired,
  targetStyle: PropTypes.shape({
    border: PropTypes.string,
    top: PropTypes.number,
    left: PropTypes.number,
  }),
};

export default Target;
