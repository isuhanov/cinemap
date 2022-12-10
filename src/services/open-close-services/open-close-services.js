function openCard(data, setClass, showClassName, hideClassName,  setCurrent, setIsVisible, onReload, current=0, hideOtherCard=undefined) { // ф-ия открытия карточки локации
    console.log(`current = ${current}`);
    if (current === 0) {
      showCard(setClass, showClassName, setIsVisible, data, setCurrent ,hideOtherCard);
      onReload();
    } else {
      setClass(hideClassName);  
      setTimeout(() => {
        showCard(setClass, showClassName ,setIsVisible, data, setCurrent);
      }, 500);
    }
};

const closeCard = (setClass, className, setIsVisible, animationDuration, onReload, data=undefined, setCurrent=undefined) => {
    setClass(className);  
    setTimeout(() => {
        setIsVisible(false);
        data && setCurrent(data);
        onReload();
    }, animationDuration);
};

function showCard(setClass, className, setIsVisible, data=undefined, setCurrent=undefined, hideOtherCard=undefined) {
    hideOtherCard && hideOtherCard();
    data && setCurrent(data);
    setClass(className);  
    setIsVisible(true);
}

export { openCard, closeCard, showCard }