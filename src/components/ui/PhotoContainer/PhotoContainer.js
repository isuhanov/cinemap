import { memo } from "react";

import './PhotoContainer.css'
import { useDispatch } from "react-redux";
import { setPhotoReviewerIndex, setPhotoReviewerSrcArr } from "../../../redux/photoReviewerSlice";

const PhotoContainer = memo(({ photos = [], isUpdate, onClickRemove }) => {
    const dispatch = useDispatch();

    function openPhotoReviewer (index) {
        dispatch(setPhotoReviewerSrcArr(photos.map(photo => photo.path)));
        dispatch(setPhotoReviewerIndex(index));
    }

    return (
        <div className="photo-container">
            { photos.map((photo, index) => (
                        <div className="photo-item" key={photo.id}>
                            <img src={photo.path} alt={photo.id} onClick={() => openPhotoReviewer(index)}/>
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