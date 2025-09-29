export interface IUnit {
    id: string;
    name: string;
    operasi: {
        id: string;
        name: string;
        created_at: string;
        updated_at: string;
    };
    skenario: {
        id: string;
        name: string;
        operasi: {
            id: string;
            name: string;
            created_at: string;
            updated_at: string;
        };
        center_x: number;
        center_y: number;
        zoom: number;
        max_zoom: number;
        pitch: number;
        created_at: string;
        updated_at: string;
    };
    unit_id: string;
    kategori: string;
    jumlah: number;
    rot_x: number;
    rot_y: number;
    rot_z: number;
    pos_x: number;
    pos_y: number;
    keterangan: string;
    created_at: string;
    updated_at: string;
}