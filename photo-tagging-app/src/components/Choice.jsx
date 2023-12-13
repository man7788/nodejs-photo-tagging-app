import styles from '../styles/Choice.module.css';
// import PropTypes from 'prop-types';

const Choice = ({ photo, peguin, style, setUpdateStyle }) => {
  const onChangeStyle = (e) => {
    const target = e.target.alt.toLowerCase();
    setUpdateStyle(target);
  };
  return (
    <div className={styles.Choice} style={style} data-testid="photo">
      <img src={photo} alt={peguin} onClick={onChangeStyle} />
      {peguin}
    </div>
  );
};

// Photo.propTypes = {
//   photo: PropTypes.string.isRequired,
//   peguin: PropTypes.string,
//   style: PropTypes.shape({
//     color: PropTypes.string,
//     filter: PropTypes.string,
//   }),
// };

export default Choice;
