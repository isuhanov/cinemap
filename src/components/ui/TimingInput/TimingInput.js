import { memo } from "react";

import './TimingInput.css'

// компонент поля ввода тайминга
const TimingInput = memo(({ value, setValue }) => {
    function setTimingValue(event) {
        if (!(event.target.value.split(':').reduce((res ,el) => !isNaN(el), true))) return;  // если элемент между ':' не является числом, то возвращается false (выход из функции); (isNaN('123') = false - проверка на число)
        
        let lastValue = value;
        let timingValue = event.target.value;
        if (timingValue.length < 9){
            if (event.target.selectionEnd === 2 || event.target.selectionEnd === 5) {
                if (lastValue.length < timingValue.length && (timingValue.split(':').length - 1 !== 2)) {
                    timingValue += ':';  
                } else {
                    timingValue = timingValue.slice(0, -1);
                }
            }
            setValue(timingValue);
        }

    }

    return(
        <>
            <input autoComplete="off" placeholder={ value.length>0 ? '' : 'чч:мм:сс' } id="location-timing" value={value} onChange={(e) => setTimingValue(e)} className="timing-input"/>
        </>
    );
});

export default TimingInput;