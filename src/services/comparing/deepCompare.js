import { isArray, isObject, isSameType } from "./helpers";

export default function deepCompare(obj1, obj2) { // глубокое сравнение
    if (obj1 === obj2) { // если элементы одинаковы, то true
        return true;
    }

    if ( // если элементы не объекты и не массивы (то есть примитивы), то false (т.к они не прошли проверку на равенство выше)
        !isObject(obj1) && !isArray(obj1) 
        ||
        !isObject(obj2) && !isArray(obj2)
    ) {
        return false;
    }

    if (
        !isSameType(obj1, obj2) // если элементы имеют разные типы, то false
        ||
        Object.keys(obj1).length !== Object.keys(obj2).length // если элементы имеют разное кол-во ключей, то false
    ) {
        return false;
    }

    for (const key of Object.keys(obj1)) { // если кол-во ключей совпало, то
        if (!obj2.hasOwnProperty(key)) {  // если элемент2 не имеет ключей элемента 1, то false
            return false;
        }

        if(!deepCompare(obj1[key], obj2[key])) { // ессли ключи совпали, то рекурсивно проверям содержимое, если не равны, то false
            return false;
        }
    }

    return true;
}