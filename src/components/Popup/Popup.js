import './Popup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { selectPopup, hide } from '../../features/popupSlice';
import { useDispatch, useSelector } from 'react-redux';


function Popup({
    titleColor = 'var(--summary-color)', 
    textColor = 'var(--summary-color)', 
    bgColor = 'var(--dialog-bg)', 
    children}) {
   
        const {title, text} = useSelector(selectPopup);
        const dispatch = useDispatch();

        const close = () => {
            dispatch(hide());
        };
    
    return (
        <div className="Popup">
            <div style={{backgroundColor: bgColor}} className='content'>
            <FontAwesomeIcon
                className='close-btn'
                icon={faClose}
                style={{color: textColor}}
                onClick={close}
            />
                {title && <h1 style={{color: titleColor}}>{title}</h1>}
                {text && <p style={{color: textColor}}>{text}</p>}
                {children}
            </div>
        </div>
    );
}

export default Popup;
