import styles from '../styles/Target.module.css';
import PropTypes from 'prop-types';

const Target = ({ name, targetStyle }) => {
  return (
    <div
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
