import { useState } from 'react';
import styles from '../styles/Popup.module.css';

const Popup = ({ style, score, setShowTable }) => {
  const [name, setName] = useState('');
  const [show, setShow] = useState(true);

  const [serverError, setServerError] = useState(false);
  const [formErrors, setFormErrors] = useState(null);
  const [loading, setLoading] = useState(false);

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

    const addScore = (input) => {
      input = input.split(':');
      return Number(input[0] + input[1] + input[2]);
    };
    const totalScore = addScore(score);
    const scoreObj = { name, time: score, score: totalScore };
    console.log(scoreObj);

    //API POST
    fetch(`http://localhost:3000/score/create`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
        setShow(false);
        setShowTable(true);
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
    <div className={styles.Popup} style={show ? style : { display: 'none' }}>
      <div className={styles.header}>
        <div>Congraulations!</div>
        <div>Your Finish Time:</div>
        <div>{score}</div>
      </div>
      <form method="post" onSubmit={onSubmitTask}>
        <label htmlFor="name">Your Name:</label>
        <input onChange={onhandleChange} value={name} type="text" id="name" />
        <button type="submit">Sumbit Your Score</button>
      </form>
      {formErrors ? (
        <ul>
          {formErrors.map((error) => (
            <li key={error.msg}>{error.msg}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default Popup;
