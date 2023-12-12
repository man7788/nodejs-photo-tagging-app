const gameOverReducer = (state, action) => {
  switch (action.type) {
    case 'save_start_time': {
      return {
        ...state,
        startTime: action.startTime,
      };
    }
    case 'game_over': {
      return {
        ...state,
        gameOver: action.gameOver,
        finishTime: action.finishTime,
      };
    }
    case 'show_popup': {
      return {
        ...state,
        showPopup: action.showPopup,
        finishClock: action.finishClock,
      };
    }
    case 'clear_highlights': {
      return {
        ...state,
        defaultCursor: action.defaultCursor,
        showTargetBoard: action.showTargetBoard,
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
};

export default gameOverReducer;
