import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({imageUrl, box}) => {

    function drawFaceBox(faceboxArray){
        const faceBoxes = [];
        
        if(faceboxArray.length){
            faceboxArray.forEach( (element, index) => {
                // console.log(element);
                faceBoxes.push(<div className='bounding-box' key={index} style={{top: element.topRow, right: element.rightCol, bottom: element.bottomRow, left: element.leftCol}} ></div>)
            });
        }

        return faceBoxes;
    }

    return(
        <div className="center ma">
            <div className="absolute mt2">
                <img id="inputimage" src={imageUrl} alt="" width="500px" height="auto"/>
                {/* <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div> */}
                {drawFaceBox(box)}
            </div>
        </div>
    )
}

export default FaceRecognition;