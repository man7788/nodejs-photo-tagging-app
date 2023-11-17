import { useState, useEffect } from 'react';
import Target from './Target';

const TargetBoard = ({ names, updateTarget }) => {
  const [hitboxes, setHitboxes] = useState({});

  useEffect(() => {
    const hitboxObj = {};

    for (const name of names) {
      hitboxObj[name] = { top: '', left: '' };
    }

    setHitboxes(hitboxObj);
  }, [names]);

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
        newHitboxObj[name] = { ...newHitboxObj[name], border: 'none' };
      }

      setHitboxes(newHitboxObj);
    }
  }, [updateTarget]);

  return (
    <div>
      {names.map((name) => {
        const position = hitboxes[name];
        return <Target key={name} name={name} position={position} />;
      })}
    </div>
  );
};

export default TargetBoard;
