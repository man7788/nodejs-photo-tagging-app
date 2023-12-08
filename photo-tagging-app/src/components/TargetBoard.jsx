import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Target from './Target';

const TargetBoard = ({ names, updateTarget }) => {
  const [hitboxes, setHitboxes] = useState({});

  useEffect(() => {
    if (updateTarget && updateTarget.position) {
      const newTargetbox = {
        border: '3px solid cyan',
        top: updateTarget.position.top,
        left: updateTarget.position.left,
      };
      const newHitboxes = {
        ...hitboxes,
        [updateTarget.selection]: newTargetbox,
      };
      setHitboxes(newHitboxes);
    }

    if (updateTarget && updateTarget.gameover) {
      let newHitboxObj = { ...hitboxes };
      const names = Object.keys(newHitboxObj);

      for (const name of names) {
        newHitboxObj[name] = { ...newHitboxObj[name], display: 'none' };
      }

      setHitboxes(newHitboxObj);
    }
  }, [updateTarget]);

  return (
    <>
      {names.map((name) => {
        const targetStyle = hitboxes[name];
        return <Target key={name} name={name} targetStyle={targetStyle} />;
      })}
    </>
  );
};

TargetBoard.propTypes = {
  names: PropTypes.array.isRequired,
  updateTarget: PropTypes.shape({
    position: PropTypes.shape({
      top: PropTypes.number,
      left: PropTypes.number,
    }),
    selection: PropTypes.string,
  }).isRequired,
};

export default TargetBoard;
