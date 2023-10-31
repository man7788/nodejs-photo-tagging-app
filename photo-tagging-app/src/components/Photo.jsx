import styles from '../styles/Photo.module.css';

const Photo = ({ photo, peguin, style }) => {
  return (
    <div className={styles.Photo} style={style} data-testid="photo">
      <img src={photo} alt={peguin} />
      {peguin}
    </div>
  );
};
export default Photo;
