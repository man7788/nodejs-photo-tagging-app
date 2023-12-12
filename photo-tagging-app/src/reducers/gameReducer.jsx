const gameReducer = (state, action) => {
  switch (action.type) {
    case 'show_dropdown': {
      return {
        ...state,
        showTryAgain: action.showTryAgain,
        clickPos: action.clickPos,
        updateDropdown: action.updateDropdown,
        showDropdown: action.showDropdown,
        cursor: action.cursor,
      };
    }
    case 'click_menu': {
      return {
        ...state,
        showDropdown: action.showDropdown,
        cursor: action.cursor,
      };
    }
    case 'show_try_again': {
      return {
        ...state,
        showTryAgain: action.showTryAgain,
      };
    }
    case 'hide_try_again': {
      return {
        ...state,
        showTryAgain: action.showTryAgain,
      };
    }
    case 'show_server_error': {
      return {
        ...state,
        serverError: action.serverError,
      };
    }
    case 'update_style': {
      return {
        ...state,
        updateTarget: action.updateTarget,
        updateIcon: action.updateIcon,
      };
    }
    case 'set_new_score': {
      return {
        ...state,
        score: action.score,
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
};

export default gameReducer;
