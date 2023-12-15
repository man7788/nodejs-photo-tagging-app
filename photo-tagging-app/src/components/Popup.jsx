import styles from '../styles/Popup.module.css';
import { useState } from 'react';
import PropTypes from 'prop-types';
import useToken from '../api/tokenAPI';
import { submitScoreAPI } from '../api/scoreAPI';
import Highscore from './Highscore';

const Popup = ({ finishTime, finishClock, showInput }) => {
  const { token, tokenError, tokenLoading } = useToken();

  const [popupStyle, setPopupStyle] = useState({ display: 'flex' });
  const [name, setName] = useState('');
  const [showTable, setShowTable] = useState(false);

  const [serverError, setServerError] = useState(false);
  const [formErrors, setFormErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const onhandleChange = (e) => {
    setName(e.target.value);
  };

  const onSubmitTask = (e) => {
    e.preventDefault();
    setLoading(true);

    submitScore(e);
    setName('');
  };

  const submitScore = async (e) => {
    e.preventDefault();

    const scoreObj = { name, time: finishTime };

    const result = await submitScoreAPI(token, scoreObj);

    if (result && result.error === 'server error') {
      setServerError(true);
    } else if (result && result.message === 'form validation error') {
      setFormErrors(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      setShowTable(true);
      setPopupStyle({ display: 'none' });
    }
  };

  if (serverError || tokenError) {
    return (
      <div>
        <h1>A network error was encountered</h1>
      </div>
    );
  }

  if (loading || tokenLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className={styles.Popup} style={popupStyle} data-testid="popup">
        <div className={styles.header} data-testid="popup-header">
          <div>Congratulations!</div>
        </div>
        <div className={styles.score}>
          <div>Finish Time:</div>
          <div>{finishClock}</div>
        </div>
        {showInput && (
          <form method="post" onSubmit={onSubmitTask}>
            <div>Submit Your Score</div>
            <label htmlFor="name">Name:</label>
            <input
              onChange={onhandleChange}
              value={name}
              type="text"
              id="name"
            />
            {formErrors && (
              <ul>
                {formErrors.map((error) => (
                  <li key={error.msg}>{error.msg}</li>
                ))}
              </ul>
            )}
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
      {showTable && <Highscore />}
    </div>
  );
};

Popup.propTypes = {
  finishTime: PropTypes.number.isRequired,
  finishClock: PropTypes.string.isRequired,
};

export default Popup;
