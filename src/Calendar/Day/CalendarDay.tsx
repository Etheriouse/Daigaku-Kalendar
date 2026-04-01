import { useEffect, useRef } from "react";
import type { EventParse } from "../../Type";

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

import './event.css'
import './month.css'
import './week.css'

type Prop = {
    toggleLoading: (b: boolean) => void;
    EventList: EventParse[];
    EventListWeek: EventParse[][];
    daySelected: number;
    setDaySelected: (day: number) => void;
    Monday: Date;
    ChangeWeek: (sign: number) => void;
}

function CalendarDay({ toggleLoading, EventList, EventListWeek, daySelected, setDaySelected, Monday, ChangeWeek }: Prop) {

    const weekRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = weekRef.current;
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
        <>
            <div id="month-div">
                <h1 id="month-main">{monthName[Monday.getMonth()]}</h1>
            </div>

            <div id="weeks-div" ref={weekRef}>
                {weeksName.map((dayName, index) => {
                    const day_tmp = new Date(Monday.getFullYear(), Monday.getMonth(), Monday.getDate());
                    day_tmp.setDate(day_tmp.getDate() + index);

                    return (
                        <div className="day-div" onClick={() => { setDaySelected(index); }}>
                            <span className="name-day-div">{dayName}</span>
                            <div className="not-today-div-week" id={daySelected == index ? "today-div-week" : ""}>
                                <span className="number-day-div">{day_tmp.getDate()}</span>
                                <div className="event-list-div">
                                    {EventListWeek[index].map((event) => {
                                        return (
                                            <div className="event-bis" style={{ backgroundColor: event.color }}></div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div id="bar-bottom-week"></div>
            <div id="event-list">

                {
                    EventList.map((event, index) => {

                        const previous = EventList[index - 1];

                        const sameHour =
                            previous &&
                            new Date(previous.start).getHours() === new Date(event.start).getHours();

                        const first = index === 0;

                        return (
                            <div className="event-div">
                                {!first && !sameHour ? <div id="bar-bottom-event"></div> : <></>}
                                <div className="event-div-div">
                                    <div className="event-start-hour">
                                        <span>{event.start}</span>
                                    </div>
                                    <div className="event-color-div-div">
                                        <div className="event-color-div" style={{ backgroundColor: event.color }}></div>
                                    </div>
                                    <div>
                                        <div className="event-title">{event.title}</div>
                                    </div>
                                </div>
                                <div className="event-description">
                                    <div className="event-start-hour shadow-tab-div">
                                        <span>{event.start}</span>
                                    </div>
                                    <div className="event-color-div-div shadow-tab-div">
                                        <div className="event-color-div" style={{ backgroundColor: event.color }}></div>
                                    </div>
                                    <div className="event-description-div">
                                        <div>
                                            {event.start} - {event.end}
                                        </div>
                                        <div>
                                            {event.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div ></>
    )
}

export default CalendarDay