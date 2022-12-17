export default class FormField {
    constructor(value, parent, onChange) {
        this.value = value
        this.error = ''
        this.parent = parent
        this.isTouched = false
        this.set = onChange
    }
}