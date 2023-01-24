import { useCallback, useState } from "react";
import { closeCard, openCard, showCard } from "../open-close-services/open-close-services";

export default function useOpen(animatioType, onReload, current=undefined) { // хук для открытия элементов
    const [openElement, setOpenElement] = useState({
        current,
        isVisible: false,
        visibleClass: '',
        animatioType
      });
    const show = useCallback(() => { // ф-ия для откытия формы локации
        showCard(openElement, setOpenElement);
    });
    
    function open(data, closeOther=undefined) {
        openCard(openElement, setOpenElement, onReload, 
                closeOther, 
                data);
    }

    const close = useCallback(() => { // ф-ия для закрытия формы локации
        closeCard(openElement, setOpenElement, onReload, current);
    });

    return [openElement, current === undefined ? show: open, close];
}