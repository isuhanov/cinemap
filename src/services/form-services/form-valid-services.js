function textFieldIsValid(formItem, max = undefined) { // ф-ия для валидации текстовых полей
    if (formItem.value.length === 0) {
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

function photosFieldIsValid({ formItem, maxWidth=undefined, isUpdate=false, photos=undefined, typePhoto=undefined }) { // ф-ия для валидации полей фотографий
    let fieldIsValid = true;
    if (formItem.value.length === 0 && !isUpdate) {
    // if (formItem.value.length === 0) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: 'Пустое поле'
        })
        fieldIsValid = false;
    } else if (formItem.value.length > maxWidth) {
        formItem.parent.current.classList.add('error');
        formItem.set({
            error: 'Можно внести только 1 элемент'
        })
        fieldIsValid = false;
    } else {
        const extentions = ['jpg', 'jpeg', 'png', 'svg', 'webp']
        formItem.value.forEach(file => {
            if (!extentions.includes(file.name.split('.').pop().toLowerCase())) {
                formItem.parent.current.classList.add('error');
                formItem.set({
                    error: 'Разрешены только файлы с расширениеми: jpg, jpeg, png, svg, webp'
                })
                fieldIsValid = false;
            }                    
        });
    }

    if (isUpdate) {
        const countPhoto = photos.filter(photo => photo.photo.locations_photo_status === typePhoto).length;
        const countRemovedPhoto = photos.filter(photo => (photo.photo.locations_photo_status === typePhoto && photo.status === false)).length;

        if (formItem.value.length === 0 && countPhoto === countRemovedPhoto) {
            formItem.parent.current.classList.add('error');
            formItem.set({
                error: 'Должна иметься хотя бы одна фотография'
            });
            fieldIsValid = false;
        } 
    }
    
    if (fieldIsValid) {
        formItem.parent.current.classList.remove('error');
        formItem.set({
            error: '',
        })
    }
}

function formIsValid(form, isUpdate=false) {
    let isValid = true;
    for (const key in form) {
        if (!isUpdate) {
            // если значение поля формы пустое, то вывести сообщение об ошибке
            if (form[key].value.length === 0) {
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


export { photosFieldIsValid, textFieldIsValid, timeFieldIsValid, formIsValid }