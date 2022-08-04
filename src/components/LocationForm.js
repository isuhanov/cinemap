import { memo } from "react";
import DragAndDropFiles from "./ui/DragAndDropFiles/DragAndDropFiles";
import TimingInput from "./ui/TimingInput/TimingInput";

const LocationForm = memo(() => {

    return (
        <div className="location-form-container">
            <div className="location-form">
                <header className="location-card__header">
                    <p className="location-title title">
                        Добавление локации:
                    </p>
                    <div className="location-card__btn-container">
                        <button className="location-card__btn">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </header>
                <div className="location-form__main">
                    <form>
                        <div className="field-block">
                            <label htmlFor="location-name">
                                Название локации:
                            </label>
                            <input id="location-name" className="field"/>
                        </div>

                        <div className="field-block">
                            <label htmlFor="location-film">
                                Название фильма:
                            </label>
                            <input id="location-film" className="field"/>
                        </div>

                        <div className="field-block">
                            <label htmlFor="location-route">
                                Как пройти:
                            </label>
                            <textarea id="location-route" className="field-route"></textarea>
                        </div>

                        <div className="field-block timing-block">
                            <label htmlFor="location-timing">
                                Тайминг:
                            </label>
                            <TimingInput />
                        </div>

                        <div className="field-block">
                            <label>
                                Фото из фильма:                              
                            </label>
                            <DragAndDropFiles />
                        </div>

                        <div className="field-block">
                            <label>
                                Ваши фото локации:                               
                            </label>
                            <DragAndDropFiles />
                        </div>
                    </form>
                </div>
                <footer>
                    <div className="location-form-btn-container">
                        <button className="location-card-btn location-card-btn-edit">
                            Сохранить
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    )
});

export default LocationForm;