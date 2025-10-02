//export const BASE_URL = "http://localhost:8010";
//export const IMAGE_BASE_URL = "http://localhost:8010";
export const BASE_URL = "https://api-twg.jagradewata.id";
export const IMAGE_BASE_URL = "https://api-twg.jagradewata.id";
export const CENTRIFUGO_URL = "wss://centrifugo.jagradewata.id/connection/websocket"
//export const CENTRIFUGO_URL = "ws://localhost:8000/connection/websocket"

export const API_PATHS = {
    AUTH : {
        LOGIN : "/auth/login",
    },
    CATEGORIES : {
        PAGINATE : ({pageSize, pageNumber, search} : {pageSize: number, pageNumber: number, search: string}) => `/admin/categories?pageSize=${pageSize}&pageNumber=${pageNumber}&search=${search}`,
        DELETE: (id: string) => `/admin/categories/${id}`,
        GET: (id: string) => `/admin/categories/${id}`,
        CREATE: '/admin/categories',
        UPDATE: (id: string) => `/admin/categories/${id}`,
        ALL: '/private/categories/all',
    },
    OPERASIS : {
        PAGINATE : ({pageSize, pageNumber, search} : {pageSize: number, pageNumber: number, search: string}) => `/private/operasis?pageSize=${pageSize}&pageNumber=${pageNumber}&search=${search}`,
        DELETE: (id: string) => `/admin/operasis/${id}`,
        GET: (id: string) => `/private/operasis/${id}`,
        CREATE: '/admin/operasis',
        UPDATE: (id: string) => `/admin/operasis/${id}`,
        ALL: '/public/operasis/all',
        HOME: '/public/list/operasis',
        PREVIEW: (id: string) => `/public/get/home/operasis/${id}`,
    },
    SKENARIOS : {
        DELETE: (id: string) => `/admin/skenarios/${id}`,
        GET: (id: string) => `/public/skenarios/get/${id}`,
        LIST: (operasiId: string) => `/public/skenarios/${operasiId}`,
        CREATE: '/admin/skenarios',
        UPDATE: (id: string) => `/admin/skenarios/${id}`,
    },
    MARKERS : {
        DELETE: (id: string) => `/private/markers/${id}`,
        LIST: (skenarioId: string) => `/public/markers/list/${skenarioId}`,
        CREATE: '/private/markers',
        UPDATE_GEOM: (id: string) => `/private/markers/geom/${id}`,
        UPDATE_NAME: (id: string) => `/private/markers/name/${id}`,
        UPDATE_SCALE: (id: string) => `/private/markers/scale/${id}`,
        UPDATE_ROTASI: (id: string) => `/private/markers/rotasi/${id}`,
    },
    BUILDINGS : {
        DELETE: (id: string) => `/private/buildings/${id}`,
        LIST: (skenarioId: string) => `/public/buildings/list/${skenarioId}`,
        CREATE: '/private/buildings',
        UPDATE: (id: string) => `/private/buildings/${id}`,
    },
    ALURS : {
        DELETE: (id: string) => `/admin/alurs/${id}`,
        LIST: (skenarioId: string) => `/public/alurs/list/${skenarioId}`,
        CREATE: '/admin/alurs',
        UPDATE: (id: string) => `/admin/alurs/${id}`,
    },
    USERS : {
        DELETE: (id: string) => `/admin/users/${id}`,
        LIST: `/admin/users`,
        CREATE: '/admin/users',
        UPDATE: (id: string) => `/admin/users/${id}`,
        GET: (id: string) => `/private/users/${id}`,
    },
    PROFILE: {
        IDENTIFY : "/private/identify",
    },
    LAST_POSITIONS: (skenario_id: string) => `/public/last_positions/${skenario_id}`,
    UPLOAD_IMAGE: '/private/upload-image',
    PUBLISH: '/public/socket'
}