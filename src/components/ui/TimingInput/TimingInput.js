import { memo, useRef, useState } from "react";

import './TimingInput.css'

const TimingInput = memo(() => {
    // const [value, setValue] = useState('00:00:00');
    const [value, setValue] = useState('');

    const inputRef = useRef();

    function setTimingValue(event) {
        if (!(event.target.value.split(':').reduce((res ,el) => !isNaN(el), true))) return;  // если элемент между ':' не является числом, то возвращается false (выход из функции); (isNaN('123') = false - проверка на число)
        
        let lastValue = value;
        let timingValue = event.target.value;
        if (timingValue.length < 9){
            if (event.target.selectionEnd === 2 || event.target.selectionEnd === 5) {
                if (lastValue.length < timingValue.length) {
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
            <input  placeholder={ value.length>0 ? '' : '00:00:00' } ref={inputRef} id="location-timing" value={value} onChange={(e) => setTimingValue(e)} className="timing-input"/>
        </>
    );
});

export default TimingInput;