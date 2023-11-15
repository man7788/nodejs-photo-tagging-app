import styles from '../styles/Frame.module.css';
import Album from '../images/Album';
import Photo from './Photo';

const Frame = ({ iconStyles }) => {
  return (
    <div
      className={styles.frame}
      onClick={(e) => {
        e.stopPropagation();
      }}>
      {Album.map((peguin) => {
        const name = Object.keys(peguin);
        const style = iconStyles[name[0].toLowerCase()];
        return (
          <Photo
            key={name[0]}
            photo={peguin[name[0]]}
            peguin={name[0]}
            style={style}
          />
        );
      })}
    </div>
  );
};
export default Frame;
