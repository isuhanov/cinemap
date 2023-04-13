function textFieldIsValid(formItem, max = undefined, min=0) { // ф-ия для валидации текстовых полей
    if (formItem.value.length === min) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: 'Пустое поле',
        })
    } else if (formItem.value.length > max) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: 'Слишком много символов',
        })
    } else {
        formItem.parent.current.classList.remove('error');
        formItem.set({
            error: '',
        })
    }
}


function loginFieldIsValid(formItem) {
    if (formItem.value.length === 0) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: 'Пустое поле',
        })
    } else if (formItem.value.length > 100) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: 'Слишком много символов',
        })
    } else if ((/[а-я]/.test(formItem.value.toLowerCase())) || !(/[a-z]/.test(formItem.value.toLowerCase()))) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: 'Логин должен содержать буквы латинского алфавита',
        })
    } else if (/[\\!-+(){}"'@:;/$%\^*.,]/.test(formItem.value)) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: `Логин не должен содержать символы \\!-+(){}"'@:;/$%^*.,`,
        })
    } else {
        formItem.parent.current.classList.remove('error');
        formItem.set({
            error: '',
        })
    }
}


function passswordFieldIsValid(formItem) {
    if (formItem.value.length < 8) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: 'Пароль должен быть длиннее 8 символов',
        })
    } else if (formItem.value.length > 100) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: 'Слишком много символов',
        })
    } else if (!(/[0-9]/.test(formItem.value)) || !(/[a-z]/.test(formItem.value.toLowerCase()))) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: 'Пароль должен содержать буквы латинского алфавита и цифры',
        })
    } else if (/[\\!-+(){}"'@:;/$%\^*.,]/.test(formItem.value)) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: `Пароль не должен содержать символы \\!-+(){}"'@:;/$%^*.,`,
        })
    } else {
        formItem.parent.current.classList.remove('error');
        formItem.set({
            error: '',
        })
    }
}


function timeFieldIsValid(formItem, max = undefined) { // ф-ия для валидации полей времени
    if (formItem.value.length === 0) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: 'Пустое поле'
        })
    } else if (formItem.value.length < 8) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: 'Поле не заполнено до конца'
        })
    } else {
        let timingArr = formItem.value.split(':');
        if (Number(timingArr[1]) > 59) {
            formItem.parent.current.classList.add('error');
            formItem.set({
                error: 'Кол-во минут превышает 59'
            })
        } else if (Number(timingArr[2]) > 59) {
            formItem.parent.current.classList.add('error');
            formItem.set({
                error: 'Кол-во секунд превышает 59'
            })
        } else {
            formItem.parent.current.classList.remove('error');
            formItem.set({
                error: '',
            })
        }
    }
}


function photosFieldIsValid({formItem, maxWidth=undefined, minWidth=0}) {
    if (formItem.value.filter(photo => !photo.isRemove).length < minWidth) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: `Минимальная длина - ${minWidth}`
        });
    } else if (formItem.value.filter(photo => !photo.isRemove).length > maxWidth) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: `Максимальная длина - ${maxWidth}`
        });
    } else {
        formItem.parent.current.classList.remove('error');
        formItem.set({
            error: '',
        });
    }
}


function formIsValid(form, isUpdate=false, optionalField=[]) {
    let isValid = true;
    for (const key in form) {
        if (!isUpdate) {
            // если значение поля формы пустое, то вывести сообщение об ошибке
            if (form[key].value.length === 0 && !optionalField.includes(key)) {
                form[key].set({
                    error: 'Пустое поле'
                });
                form[key].parent.current.classList.add('error');
                isValid = false;
            }
        }
        // если имеется ошибка, то форма не валидна
        if (form[key].error !== '') {
            isValid = false;
        }
    }
    return isValid
}


export { photosFieldIsValid, textFieldIsValid, timeFieldIsValid, loginFieldIsValid, passswordFieldIsValid, formIsValid }