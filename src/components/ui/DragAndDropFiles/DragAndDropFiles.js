import { memo, useEffect, useRef, useState } from "react";

import './DragAndDropFiles.css';

const DragAndDropFiles = memo(({ photoList, onDropFiles }) => {
    const [drag, setDrag] = useState(false);
    const [fileList, setFileList] = useState(photoList);
    const dropRef = useRef();
    
    useEffect(() => {
        let dragCounter;
        function handleDrag(e) {
            e.preventDefault()
            e.stopPropagation()
        }
        function handleDragIn(e) {
            e.preventDefault()
            e.stopPropagation()
            dragCounter++
            if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
                setDrag(true)
            }
        }
        function handleDragOut(e) {
            e.preventDefault()
            e.stopPropagation()
            dragCounter--
            if (dragCounter === 0) {
                setDrag(false);
            }
        }
        function handleDrop(e) {
            // debugger
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
                dragCounter = 0    
            }
        }

        let div = dropRef.current;
        div.addEventListener('dragenter', handleDragIn)
        div.addEventListener('dragleave', handleDragOut)
        div.addEventListener('dragover', handleDrag)
        div.addEventListener('drop', handleDrop)
    }, []);

    return (
        <div ref={dropRef} className="drag-and-drop-container">
            <div className="drag-and-drop-filelist-container">
                { photoList.length > 0 ?
                    <ul className="drag-and-drop-filelist">
                        { photoList.map((file, index) => {
                            return <li className="drag-and-drop-file" key={index}>
                                <span className="material-symbols-outlined">image</span>
                                <span>{ file.name }</span>
                                </li>
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
                <div className="on-draging-block">
                    <p className="on-draging-text">
                        Файл
                    </p>
                </div>
            }
        </div>
    )
});

export default DragAndDropFiles;