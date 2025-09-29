
export interface IBaseChildModel {
    height: number,
    rotation: {
        x : number,
        y : number,
        z: number,
    },
    modelUrl: string,
    animation: boolean,
    space: number,
}

export interface IBaseModel {
    id: string,
    name: string,
    height: number,
    rotation: {
        x : number,
        y : number,
        z: number,
    },
    modelUrl: string,
    animation: boolean,
    icon?: string,
    child?: IBaseChildModel,
}

export const UNITS: IBaseModel[] = [
    {
        id: "93c49140-056f-473f-b2c8-a376184ff7e7",
        name: "Polwan",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/polwan_anim.glb",
        animation: true
    },
    {
        id: "378c8b26-7303-4d43-b630-605e56af855c",
        name: "Polisi K9",
        height: 8,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/dog_anim.glb",
        animation: true,
        /*
        child: {
            height: 8,
            rotation: {
                x : 0,
                y : 0,
                z : 90,
            },
            modelUrl: "/dog_anim.glb",
            animation: true,
            space: 0.00008
        }

         */
    },
    {
        id: "2f87aadb-e220-4468-a6b8-8dd6dfe9d80e",
        name: "Dalmas",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/dalmas_samapta_anim.glb",
        animation: true,
    },
    {
        id: "6790a969-153e-4170-8361-0e60fd18bfe8",
        name: "Brimob Dalmas",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/brimob_dalmas_anim.glb",
        animation: true,
    },
    {
        id: "a5cbfcf9-56c9-4b23-9d76-d747116b9bb6",
        name: "Polisi Kuda",
        height: 20,
        rotation: {
            x : -90,
            y : 0,
            z : 90,
        },
        modelUrl: "/polisi_dan_kuda_anim.glb",
        animation: true,
    },
    {
        id: "fcb902ba-b62c-4eba-8d15-365de142e39d",
        name: "Samapta Gas Air Mata",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/samapta_gas_mata_anim.glb",
        animation: true,
    },
    {
        id: "842733d8-8bce-41f7-9de3-275e5d030045",
        name: "Brimob Gas Air Mata",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/brimob_gas_mata_anim.glb",
        animation: true,
    },
    {
        id: "8977569e-ec3f-4ca1-b4d6-f80d8d5fb718",
        name: "Samapta",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/samapta_anim.glb",
        animation: true,
    },
    {
        id: "bf88d9fa-cc77-4205-9288-4d82825786e1",
        name: "Dokkes",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/dokkes_anim.glb",
        animation: true,
    },
    {
        id: "2ed6ed39-7932-4ba1-80ff-5d04b998d9f3",
        name: "Humas",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/humas_anim.glb",
        animation: true,
    },
    {
        id: "5256c5a3-8f45-4524-82fa-50db8f919ad8",
        name: "Intel",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/intel_anim.glb",
        animation: true,
    },
    {
        id: "248e4a9a-7d54-4326-a0c0-d0a1d8f685d9",
        name: "Propam",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/propam_anim.glb",
        animation: true,
    },
    {
        id: "b0af4fe8-2ead-4516-bc40-ad2485032858",
        name: "Brimob",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/brimob_anim.glb",
        animation: true,
    },
    {
        id: "1dd5a214-ecd9-4e14-a7dc-a2b4caa26939",
        name: "Lantas",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/lantas_anim.glb",
        animation: true,
    },
    {
        id: "8dafa497-4768-4363-8850-4ba009bb0cbd",
        name: "Babinkamtibmas",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/babin_anim.glb",
        animation: true,
    },
    {
        id: "2aa7d793-ef1a-45b3-910e-d7cd0ffb6ca3",
        name: "Polairud",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/airud_anim.glb",
        animation: true,
    },
    {
        id: "a79df20a-7af5-4bd5-a461-19efff26a245",
        name: "SatNarkoba",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/narkoba_anim.glb",
        animation: true,
    },
    {
        id: "9d5cfbf6-7a08-4431-b128-c086ef665be3",
        name: "Sat Reskrim",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/reskrim_anim.glb",
        animation: true,
    },
    {
        id: "55d3cc00-a233-40f7-b3f9-515d8948a40b",
        name: "Pam Obvit",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/pamobvit_anim.glb",
        animation: true,
    },
    {
        id: "0974d442-3366-4ed2-b740-b6ae04696958",
        name: "TIK",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/tik_anim.glb",
        animation: true,
    },
    {
        id: "c8890baa-0b04-495c-8aa6-2cfb3a305049",
        name: "Polwan Lantas",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/polwan_lantas_anim.glb",
        animation: true,
    },
]

export const KENDARAANS:  IBaseModel[] = [
    {
        id: "8fc63690-5bd9-4383-b15a-ba8808adeb91",
        name: "Motor Patwal",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/motor_patwal_anim.glb",
        animation: true,
    },
    {
        id: "85d4a321-a06f-470b-b754-5aa2628a9fa3",
        name: "Motor Samapta",
        height: 29,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/motor_samapta_anim.glb",
        animation: true,
    },
    {
        id: "f75684db-454a-48c9-b9eb-eecfa7c64c88",
        name: "Motor Brimob",
        height: 29,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/motor_brimob_anim.glb",
        animation: true,
    },
    {
        id: "d79d3525-3ee4-4ebc-930c-04fac4de72a1",
        name: "Water Canon Brimob",
        height: 40,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/water_canon_brimob_anim.glb",
        animation: true,
    },
    {
        id: "27550855-9ea4-4b37-8b3e-6571524f3a5e",
        name: "Water Canon Samapta",
        height: 40,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/water_canon_samapta_anim.glb",
        animation: true,
    },
    {
        id: "3a0b057c-8859-44fa-87a2-a721e3c13887",
        name: "Rantis Brimob",
        height: 35,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/rantis_brimob_anim.glb",
        animation: true,
    },
    {
        id: "82b1270b-6f21-46e2-9311-c526d1d2ccd9",
        name: "Mobil Damkar",
        height: 40,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/mobil_damkar_anim.glb",
        animation: true,
    },
    {
        id: "639469ce-143e-4e73-a5f1-44921a7b9b0b",
        name: "Mobil Patwal",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/mobil_patwal_anim.glb",
        animation: true,
    },
    {
        id: "9bef92f2-1582-497c-b530-0bae79a59ca0",
        name: "Mobil Dokkes",
        height: 30,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/mobil_dokkes_anim.glb",
        animation: true,
    },
    {
        id: "c21b5766-9e82-42db-abcc-bb260af8d266",
        name: "Mobil Gegana",
        height: 35,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/mobil_gegana_anim.glb",
        animation: true,
    },
]

export const STACKHOLDERS: IBaseModel[] = [
    {
        id: "416f89fe-8032-4731-a7f1-d67ff83c3def",
        name: "TNI AD",
        height: 20,
        rotation: {
            x : 2,
            y : 0,
            z: 90,
        },
        modelUrl: "/tni_ad_anim.glb",
        animation: true
    },
    {
        id: "1c63bbda-dc7f-4fe5-b157-d096efafb05f",
        name: "Damkar",
        height: 20,
        rotation: {
            x : 2,
            y : 0,
            z: 90,
        },
        modelUrl: "/damkar_anim.glb",
        animation: true,
    },
    {
        id: "105996cb-a01f-462d-8421-118fbfd2bfc1",
        name: "Linmas",
        height: 20,
        rotation: {
            x : 2,
            y : 0,
            z: 90,
        },
        modelUrl: "/linmas_anim.glb",
        animation: true,
    },
    {
        id: "ab97c99c-f389-43ae-95d3-22b20488a9e8",
        name: "Pol PP",
        height: 20,
        rotation: {
            x : 2,
            y : 0,
            z: 90,
        },
        modelUrl: "/polpp_anim.glb",
        animation: true,
    },
    {
        id: "36376f1b-4aee-4e9b-804e-729b9da2d3b5",
        name: "SAR",
        height: 20,
        rotation: {
            x : 2,
            y : 0,
            z: 90,
        },
        modelUrl: "/sar_anim.glb",
        animation: true,
    },
    {
        id: "75b238d3-8ca4-4ae7-9361-deb9ad41f862",
        name: "Dishub",
        height: 20,
        rotation: {
            x : 2,
            y : 0,
            z: 90,
        },
        modelUrl: "/dishub_anim.glb",
        animation: true,
    },
    {
        id: "8ba6357b-0407-4871-86d5-9c6a6cb82e93",
        name: "Pecalang",
        height: 20,
        rotation: {
            x : 2,
            y : 0,
            z: 90,
        },
        modelUrl: "/pecalang_anim.glb",
        animation: true,
    },
]

export const PEOPLES: IBaseModel[] = [
    {
        id: "46ec9506-338e-4981-bfb5-75bbf3a8ce7c",
        name: "Perusuh",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/perusuh_anim.glb",
        animation: true,
    },
    {
        id: "df211373-41c1-4200-9dd2-44b4760f8e54",
        name: "Wanita",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/wanita_anim.glb",
        animation: true,
    },
    {
        id: "199ec2c7-d11a-4972-aaf3-5c2e8d274273",
        name: "Masyarakat",
        height: 20,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/masyarakat_anim.glb",
        animation: true,
    },
]

export const TOOLS: IBaseModel[] = [
    {
        id: "5c0c8739-cf6e-4ed5-8e74-8db8a4b4c640",
        name: "Barrier",
        height: 10,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/barrier.glb",
        animation: false,
    },
    {
        id: "c0edbc16-129d-4a42-9687-14a5f634ab0a",
        name: "Cone",
        height: 10,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/cone.glb",
        animation: false,
    },
    {
        id: "dab0728f-a938-4170-8f7f-23f75503bb86",
        name: "Kawat Berduri",
        height: 15,
        rotation: {
            x : 0,
            y : 0,
            z : 90,
        },
        modelUrl: "/kawat_berduri.glb",
        animation: false,
    },
]
