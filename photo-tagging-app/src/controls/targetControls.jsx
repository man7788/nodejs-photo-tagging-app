import { checkTargetAPI } from '../api/targetAPI';

const manageTargets = (e, names, allTargets, clickPos, score, gameDispatch) => {
  const clickMenu = (e) => {
    e.stopPropagation();

    gameDispatch({
      type: 'click_menu',
      showDropdown: false,
      cursor: { cursor: 'pointer' },
      loading: true,
    });

    const selection = e.target.textContent.toLowerCase();
    if (names.includes(selection)) {
      const element = allTargets.current[selection];
      const range = {
        topRange: element.clientHeight,
        leftRange: element.clientWidth,
      };
      checkTarget(selection, range);
    }
  };

  const checkTarget = async (selection, range) => {
    const postData = {
      selection: selection,
      position: clickPos,
      range: range,
    };

    const result = await checkTargetAPI(postData);

    if (result && result.result) {
      updateStyle(result.position, selection);
    } else {
      gameDispatch({
        type: 'show_try_again',
        showTryAgain: true,
        loading: false,
      });
    }

    if (result && result.error) {
      gameDispatch({ type: 'show_server_error', serverError: true });
    }
  };

  const updateStyle = (position, selection) => {
    const targetData = { position, selection };

    const iconData = selection;

    gameDispatch({
      type: 'update_style',
      updateTarget: targetData,
      updateIcon: iconData,
      loading: false,
    });

    checkScore(selection);
  };

  const checkScore = (selection) => {
    const newList = [...score];
    if (!score.includes(selection)) {
      newList.push(selection);
      gameDispatch({
        type: 'set_new_score',
        score: newList,
      });
    }
  };

  clickMenu(e);
};

export default manageTargets;
