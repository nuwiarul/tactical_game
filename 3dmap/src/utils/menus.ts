import {Joystick, Layers2, Map, PersonStanding} from "lucide-react";

export const adminItems = [
    {
        title: "Master Data",
        items: [
            {
                title: "Units",
                url: "/units",
                icon: PersonStanding,
                active: "unitss",
                key: "master-unitss"
            }
        ],
    },
    {
        title: "Proses",
        items: [
            {
                title: "Operasis",
                url: "/operasis",
                icon: Layers2,
                active: "operasis",
                key: "proses-operasis"
            },
            {
                title: "Tactical Game",
                url: "/games",
                icon: Map,
                active: "games",
                key: "proses-games"
            },
            {
                title: "Latihan",
                url: "/latihans",
                icon: Joystick,
                active: "latihans",
                key: "proses-latihans"
            }
        ]
    }
];

export const userItems = [
    {
        title: "Proses",
        items: [
            {
                title: "Maps",
                url: "/maps",
                icon: Map,
                active: "maps",
                key: "master-maps"
            }
        ]
    }
];