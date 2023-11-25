import styles from '../styles/Photo.module.css';
import PropTypes from 'prop-types';

const Photo = ({ photo, peguin, style }) => {
  return (
    <div className={styles.Photo} style={style} data-testid="photo">
      <img src={photo} alt={peguin} />
      {peguin}
    </div>
  );
};

Photo.propTypes = {
  photo: PropTypes.string.isRequired,
  peguin: PropTypes.string,
  style: PropTypes.shape({
    color: PropTypes.string,
    filter: PropTypes.string,
  }),
};

export default Photo;
