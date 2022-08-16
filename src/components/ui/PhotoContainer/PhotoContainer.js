import { memo, useState } from "react";

import './PhotoContainer.css'

const PhotoContainer = memo(({ photos, isUpdate, onRemovePhotos }) => {
    function onClickRemove(photoId) {
        console.log(photoId);
        onRemovePhotos(photoId);
    }

    return (
        <div className="photo-container">
            { photos.map((photo) => (
                        <div className="photo-item" key={photo.locations_photo_id}>
                            <img src={photo.locations_photo_path}/>
                            { isUpdate &&
                                <button onClick={() => onClickRemove(photo.locations_photo_id)} type="button" className="photo-remove-btn">
                                    <span className="material-symbols-outlined">
                                        close
                                    </span>
                                </button>
                            }
                        </div>
                    )
            )}
        </div>
    );
});

export default PhotoContainer;