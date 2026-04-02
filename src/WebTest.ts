// import type { LocalBackendPluginCapacitor } from "./CapacitorPlugin";

// export class MyNativeWeb implements LocalBackendPluginCapacitor {

//     async setURL({ url }: { url: string }) {
//         localStorage.setItem("ics_url", url);
//         return {};
//     }

//     async getUrl() {
//         return {
//             url: localStorage.getItem("ics_url") || "HELOOO",
//         };
//     }

//     async setTheme({ theme }: { theme: string }) {
//         localStorage.setItem("theme", theme);
//         return {};
//     }

//     async getTheme() {
//         return {
//             theme: localStorage.getItem("theme") || "dark",
//         };
//     }

//     async getEvents({ time_difference }: { time_difference: number }) {
//         const now = new Date();

//         return {
//             events: [
//                 // Lundi
//                 {
//                     title: "PRG TP",
//                     start: "20260330T080000Z",
//                     end: "20260330T093000Z",
//                     location: "Université",
//                     description: "Développement web",
//                     color: "#4d79ff",
//                 },
//                 {
//                     title: "TD BDD",
//                     start: "20260330T100000Z",
//                     end: "20260330T113000Z",
//                     location: "Salle B12",
//                     description: "SQL",
//                     color: "#ff9966",
//                 },
//                 {
//                     title: "Projet PGCODE",
//                     start: "20260330T130000Z",
//                     end: "20260330T150000Z",
//                     location: "Bibliothèque",
//                     description: "Projet semestriel",
//                     color: "#9966ff",
//                 },

//                 // Mardi
//                 {
//                     title: "CM AGL",
//                     start: "20260331T080000Z",
//                     end: "20260331T093000Z",
//                     location: "Amphi A",
//                     description: "Structures de données",
//                     color: "#ff6666",
//                 },
//                 {
//                     title: "Pause",
//                     start: "20260331T093000Z",
//                     end: "20260331T100000Z",
//                     location: "Cafétéria",
//                     description: "Pause café",
//                     color: "#33cc99",
//                 },
//                 {
//                     title: "TP PRG",
//                     start: "20260331T100000Z",
//                     end: "20260331T120000Z",
//                     location: "Salle info",
//                     description: "Pratique JavaScript",
//                     color: "#4d79ff",
//                 },
//                 {
//                     title: "SPRT",
//                     start: "20260331T160000Z",
//                     end: "20260331T170000Z",
//                     location: "Salle de sport",
//                     description: "Entraînement",
//                     color: "#33cccc",
//                 },

//                 // Mercredi
//                 {
//                     title: "CM IPD",
//                     start: "20260401T090000Z",
//                     end: "20260401T103000Z",
//                     location: "Amphi B",
//                     description: "Protocoles réseau",
//                     color: "#ffcc00",
//                 },
//                 {
//                     title: "TP IPD",
//                     start: "20260401T110000Z",
//                     end: "20260401T123000Z",
//                     location: "Salle info",
//                     description: "Configuration",
//                     color: "#ffcc00",
//                 },
//                 {
//                     title: "FREE CM",
//                     start: "20260401T130000Z",
//                     end: "20260401T170000Z",
//                     location: "Domicile",
//                     description: "Repos / tâches perso",
//                     color: "#cccccc",
//                 },

//                 // Jeudi
//                 {
//                     title: "CM BDD",
//                     start: "20260402T080000Z",
//                     end: "20260402T093000Z",
//                     location: "Amphi C",
//                     description: "Modélisation",
//                     color: "#ff9966",
//                 },
//                 {
//                     title: "Projet PGCODE",
//                     start: "20260402T100000Z",
//                     end: "20260402T120000Z",
//                     location: "Salle projet",
//                     description: "Travail encadré",
//                     color: "#9966ff",
//                 },
//                 {
//                     title: "RES TD",
//                     start: "20260402T140000Z",
//                     end: "20260402T160000Z",
//                     location: "Bibliothèque",
//                     description: "Révisions",
//                     color: "#6699ff",
//                 },

//                 // Vendredi
//                 {
//                     title: "CM SECU",
//                     start: "20260403T090000Z",
//                     end: "20260403T103000Z",
//                     location: "Amphi D",
//                     description: "Cybersécurité",
//                     color: "#ff3333",
//                 },
//                 {
//                     title: "TP SECU",
//                     start: "20260403T110000Z",
//                     end: "20260403T123000Z",
//                     location: "Salle info",
//                     description: "Pratique",
//                     color: "#ff3333",
//                 },
//                 {
//                     title: "END WEEK",
//                     start: "20260403T140000Z",
//                     end: "20260403T170000Z",
//                     location: "Extérieur",
//                     description: "Temps libre",
//                     color: "#33cc99",
//                 }
//             ]
//         };
//     }
// }