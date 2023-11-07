import styles from '../styles/Target.module.css';

const Target = ({ name, position }) => {
  return (
    <div
      id={name}
      className={styles[name]}
      style={position}
      data-testid="target"></div>
  );
};
export default Target;
