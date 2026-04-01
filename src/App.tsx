import { useState, useEffect } from 'react'

import Menu from './Menu/Menu'
import Navbar from './Navbar/Navbar'
import CalendarDay from './Calendar/Day/CalendarDay'
import CalendarWeek from './Calendar/Week/CalendarWeek'

import type { ScheduleType, Event, EventParse } from './Type'
import { LocalBackend } from './CapacitorPlugin'

function parseDate(date: Date): string {
    return `${date.getHours() > 9 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()}`;
}

function parseEvent(EventList: Event[]): EventParse[] {
    return EventList.map((event) => ({
        title: event.name,
        start: parseDate(event.start),
        end: parseDate(event.end),
        day: event.start.getDay(),
        location: event.location,
        author: event.author,
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

    return new Date(date.setDate(diff));
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
    const [ScheduleType_, setScheduleType] = useState<ScheduleType>("day");
    const [EventList, setEventList] = useState<Event[]>([]);
    const [daySelect, setDaySelect] = useState(0);
    const [selectedWeek, setSelectedWeek] = useState(0); // 0 meane today
    const [theme, setTheme] = useState("dark"); // 0 meane today
    const [icsUrl, setIcsUrl] = useState("");

    const toggleTheme = () => {
        if (theme == "dark") {
            setTheme("light");
        } else {
            setTheme("dark")
        }
    }

    const toggleMenu = async () => {
        setOpenMenu(!menuIsOpen);
    }

    const setSchedule = async (type: ScheduleType) => {
        setScheduleType(type);
    }

    const saveIcsUrl = async (url: string) => {
        setIcsUrl(url);
        await LocalBackend.setURL({ url: url })
    }

    useEffect(() => {
        LocalBackend.getUrl().then(data => {
            setIcsUrl(data.url);
            LocalBackend.getEvents({ time_difference: selectedWeek }).then(data => {
                data.events.sort((a, b) => parseUTCDate(a.start).getTime() - parseUTCDate(b.start).getTime());
                setEventList(data.events.map((RawEvent) => ({
                    name: RawEvent.title,
                    start: new Date(RawEvent.start),
                    end: new Date(RawEvent.end),
                    location: RawEvent.location,
                    author: RawEvent.author,
                    color: RawEvent.color,
                })))
            })
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

        EventList.forEach((event) => {
            const eventDate = new Date(event.start);

            if (eventDate < monday || eventDate > sunday) return;

            const index = (eventDate.getDay() == 0 ? 6 : eventDate.getDay() - 1);
            week[index].push(event);
        });
        return week;

    }

    const getGoodCalendar = () => {
        switch (ScheduleType_) {
            case "day":
                return <CalendarDay EventList={parseEvent(getEventListDay())} EventListWeek={parseEvent2D(getEventListWeek())} daySelected={daySelect} setDaySelected={setDaySelect} Monday={getMonday(getDateActual(selectedWeek))} ChangeWeek={changeWeek} />
            case "week":
                return <CalendarWeek />
            case "month":
                return <></>
        }
    }

    const changeWeek = (sign: number) => {
        setSelectedWeek(prev => {
            setDaySelect(0);
            if (sign > 0) {
                return prev - 1;
            } else {
                return prev + 1;
            }
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
            <Navbar theme={theme} toggleMenu={toggleMenu} toToday={() => setSelectedWeek(0)} today={getDateActual(0).getDate() + ''} />

            {getGoodCalendar()}

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