function openCard(card, setCard, onReload,  closeOther,data=undefined){
  if (card.current === 0) {
    showCard(card, setCard, data, closeOther)
    onReload();
  } else {
    setCard(prev => ({
      ...prev,
      visibleClass: `hided-${card.animatioType}`
    }))
    setTimeout(() => {
      showCard(card, setCard, data, closeOther)
    }, 500);
  }
};

const closeCard = (card, setCard, onReload, data=undefined) => {
    setCard(prev => ({
      ...prev,
      visibleClass: `hided-${card.animatioType}`
    }))
    setTimeout(() => {
        setCard(prev => ({
          ...prev,
          isVisible: false,
          current: data || card.current,
        }))
        onReload();
    }, 600);
};

function showCard(card, setCard, data=undefined, hideOtherCard=undefined) {
    hideOtherCard && hideOtherCard();
    setCard(prev => ({
      ...prev,
      current: data || card.current,
      visibleClass: `showed-${card.animatioType}`,
      isVisible: true
    }))
}

export { openCard, closeCard, showCard }