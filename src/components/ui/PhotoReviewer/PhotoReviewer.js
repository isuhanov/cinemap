import { memo } from 'react';

import './PhotoReviewer.css';
import { useDispatch, useSelector } from 'react-redux';
import { setPhotoReviewerIndex, setPhotoReviewerSrcArr } from '../../../redux/photoReviewerSlice';

// компонент для просмотра фотографий
const PhotoReviewer = memo(() => {
    const srcArr = useSelector((state) => state.photoReviewer.srcArr);
    const index = useSelector((state) => state.photoReviewer.index);
    const dispatch = useDispatch();
    
    function onClickClose() {
        dispatch(setPhotoReviewerSrcArr([]));
        dispatch(setPhotoReviewerIndex(0));
    }

    function changeIndex(num) {
        dispatch(setPhotoReviewerIndex(index + num));
    }

    return (
        <>
            { srcArr.length > 0 &&   
                <div className="photo-reviewer">
                    <div className="photo-reviewer__card animation-content">
                        <header className="photo-reviewer__card-header header-card">
                            <div className="header-btn-container">
                                <button className="header-btn" onClick={onClickClose}>
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </header>
                        <div className="photo-reviewer__img-container">
                            { index !== 0 && 
                                <button className="btn-arrow btn-arrow-left" onClick={() => changeIndex(-1)}>
                                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                                </button>
                            }
                            <img className="photo-reviewer__img" src={srcArr[index]} alt={''}/>
                            { index < (srcArr.length - 1) &&
                                <button className="btn-arrow btn-arrow-right" onClick={() => changeIndex(1)}>
                                    <span className="material-symbols-outlined">arrow_forward_ios</span>
                                </button>
                            }
                        
                        </div>
                    </div>
                </div>
            }
        </>
    );
});

export default PhotoReviewer;