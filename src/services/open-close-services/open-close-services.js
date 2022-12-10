function openCard(data, setClass, showClassName, hideClassName,  setCurrent, setIsVisible, onReload, current=0, hideOtherCard=undefined) { // ф-ия открытия карточки локации
    console.log(`current = ${current}`);
    if (current === 0) {
      showCard(data, setCurrent, setClass, showClassName, setIsVisible, hideOtherCard);
      onReload();
    } else {
      setClass(hideClassName);  
      setTimeout(() => {
        showCard(data, setCurrent, setClass, showClassName, setIsVisible);
      }, 500);
    }
};

const closeCard = (setClass, className, setIsVisible, setCurrent, data, onReload) => {
    setClass(className);  
    setTimeout(() => {
        setIsVisible(false);
        setCurrent(data);
        onReload();
    }, 600);
};

function showCard(data, setCurrent, setClass, className, setIsVisible, hideOtherCard=undefined) {
    // debugger;
    hideOtherCard && hideOtherCard();
    setCurrent(data);
    setClass(className);  
    setIsVisible(true);
}

export { openCard, closeCard, showCard }