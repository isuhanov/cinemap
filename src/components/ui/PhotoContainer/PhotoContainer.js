import { memo } from "react";

import './PhotoContainer.css'

const PhotoContainer = memo(({ photos, isUpdate, onRemovePhotos }) => {
    function onClickRemove(photoId, e) {
        onRemovePhotos(photoId);
        document.getElementById(`removed${photoId}`).classList.toggle('isActive'); // помечаем элемент как удаляемый
    }

    return (
        <div className="photo-container">
            { photos.map((photo) => (
                        <div className="photo-item" key={photo.locations_photo_id}>
                            <img src={photo.locations_photo_path}/>
                            { isUpdate && // отобража кнопку удаления, если открыта форма добавления
                                <>
                                    <button onClick={(e) => onClickRemove(photo.locations_photo_id, e)} type="button" className="photo-remove-btn">
                                        <span className="material-symbols-outlined">
                                            close
                                        </span>
                                    </button>
                                    <div className="removed" id={`removed${photo.locations_photo_id}`}></div>
                                </>
                            }
                        </div>
                    )
            )}
        </div>
    );
});

export default PhotoContainer;