import { memo, useState } from "react";

import './DragAndDropFiles.css';

const DragAndDropFiles = memo(({ photoList, onDropFiles }) => {
    const [drag, setDrag] = useState(false);
    const [fileList, setFileList] = useState(photoList);

    function handleDrag(e) {
        e.preventDefault()
        e.stopPropagation()
    }
    function handleDragIn(e) {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDrag(true)
        }
    }
    function handleDragOut(e) {
        e.preventDefault();
        e.stopPropagation();
        setDrag(false);
    }
    function handleDrop(e) {
        e.preventDefault()
        e.stopPropagation()
        setDrag(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            let files = fileList;
            for (const file of e.dataTransfer.files) {
                files.push(file);
            }
            setFileList(files);
            onDropFiles(files);
        }
    }
   
    function onRemoveFiles(index) {
        let files = fileList;
        files.splice(index, 1);
        setFileList(files);
        onDropFiles(files);
    }

    return (
        <div onDragEnter={handleDragIn} onDragOver={handleDrag} onDrop={handleDrop} 
            className="drag-and-drop-container">
            <div className="drag-and-drop-filelist-container">
                { photoList.length > 0 ?
                    <ul className="drag-and-drop-filelist">
                        { photoList.map((file, index) => {
                            return (
                                <li className="drag-and-drop-file" key={index}>
                                    <button onClick={() => onRemoveFiles(index)} type="button" className="file-remove-btn">
                                        <span className="material-symbols-outlined">
                                            remove
                                        </span>
                                    </button>
                                    <span className="material-symbols-outlined">image</span>
                                    <span>{ file.name }</span>
                                </li>
                            )
                        }) }
                    </ul>
                    :
                    <p className="drag-and-drop-empty-filelist">Вы не добавили фото...</p>
                }
            </div>
            <div className="drag-and-drop__img-block">
                <span className="material-symbols-outlined">
                    upload_file
                </span>
            </div>
            { drag && 
                <div onDragLeave={handleDragOut} className="on-draging-block">
                    <p className="on-draging-text">
                        Файл
                    </p>
                </div>
            }
        </div>
    )
});

export default DragAndDropFiles;