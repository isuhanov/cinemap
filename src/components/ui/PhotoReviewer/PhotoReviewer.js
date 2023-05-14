import { memo, useEffect } from 'react';

import './PhotoReviewer.css';
import { useDispatch, useSelector } from 'react-redux';

const PhotoReviewer = memo(() => {
    const photoReviewerSrc = useSelector((state) => state.photoReviewer.src);
    const dispatch = useDispatch();

    return (
        <>
            { photoReviewerSrc &&   
                <div className="photo-reviewer">
                    <div className="photo-reviewer__card animation-content">
                        <header className="photo-reviewer__card-header header-card">
                            <div className="header-btn-container">
                                <button className="header-btn" onClick={() => {}}>
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </header>
                        <div className="photo-reviewer__img-container">
                            <img className="photo-reviewer__img" src={photoReviewerSrc} alt={''}/>
                        </div>
                    </div>
                </div>
            }
        </>
    );
});

export default PhotoReviewer;