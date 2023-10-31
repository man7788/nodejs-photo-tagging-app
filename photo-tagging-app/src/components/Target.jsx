import styles from '../styles/Target.module.css';

const Target = ({ name, position, clickTarget }) => {
  return (
    <div
      id={name}
      className={styles[name]}
      style={position}
      onClick={clickTarget}
      data-testid="target"></div>
  );
};
export default Target;
