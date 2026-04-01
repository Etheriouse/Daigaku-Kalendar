/* eslint-disable @typescript-eslint/no-explicit-any */
import '../dark.css'
import '../light.css'
import './Menu.css'

import type { ScheduleType } from '../Type.ts';
import { LocalBackend } from '../CapacitorPlugin.ts';

type Props = {
    theme: string;
    toggleTheme: () => void;
    isOpen: boolean;
    setSchedule: (type: ScheduleType) => void;
    ScheduleType_: ScheduleType;
    saveIcsUrl: (url: string) => void;
    icsUrl: string;
    toggleMenu: () => void;
    setIcsUrl: (url: string) => void;
};

function Menu({ theme, toggleTheme, isOpen, ScheduleType_, setSchedule, icsUrl, setIcsUrl, saveIcsUrl, toggleMenu }: Props) {

    const items = [
        { id: "month", label: "Mois", icon: "🗓" },
        { id: "week", label: "Semaine", icon: "📅" },
        { id: "day", label: "Jour", icon: "🕑" },
    ] as const;

    return (
        <div
            id="burger-menu"
            style={{
                ...style.burgerMenu,
                transform: isOpen ? "translateX(0)" : "translateX(100%)",
            }}
        >
            <div style={style.navBurgerMenu}>
                <p style={style.navBurgerMenuP}>Settings</p>
            </div>

            <div className="line" />

            {/* INPUT LINK */}
            <div style={style.inputBox}>
                <input id="input-url-ics"
                    style={style.input}
                    placeholder="Coller un lien ici..."
                    value={icsUrl}
                    onChange={(e) => setIcsUrl(e.target.value)}
                />
                <button id="button-url-ics"
                    style={style.button}
                    onClick={() => { saveIcsUrl(icsUrl); toggleMenu() }}
                >
                    Save
                </button>
            </div>

            <div style={{ marginTop: "20px", display: "flex", flexDirection: "row", alignItems: "center", gap: "15px" }}>
                <h3>
                    Dark
                </h3>
                <div
                    onClick={() => {
                        LocalBackend.setTheme({theme: theme == "dark" ? "light" : theme })
                        toggleTheme();

                    }}
                    style={{ ...style.toggleButtonDiv1, background: theme == "dark" ? "#444" : "#ccc" }}
                >
                    <div
                        style={{ ...style.toggleButtonDiv2, transform: theme == "dark" ? "translateX(-12px)" : "translateX(12px)" }}
                    />
                </div>

                <h3>
                    Light
                </h3>
            </div>

            <div style={style.list}>
                {items.map((item) => (
                    <div id={ScheduleType_ === item.id ? "active-selected-menu-burger" : ""}
                        key={item.id}
                        onClick={() => setSchedule(item.id)}
                        style={{
                            ...style.typeSchedule,
                            ...(ScheduleType_ === item.id ? style.active : {}),
                        }}
                    >
                        <span>{item.icon} {item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const style: any = {
    burgerMenu: {
        position: "fixed",
        top: 0,
        right: 0,
        width: "70vw",
        height: "100%",
        transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        zIndex: 1000,
        padding: "20px",
    },

    navBurgerMenu: {
        display: "flex",
        justifyContent: "flex-start",
        fontSize: "20px",
        fontWeight: 600,
    },

    navBurgerMenuP: {
        marginRight: "10%",
    },

    list: {
        marginTop: "20px",
    },

    typeSchedule: {
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        padding: "12px",
        margin: "5px 0",
        cursor: "pointer",
        borderRadius: "10px",
        transition: "0.2s",
    },

    active: {
        fontWeight: 600,
        transform: "scale(1.02)",
    },

    inputBox: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "20px",
    },

    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        outline: "none",
    },

    button: {
        padding: "10px 15px",
        width: '40%',
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        color: "white",
    },

    toggleButtonDiv1: {
        width: "50px",
        height: "25px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3px",
        cursor: "pointer",
        transition: "background 0.3s",
    },

    toggleButtonDiv2: {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "white",
        transition: "transform 0.3s"
    }
};
export default Menu