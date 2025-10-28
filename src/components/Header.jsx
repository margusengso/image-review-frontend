import './Header.css'
import { FaBars, FaTimes } from 'react-icons/fa';
import { toggleLoginModal } from '../features/uxSlice'
import {useEffect, useState} from "react";
import {logout} from "../features/authSlice.js";
import {useDispatch, useSelector} from "react-redux";


export default function Header() {

    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const openMenu = () => setIsMenuOpen(true)
    const closeMenu = () => setIsMenuOpen(false)
    const user = useSelector(s => s.auth.user);
    const handleLogout = () => {
        dispatch(logout());
        localStorage.clear();
        window.location.href = '/';
    };
    const mainClick = useSelector(state => state.ux.mainClick)

    useEffect(() => {
        const onResize = () => setIsMenuOpen(false);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const signInClick = () => {
        dispatch(toggleLoginModal())
    }
    useEffect(() => {
        setIsMenuOpen(false)
    }, [mainClick, user])



    return (
        <header className="header">
            <div className="container header-container">

                <div style={{ flex: 1 }} />


                {isMenuOpen &&
                    <nav className={'nav active'}>
                        <ul className="nav-list">
                            {!user ? (
                                <li
                                    className="nav-item"
                                    onClick={() => signInClick()}
                                >
                                    <span className='no-bottom-border'>Sign in</span>
                                </li>
                            ) : (
                                <li
                                    className="nav-item"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        handleLogout();
                                    }}
                                >
                                    <span className='no-bottom-border'>Logout</span>
                                </li>
                            )}
                        </ul>
                    </nav>
                }


                {!isMenuOpen &&
                    <nav className={'temp-hidden-fix nav'}>
                        <ul className="nav-list">
                            {!user ? (
                                <>
                                    <div style={{flex: 1}}/>
                                    <div
                                        className="nav-item"
                                        onClick={() => signInClick()}
                                    >
                                        <span>Sign in</span>
                                    </div>
                                </>
                            ) : (

                                <>
                                    {user?.picture &&
                                        <img src={user.picture} width="32" height="32" className='user-image' />
                                    }
                                    <div className=''>{user?.given_name} {user?.family_name}</div>
                                    <div style={{flex: 1}}/>
                                    <div
                                        className="nav-item"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            handleLogout();
                                        }}
                                    >
                                        <span>Logout</span>
                                    </div>

                                </>
                            )}
                        </ul>
                    </nav>
                }





                {isMenuOpen &&
                    <div className="menu-icon" onClick={closeMenu}>
                        <FaTimes />
                    </div>
                }
                {!isMenuOpen &&
                    <div className="menu-icon" onClick={openMenu}>
                        <FaBars />
                    </div>
                }
                <div style={{ width: '18px' }} />
            </div>

        </header>
    )
}

