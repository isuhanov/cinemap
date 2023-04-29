import { memo } from 'react';
import PhotoContainer from '../PhotoContainer/PhotoContainer';

import './ImgPicker.css'
import { nanoid } from '@reduxjs/toolkit';

const ImgPicker = memo(({ photos, onChange, setIsRemove }) => {
    return (
        <div className="img-picker">
            <PhotoContainer photos={photos} isUpdate={true} onClickRemove={setIsRemove}/>
            <label className="input-file">
                <input type="file" name="file" multiple
                        onChange={e => {
                            onChange({
                                value: [...photos, ...[...e.target.files].filter(photo => photo.type === 'image/jpeg').map(file => ({
                                    id: nanoid(3),
                                    path: URL.createObjectURL(file),
                                    file,
                                    isRemove: false
                                }))]
                            })
                        }}
                />		
                <span className="btn btn-blue">
                    Выберите фото
                </span>
         	</label>
        </div>
    );
});

export default ImgPicker;