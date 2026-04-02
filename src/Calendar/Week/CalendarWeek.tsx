import { useEffect, useRef } from "react";
import type { Event } from "../../Type";


const monthName = [
    "JAN.",
    "FEB.",
    "MAR.",
    "APR.",
    "MAY",
    "JUN.",
    "JUL.",
    "AUG.",
    "SEP.",
    "OCT.",
    "NOV.",
    "DEC.",
];

const weeksName = [
    "MON.",
    "TUE.",
    "WED.",
    "THU.",
    "FRI.",
    "SAT.",
    "SUN."
]

function hexToRgba(hex: string, alpha: number) {
    const clean = hex.replace("#", "");

    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function generateEvent(event: Event, minHour: number) {


    const duration = (event.end.getHours() * 60 + event.end.getMinutes()) - (event.start.getHours() * 60 + event.start.getMinutes())

    const durationpx = duration * (80 / 60);
    // 60min < - > 80px
    // 1min < -> (1*80/60)
    const startpx = ((event.start.getHours() - minHour) * 60 + event.start.getMinutes()) * (80 / 60);


    const style: any = {
        eventDiv: {
            position: "absolute",
            top: `${startpx}px`,      // exemple
            height: `${durationpx}px`,
            left: 0,
            right: 0,
            borderLeft: `5px solid ${event.color}`,
            backgroundColor: hexToRgba(event.color, 0.3)
        },

        title: {
            fontSize: "15px",
            fontWeight: 600,
            margin: 0,
            padding: 0,
        },

        location: {
            fontSize: "15px",
            fontWeight: 200,
            margin: 0,
            padding: 0,
        }
    }

    const today = new Date();
    console.log(today);
    return <>
        {event.start.getDate() == today.getDate() ? <div id="now-bar-event-week" style={{ top: ((today.getHours() - minHour) * 60 + today.getMinutes()) * (80 / 60) }}></div> : <></>}
        <div style={style.eventDiv}>
            <p style={style.title} className="event-title-div">{event.title}</p>
            <p style={style.location} className="event-location-div">{event.location}</p>
        </div>
    </>

}

import './event.css'

type Prop = {
    toggleLoading: (b: boolean) => void;
    EventListWeek: Event[][];
    Monday: Date;
    ChangeWeek: (sign: number) => void;
}

function CalendarWeek({ toggleLoading, EventListWeek, Monday, ChangeWeek }: Prop) {

    const calendarRef = useRef<HTMLDivElement | null>(null);

    const hourNameBase = [
        "12 AM",
        "01 AM",
        "02 AM",
        "03 AM",
        "04 AM",
        "05 AM",
        "06 AM",
        "07 AM",
        "09 AM",
        "10 AM",
        "11 AM",
        "12 PM",
        "01 PM",
        "02 PM",
        "03 PM",
        "04 PM",
        "05 PM",
        "06 PM",
        "07 PM",
        "08 PM",
        "09 PM",
        "10 PM",
        "11 PM",
        "12 AM",
    ]

    // get first hour of event of week
    var minHour = 20;
    EventListWeek.forEach(eventList => {
        eventList.forEach(event => {
            if (minHour > event.start.getHours()) {
                minHour = event.start.getHours();
            }
        })
    })

    // get lastest hour of event of week
    var maxHour = 0;
    EventListWeek.forEach(eventList => {
        eventList.forEach(event => {
            if (maxHour < event.end.getHours()) {
                maxHour = event.end.getHours();
                console.log(event.end);
            }
        })
    })

    minHour -= 1;
    maxHour += 1;


    if (maxHour < minHour) {
        maxHour = 23
        minHour = 7
    }

    const hourName = hourNameBase.slice(minHour - 1, maxHour - 1);

    useEffect(() => {
        const el = calendarRef.current;
        if (!el) return;

        let sx = 0;
        let isDragging = false;

        const handleDown = (e: PointerEvent) => {
            sx = e.clientX;
            isDragging = true;
            el.style.transition = "none";
        };

        const handleMove = (e: PointerEvent) => {
            if (!isDragging) return;
            const diff = e.clientX - sx;

            if (Math.abs(diff) > 10) {
                el.style.transform = `translateX(${diff}px)`;
            }
        };

        const handleUp = (e: PointerEvent) => {
            isDragging = false;
            const diff = e.clientX - sx;

            el.style.transition = "transform 0.25s ease-out";

            if (Math.abs(diff) > 50) {
                toggleLoading(true);
                ChangeWeek(diff);
            }

            setTimeout(() => {
                el.style.transform = "translateX(0)";
            }, 200);
        };

        el.addEventListener("pointerdown", handleDown);
        el.addEventListener("pointermove", handleMove);
        el.addEventListener("pointerup", handleUp);

        return () => {
            el.removeEventListener("pointerdown", handleDown);
            el.removeEventListener("pointermove", handleMove);
            el.removeEventListener("pointerup", handleUp);
        };
    }, []);

    return (
        <div ref={calendarRef} style={{ display: "flex", flexDirection: "column", height: "92vh" }} >

            <div style={{ width: "88%", marginLeft: "12%" }}>
                <div id="month-div">
                    <h1 id="month-main">{monthName[Monday.getMonth()]}</h1>
                </div>

                <div id="weeks-div">
                    {weeksName.map((dayName, index) => {
                        const day_tmp = new Date(Monday.getFullYear(), Monday.getMonth(), Monday.getDate());
                        day_tmp.setDate(day_tmp.getDate() + index);

                        return (
                            <div className="day-div">
                                <span className="name-day-div">{dayName}</span>
                                <div className="div-week">
                                    <span className="number-day-div">{day_tmp.getDate()}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div id="matrix-border-line"></div>
            <div id="calendar-matrix">
                <div id="hour-matrix">
                    {hourName.map((name) => {
                        return (
                            <div className="hour-matrix-case">
                                <div>
                                    {name}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div id="event-matrix" >
                    {weeksName.map((_, index_) => {
                        return (
                            <div className="column-day-event ">
                                {EventListWeek[index_].map((event) => {
                                    return generateEvent(event, minHour);
                                })}
                                {hourName.map((_) => {

                                    return (
                                        <div className={"column-day-event-case " + (index_ == 0 ? "first-column" : "")}>
                                            <div className="column-day-event-case-demi first-case">
                                            </div>
                                            <div className="column-day-event-case-demi">
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default CalendarWeek