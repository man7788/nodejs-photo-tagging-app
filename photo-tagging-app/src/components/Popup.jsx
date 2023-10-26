import { useState, useEffect } from 'react';
import styles from '../styles/Popup.module.css';

const Popup = ({ style, score, setShowTable }) => {
  const [name, setName] = useState('');
  const [show, setShow] = useState(true);

  // const handleChange = (e) => {
  //   setName(e.target.value);
  // };

  // const onSubmitTask = (e) => {
  //   e.preventDefault();
  //   submitScore();
  //   setName('');
  // };

  // const submitScore = async () => {
  //   const addScore = (input) => {
  //     input = input.split(':');
  //     return Number(input[0] + input[1] + input[2]);
  //   };
  //   if (name !== '') {
  //     const totalScore = addScore(score);
  //     const scoreObj = { name, time: score, score: totalScore };
  //     await addDoc(scoreRef, scoreObj);
  //     console.log(scoreObj);
  //     setShow(false);
  //     setShowTable(true);
  //   } else {
  //     alert('Please Enter Your Name');
  //   }
  // };

  return (
    <div className={styles.Popup} style={style}>
      <div className="header">
        <div>Congraulations!</div>
        <div>Your Finish Time:</div>
        <div>{score}</div>
      </div>
      {/* <form>
        <label htmlFor="name">Your Name:</label>
        <input onChange={handleChange} value={name} type="text" id="name" />
        <button type="submit" onClick={onSubmitTask}>
          Sumbit Your Score
        </button>
      </form> */}
    </div>
  );
};

export default Popup;
