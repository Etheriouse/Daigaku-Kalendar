/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';

import '../dark.css'
import '../light.css'

type Props = {
    theme: string;
    toggleMenu: () => void;
    toToday: () => void;
    today: string;
};

function Navbar({ theme, toggleMenu, toToday, today }: Props) {

    const strokeColor = theme == "dark" ? "black" : "white"

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (<div style={style.navBar}>
        <div id="hidari-nav-bar" style={style.hidariNavBar}>
            <span id="today-span" style={style.todaySpan} onClick={toToday}>
                <p id="today-number">{today}</p>
            </span>
        </div>

        <div id="migi-nav-bar" style={style.migiNavBar}>
            <span id="menu-span" style={style.menuSpan} onClick={toggleMenu}>
                <svg width="30" height="30" viewBox="0 0 20 20">
                    <line x1="3" y1="2" x2="20" y2="2" stroke={strokeColor} strokeWidth="2" />
                    <line x1="3" y1="10" x2="20" y2="10" stroke={strokeColor} strokeWidth="2" />
                    <line x1="3" y1="18" x2="20" y2="18" stroke={strokeColor} strokeWidth="2" />
                </svg>
            </span>
        </div>
    </div>)
}

const style: any = {
    navBar: {
        display: "flex",
        flexDirection: "row",
        padding: "10px",
        zIndex: 10,
        position: "relative",
    },

    hidariNavBar: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
    },

    migiNavBar: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "end",
    },

    menuSpan: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "end",
    },

    todaySpan: {
        height: "25px",
        fontSize: "18px",
        width: "25px",
        fontWeight: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        padding: "1px",
        cursor: "pointer",
    }
}


export default Navbar;