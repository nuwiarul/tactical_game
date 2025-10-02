import {Joystick, Layers2, Map, PersonStanding, Users} from "lucide-react";

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
            },
            {
                title: "Users",
                url: "/users",
                icon: Users,
                active: "users",
                key: "master-users"
            }
        ],
    },
    {
        title: "Games",
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
        title: "Games",
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