/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'

import Menu from './Menu/Menu'
import Navbar from './Navbar/Navbar'
import CalendarDay from './Calendar/Day/CalendarDay'
import CalendarWeek from './Calendar/Week/CalendarWeek'
import Loader from './Loader'

import type { ScheduleType, Event, EventParse } from './Type'
import { LocalBackend } from './CapacitorPlugin'

function parseDate(date: Date): string {
    return `${date.getHours() > 9 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()}`;
}

function parseEvent(EventList: Event[]): EventParse[] {
    return EventList.map((event) => ({
        title: event.title,
        start: parseDate(event.start),
        end: parseDate(event.end),
        day: event.start.getDay(),
        location: event.location,
        description: event.description,
        color: event.color,
    }));
}

function parseEvent2D(EventList: Event[][]): EventParse[][] {
    return EventList.map((eventList) => (
        parseEvent(eventList)
    ))
}

function getMonday(date: Date) {
    const day = date.getDay(); // 0 = dimanche, 1 = lundi, ...

    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    return new Date(new Date(date).setDate(diff));
}

function getDateActual(week: number) {
    const today = new Date();
    today.setDate(today.getDate() + (7 * week));
    return today;
}

function parseUTCDate(str: string) {
    const match = str.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
    if (!match) {
        throw new Error("Format invalide, attendu : YYYYMMDDTHHMMSSZ");
    }

    const isoStr = `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}Z`;
    return new Date(isoStr);
}


function App() {

    const [menuIsOpen, setOpenMenu] = useState(false);
    const [ScheduleType_, setScheduleType] = useState<ScheduleType>("week");
    const [EventList, setEventList] = useState<Event[]>([]);
    const [daySelect, setDaySelect] = useState(0);
    const [selectedWeek, setSelectedWeek] = useState(0); // 0 meane today
    const [theme, setTheme] = useState("dark"); // 0 meane today
    const [icsUrl, setIcsUrl] = useState("");
    const [loading, toggleLoading] = useState(true);

    const toggleTheme = () => {
        if (theme == "dark") {
            setTheme("light");
            LocalBackend.setTheme({theme: "light" })
        } else {
            setTheme("dark")
            LocalBackend.setTheme({theme: "dark" })
        }
    }

    const toggleMenu = async () => {
        setOpenMenu(!menuIsOpen);
    }

    const setSchedule = async (type: ScheduleType) => {
        setScheduleType(type);
    }

    const setEvent = (time_dif: number) => {
        LocalBackend.getUrl().then(data => {
            setIcsUrl(data.url);
            LocalBackend.getEvents({ time_difference: time_dif }).then(data => {
                data.events.sort((a, b) => parseUTCDate(a.start).getTime() - parseUTCDate(b.start).getTime());
                setEventList(prev => {
                    prev = data.events.map((RawEvent) => ({
                        title: RawEvent.title,
                        start: parseUTCDate(RawEvent.start),
                        end: parseUTCDate(RawEvent.end),
                        location: RawEvent.location,
                        description: RawEvent.description,
                        color: RawEvent.color,
                    }))
                    toggleLoading(false);
                    return prev;
                })

            })
        })
    }

    const toTodayFunc = () => {
        setSelectedWeek(prev => {
            toggleLoading(true);
            prev = 0;
            const tmp = new Date();
            setDaySelect(tmp.getDay() == 0 ? 6 : tmp.getDay() - 1)
            setEvent(0);
            return prev;
        });
    }

    const saveIcsUrl = async (url: string) => {
        toggleLoading(true);
        setIcsUrl(url);
        await LocalBackend.setURL({ url: url })
        setEvent(selectedWeek);
    }

    useEffect(() => {
        setEvent(selectedWeek)
        LocalBackend.getTheme().then(data => {
            setTheme(data.theme);
        })
    }, [])

    const getEventListDay = () => {
        const monday = getMonday(getDateActual(selectedWeek));

        const selectedDay = new Date(monday);
        selectedDay.setDate(monday.getDate() + daySelect);

        return EventList.filter((event) => {
            const eventDate = new Date(event.start);

            return (
                eventDate.getFullYear() === selectedDay.getFullYear() &&
                eventDate.getMonth() === selectedDay.getMonth() &&
                eventDate.getDate() === selectedDay.getDate()
            );
        });
    }

    const getEventListWeek = () => {
        const monday = getMonday(getDateActual(selectedWeek));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const week: Event[][] = Array.from({ length: 7 }, () => []);

        const isSameWeek = (eventDate: Date, monday: Date) => {
            const eventMonday = getMonday(eventDate);

            return monday.getFullYear() === eventMonday.getFullYear() &&
                monday.getMonth() === eventMonday.getMonth() &&
                monday.getDate() === eventMonday.getDate()
        };


        EventList.forEach((event) => {
            const eventDate = new Date(event.start);

            if (!isSameWeek(eventDate, monday)) return;

            const index = (eventDate.getDay() == 0 ? 6 : eventDate.getDay() - 1);
            if (week[index]) {
                week[index].push(event);
            }
        });
        return week;

    }

    const getGoodCalendar = () => {
        switch (ScheduleType_) {
            case "day":
                return <CalendarDay toggleLoading={toggleLoading} EventList={parseEvent(getEventListDay())} EventListWeek={parseEvent2D(getEventListWeek())} daySelected={daySelect} setDaySelected={setDaySelect} Monday={getMonday(getDateActual(selectedWeek))} ChangeWeek={changeWeek} />
            case "week":
                return <CalendarWeek toggleLoading={toggleLoading} EventListWeek={getEventListWeek()} Monday={getMonday(getDateActual(selectedWeek))} ChangeWeek={changeWeek} />
        }
    }

    const changeWeek = async (sign: number) => {
        setSelectedWeek(prev => {
            setDaySelect(0);
            const newWeek = prev + (sign > 0 ? -1 : 1);

            LocalBackend.getEvents({ time_difference: newWeek }).then(data => {
                data.events.sort((a, b) => parseUTCDate(a.start).getTime() - parseUTCDate(b.start).getTime());
                setEventList(prev => {
                    prev = data.events.map((RawEvent) => ({
                        title: RawEvent.title,
                        start: parseUTCDate(RawEvent.start),
                        end: parseUTCDate(RawEvent.end),
                        location: RawEvent.location,
                        description: RawEvent.description,
                        color: RawEvent.color,
                    }))
                    toggleLoading(false);
                    return prev;
                }
                )
            })

            return newWeek;
        });
    }

    return (
        <>
            {menuIsOpen && (
                <div
                    style={style.overlay}
                    onClick={toggleMenu}
                />
            )}
            <Menu theme={theme} toggleTheme={toggleTheme} isOpen={menuIsOpen} ScheduleType_={ScheduleType_} setSchedule={setSchedule} saveIcsUrl={saveIcsUrl} icsUrl={icsUrl} setIcsUrl={setIcsUrl} toggleMenu={toggleMenu} />
            <Navbar theme={theme} toggleMenu={toggleMenu} toToday={toTodayFunc} today={getDateActual(0).getDate() + ''} />

            {loading ? <Loader /> : getGoodCalendar()}

        </>
    )
}

const style: any = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        zIndex: 999,
    }
}
export default App