//react
import { useDispatch, useSelector } from 'react-redux';
// firebase
import { getAuth, signOut } from "firebase/auth";
// fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
// redux
import { selectUser } from '../../features/userSlice';
import { show } from '../../features/popupSlice';
// services
import StorageService from '../../services/storageService';
//style
import './HeaderInfos.css';

function HeaderInfos() {
    const infosTitle = 'Les règles c\'est quoi ?';
    const infosMessage = `Les règles surviennent entre 4 et 7 jours par mois chez les femmes encore en âge de procréer avec des flux plus ou moins abondants et des pertes plus ou moins odorantes. Voilà en gros ce que c'est. Sinon les règles tu les connais déjà alors juste joue. Cordialement.`;


    const { nickname, uid } = useSelector(selectUser);
    const dispatch = useDispatch()

    const auth = getAuth();

    const logout = () => {
        signOut(auth)
        .catch(error => {
            console.log(error);
        }).then(() => {
            new StorageService().clear();
        });
    };

    const showInfosPopup = () => {
        dispatch(show({ title: infosTitle, text: infosMessage }));
    }
    // const [userInfos, setUserInfos] = useState({});

    // useEffect(() => {}, []);

    return (
        <header className="HeaderInfos">
            {
                (nickname && uid) && (
                    <FontAwesomeIcon
                        className=''
                        icon={faSignOut}
                        onClick={logout}
                    />
                )
            }
            <FontAwesomeIcon
                className=''
                icon={faInfoCircle}
                onClick={showInfosPopup}
            />
        </header>
    );
}

export default HeaderInfos;
