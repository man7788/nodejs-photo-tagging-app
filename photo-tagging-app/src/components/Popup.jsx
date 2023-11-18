import { useState, useEffect } from 'react';
import apiDomain from '../api/apiDomain';
import styles from '../styles/Popup.module.css';
import Highscore from './Highscore';

const Popup = ({ updatePopup, score }) => {
  const api = apiDomain();

  const [popupStyle, setPopupStyle] = useState({ display: 'none' });
  const [name, setName] = useState('');
  const [showTable, setShowTable] = useState(false);

  const [serverError, setServerError] = useState(false);
  const [formErrors, setFormErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState('');

  useEffect(() => {
    if (updatePopup && updatePopup.show) {
      setPopupStyle({ display: 'flex' });
    }
  }, [updatePopup]);

  useEffect(() => {
    fetch(`${api}/token`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ handler: 'penguins' }),
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error('server error');
        }
        return response.json();
      })
      .then((response) => {
        setToken(response.token);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const onhandleChange = (e) => {
    setName(e.target.value);
  };

  const onSubmitTask = (e) => {
    e.preventDefault();
    submitScore(e);
    setName('');
  };

  const submitScore = (e) => {
    e.preventDefault();

    const scoreObj = { name, time: score };

    //API POST
    fetch(`${api}/score/create`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(scoreObj),
    })
      .then((response) => {
        if (response.status >= 400) {
          setServerError(true);
          throw new Error('server error');
        }
        return response.json();
      })
      .then((response) => {
        if (response && response.errors) {
          setFormErrors(response.errors);
          throw new Error('form validation error');
        }
        console.log('Success:', response);
        setShowTable(true);
        setPopupStyle({ display: 'none' });
      })
      .catch((error) => {
        if (error && error.message !== 'form validation error') {
          setServerError(error);
        }
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  if (serverError) {
    return (
      <div>
        <h1>A network error was encountered</h1>
      </div>
    );
  }

  if (loading) {
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
          <div>Finish Time:</div>
          <div>{score}</div>
        </div>
        <form method="post" onSubmit={onSubmitTask}>
          <label htmlFor="name">Your Name:</label>
          <input onChange={onhandleChange} value={name} type="text" id="name" />
          {formErrors ? (
            <ul>
              {formErrors.map((error) => (
                <li key={error.msg}>{error.msg}</li>
              ))}
            </ul>
          ) : null}
          <button type="submit">Sumbit Your Score</button>
        </form>
      </div>
      {showTable && <Highscore />}
    </div>
  );
};

export default Popup;
