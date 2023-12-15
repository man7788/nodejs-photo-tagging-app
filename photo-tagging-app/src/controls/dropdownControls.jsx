const manageDropdown = (e, showPopup, gameState, gameDispatch) => {
  e.stopPropagation();

  if (!showPopup && !gameState.loading) {
    const target = e.target.getBoundingClientRect();

    const dropdownY = e.pageY - target.y;
    const dropdownX = e.pageX - target.x;

    const position = {
      menu: {
        top: `${dropdownY + 19}px`,
        left: `${dropdownX + 19}px`,
      },
      box: {
        top: `${dropdownY - 28}px`,
        left: `${dropdownX - 28}px`,
      },
    };

    gameDispatch({
      type: 'show_dropdown',
      showTryAgain: false,
      clickPos: { top: dropdownY, left: dropdownX },
      updateDropdown: { position },
      showDropdown: true,
      cursor: { cursor: 'default' },
    });
  } else {
    return;
  }
};

export default manageDropdown;
