function openCard(card, setCard, onReload,  closeOther,data=undefined){
  // console.log(`current = ${current}`);
  if (card.current === 0) {
    showCard(card, setCard, data, closeOther)
    onReload();
  } else {
    setCard(prev => ({
      ...prev,
      visibleClass: 'hided-slide'
    }))
    setTimeout(() => {
      showCard(card, setCard, data, closeOther)
    }, 500);
  }
};

const closeCard = (card, setCard, onReload, data=undefined) => {
    // setClass(className);  
    setCard(prev => ({
      ...prev,
      visibleClass: 'hided-slide'
    }))
    setTimeout(() => {
        // setIsVisible(false);
        // data && setCurrent(data);
        setCard(prev => ({
          ...prev,
          isVisible: false,
          current: data || card.current,
        }))
        onReload();
    }, 600);
};

function showCard(card, setCard, data=undefined, hideOtherCard=undefined) {
    // if (card.parent === 'App') {
    //   // скрыть другие
    // }
    hideOtherCard && hideOtherCard();
    setCard(prev => ({
      ...prev,
      current: data || card.current,
      visibleClass: 'showed-slide',
      isVisible: true
    }))
}

// function openCard(data, setClass, showClassName, hideClassName,  setCurrent, setIsVisible, onReload, current=0, hideOtherCard=undefined) { // ф-ия открытия карточки локации
//     console.log(`current = ${current}`);
//     if (current === 0) {
//       showCard(setClass, showClassName, setIsVisible, data, setCurrent ,hideOtherCard);
//       onReload();
//     } else {
//       setClass(hideClassName);  
//       setTimeout(() => {
//         showCard(setClass, showClassName ,setIsVisible, data, setCurrent);
//       }, 500);
//     }
// };

// const closeCard = (setClass, className, setIsVisible, animationDuration, onReload, data=undefined, setCurrent=undefined) => {
//     setClass(className);  
//     setTimeout(() => {
//         setIsVisible(false);
//         data && setCurrent(data);
//         onReload();
//     }, animationDuration);
// };

// function showCard(setClass, className, setIsVisible, data=undefined, setCurrent=undefined, hideOtherCard=undefined) {
//     hideOtherCard && hideOtherCard();
//     data && setCurrent(data);
//     setClass(className);  
//     setIsVisible(true);
// }

export { openCard, closeCard, showCard }