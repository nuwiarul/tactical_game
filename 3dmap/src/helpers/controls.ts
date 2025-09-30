import {Map} from "maptalks-gl";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {ModelControl} from '@/lib/modelcontrol.js';
import type {IObjectProperties} from "@/helpers/objects.ts";
export const createModelControl = (map: Map, callback?: (id: string, command: string, data: string) => void) => {
    const modelControl = new ModelControl(map, {
        lineSymbol: {
            lineColor: '#fff'
        },
        scaleColor: 'red' ,
        heightColor: 'transparent',
        rotateColor: 'blue',
        translateColor: 'green',
        highLightColor: 'yellow',
        opacity: 0.4,
        panelSize: 300,
        //Allow negative altitude values
        allowNegativeAltitude: false,
        // scaleCursor:'url(data/scale-cursor.svg) 13 13, auto',
        // rotationCursor:'url(data/rotation-cursor.svg) 13 13, auto',
        // translateCursor:'url(data/translate-cursor.svg) 13 13, auto',
        // heightCursor:'url(data/height-cursor.svg) 13 13, auto',
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    modelControl.on('translate rotation scale rotation_out translate_out translate_in', e => {
        const {type} = e;

        const currentModel = e.target.model;
        if (type === 'translate') {
            if (currentModel) {
                currentModel.setCoordinates(e.coordinate);
                const properties = currentModel.getProperties();
                if (properties && properties.icon) {
                    const iconModel = properties.icon;
                    iconModel.setCoordinates([e.coordinate.x, e.coordinate.y, currentModel.getModelHeight()]);
                }

                if (properties && properties.child) {
                    properties.child.setCoordinates([e.coordinate.x, e.coordinate.y + properties.space]);
                }
            }
        }

        if (type === 'rotation') {
            if (currentModel) {
                const rotation = e.rotation;
                if (currentModel) {
                    const angle = currentModel.getRotation();

                    currentModel.setRotation(angle[0], angle[1], rotation + 180);
                    const properties = currentModel.getProperties();
                    if (properties && properties.icon) {
                        const iconModel = properties.icon;
                        iconModel.setRotation(0, 0, rotation + 180);
                    }

                    if (properties && properties.child) {
                        properties.child.setRotation(0, 0, rotation + 180);
                    }
                }
            }
        }

        if (type === 'translate_in') {
            if (currentModel) {
                if (currentModel.getAnimations() && currentModel.getCurrentAnimation() !== "Idle|Walk") {
                    currentModel.setCurrentAnimation("Idle|Walk");
                    const properties = currentModel.getProperties();
                    if (properties && properties.child) {
                        if (properties.child.getAnimations() && properties.child.getAnimations() !== "Idle|Walk") {
                            properties.child.setCurrentAnimation("Idle|Walk");
                        }
                    }

                }
            }
        }

        if (type === 'translate_out') {
            if (currentModel) {
                const properties = currentModel.getProperties() as IObjectProperties;
                if (currentModel.getAnimations() && currentModel.getCurrentAnimation() !== "Idle|Idle") {
                    currentModel.setCurrentAnimation("Idle|Idle");

                    if (properties && properties.child) {
                        if (properties.child.getAnimations() && properties.child.getAnimations() !== "Idle|Idle") {
                            properties.child.setCurrentAnimation("Idle|Idle");
                        }
                    }
                }

                /*
                if (callback) {
                    const data = {
                        command: "move",
                        x: currentModel.getCoordinates().x,
                        y: currentModel.getCoordinates().y,
                    }
                    callback(properties.id, "MOVE", JSON.stringify(data));
                }

                 */
            }

        }

        if (type === 'rotation_out') {
            if (currentModel) {
                const properties = currentModel.getProperties() as IObjectProperties;
                if (callback) {
                    const rot = currentModel.getRotation();
                    const data = {
                        command: "rot",
                        x: rot[0],
                        y: rot[1],
                        z: rot[2],
                    }
                    callback(properties.id, "ROT", JSON.stringify(data));
                }
            }
        }

        if (type === 'scale') {
            if (currentModel) {
                const scale = e.scale;
                const properties = currentModel.getProperties() as IObjectProperties;
                if (properties && properties.originalHeight) {
                    currentModel.setScale(scale, scale, scale)
                }

            }
        }


    })

    return modelControl;
}



