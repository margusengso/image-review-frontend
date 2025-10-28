import {privateApi} from "../api.js";
import './Dashboard.css'
import {useEffect, useState} from "react";


export default function Dashboard() {

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        getNextImage()
    }, []);

    const [showError, serShowError] = useState(false);

    const getNextImage = () => {
        if (!isSubmitting)  {
            privateApi.get('/images/next').then(r => {
                setCurrentImage(r.data)
                setLabel(r.data.suggested_label)
            }).catch(e => {
                console.log(e);
            })
        }
    }
    const [currentImage, setCurrentImage] = useState(null)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [label, setLabel] = useState("");
    const [dataIsVisible, setDataIsVisible] = useState(false)

    const postLabel = () => {
        setDataIsVisible(false)
        setIsSubmitting(true)
        privateApi.post('/labels', {
            image_id: currentImage.id,
            label: label
        }).then(() => {
            getNextImage()
        }).catch(e => {
            console.log(e)
        }).finally(() => { setIsSubmitting(false) })
    }

    const revealData = () => {
        setDataIsVisible(true)
    }

    if(!currentImage) return null; // TODO: implement a loader

    if(!currentImage.id) {
        return (
            <div className="dashboard-container"><p1>DONE!</p1></div>
        )
    }
    if (showError) {
        return (
            <div className='dashboard-container'><p1>Error happened!</p1></div>
        )
    }

    return (

            <div className="dashboard-container">
                <div className="left-column">
                    <img src={currentImage.url}
                         onLoad={revealData}
                         style={{maxWidth: '100%', maxHeight: windowHeight - 90 + 'px', objectFit: 'contain'}}
                    />
                </div>

                <div className="right-column">
                    {dataIsVisible &&
                        <>
                            <div className='current-data'>
                                <span className='current-image-label'>{currentImage.suggested_label}</span>
                                <span>
                                    Confidence: {currentImage.confidence}
                                </span>
                            </div>
                            <input
                                type="text"
                                className="label-input"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                            />
                            <button onClick={postLabel}>
                                Confirm label
                            </button>
                        </>
                    }
                    {!dataIsVisible &&
                        <div className='current-data'>Loading...</div>
                    }


                </div>
            </div>


    );
}