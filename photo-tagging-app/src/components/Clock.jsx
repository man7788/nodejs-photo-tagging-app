import styles from '../styles/Clock.module.css';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Clock = ({ gameover, setUpdatePopup, setScore }) => {
  const [clock, setClock] = useState();
  const [time, setTime] = useState({ s: 0, m: 0, h: 0 });
  const [clockTimeout, setClockTimeout] = useState(null);

  const startTime = () => {
    const obj = { ...time };

    if (time.s < 59) {
      obj.s = time.s + 1;
    } else if (time.s === 59 && time.m < 59) {
      obj.s = 0;
      obj.m = time.m + 1;
    } else if (time.s === 59 && time.m === 59) {
      obj.s = 0;
      obj.m = 0;
      obj.h = time.h + 1;
    }

    setTime(obj);
  };

  useEffect(() => {
    if (gameover === true) {
      clearTimeout(clockTimeout);
      setUpdatePopup({ show: true });
      setScore(clock);
    }
  }, [gameover]);
  useEffect(() => {
    if (gameover !== true) {
      setClockTimeout(setTimeout(startTime, 1000));

      let s = time.s;
      let m = time.m;
      let h = time.h;

      if (time.s < 10) {
        s = '0' + time.s;
      }

      if (time.m < 10) {
        m = '0' + time.m;
      }

      if (time.h < 10) {
        h = '0' + time.h;
      }

      const newClock = `${h}:${m}:${s}`;

      setClock(newClock);
    }
  }, [time]);

  return (
    <div
      className={styles.Clock}
      data-testid="clock"
      onClick={(e) => {
        e.stopPropagation();
      }}>
      {clock}
    </div>
  );
};

Clock.propTypes = {
  gameover: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  setUpdatePopup: PropTypes.func.isRequired,
  setScore: PropTypes.func.isRequired,
};

export default Clock;
