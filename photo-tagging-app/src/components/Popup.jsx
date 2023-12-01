import styles from '../styles/Popup.module.css';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useToken from '../api/tokenAPI';
import { submitScoreAPI } from '../api/scoreAPI';
import Highscore from './Highscore';

const Popup = ({ updatePopup, score }) => {
  const { token, tokenError, tokenLoading } = useToken();

  const [popupStyle, setPopupStyle] = useState({ display: 'none' });
  const [name, setName] = useState('');
  const [showTable, setShowTable] = useState(false);

  const [serverError, setServerError] = useState(false);
  const [formErrors, setFormErrors] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (updatePopup && updatePopup.show) {
      setPopupStyle({ display: 'flex' });
    }
  }, [updatePopup]);

  const onhandleChange = (e) => {
    setName(e.target.value);
  };

  const onSubmitTask = (e) => {
    e.preventDefault();

    submitScore(e);
    setName('');
  };

  const submitScore = async (e) => {
    e.preventDefault();

    const scoreObj = { name, time: score };

    const result = await submitScoreAPI(token, scoreObj);

    if (result && result.error === 'server error') {
      setServerError(true);
    } else if (result && result.message === 'form validation error') {
      setFormErrors(result.error);
    } else {
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
          <div>Congraulations!</div>
        </div>
        <div className={styles.score}>
          <div>Finish Time:</div>
          <div>{score}</div>
        </div>
        <form method="post" onSubmit={onSubmitTask}>
          <div>Submit Your Score</div>
          <label htmlFor="name">Name:</label>
          <input onChange={onhandleChange} value={name} type="text" id="name" />
          {formErrors && (
            <ul>
              {formErrors.map((error) => (
                <li key={error.msg}>{error.msg}</li>
              ))}
            </ul>
          )}
          <button type="submit">Sumbit</button>
        </form>
      </div>
      {showTable && <Highscore showHomeButton={true} />}
    </div>
  );
};

Popup.propTypes = {
  updatePopup: PropTypes.shape({
    show: PropTypes.bool.isRequired,
  }).isRequired,
  score: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};

export default Popup;
