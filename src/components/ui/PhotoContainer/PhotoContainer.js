import { memo } from "react";

import './PhotoContainer.css'

const PhotoContainer = memo(({ photos = [], isUpdate, onClickRemove }) => {


    return (
        <div className="photo-container">
            { photos.map((photo) => (
                        <div className="photo-item" key={photo.id}>
                            <img src={photo.path} alt={photo.id}/>
                            { isUpdate && // отобража кнопку удаления, если открыта форма добавления
                                <>
                                    <button onClick={(e) => onClickRemove(photo.id)} type="button" className="photo-remove-btn">
                                        <span className="material-symbols-outlined">
                                            close
                                        </span>
                                    </button>
                                    <div className={`removed ${photo.isRemove ? 'isActive' : ''}`}></div>
                                </>
                            }
                        </div>
                    )
            )}
        </div>
    );
});

export default PhotoContainer;