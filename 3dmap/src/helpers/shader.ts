import {reshader} from "maptalks-gl";

export const getEffectShader = () => {
    const vert = `
        attribute vec3 aPosition;
        attribute vec2 aTexCoord;
        uniform mat4 projViewMatrix;
        uniform mat4 modelMatrix;
        uniform vec2 uvOffset;
        uniform float width;
        uniform float height;
        varying vec2 vTexCoords;
        void main()
        {
            gl_Position = projViewMatrix * modelMatrix * vec4(aPosition, 1.0);
            vTexCoords = (uvOffset + aTexCoord) * vec2(1.0 / width, 1.0 / height);
        }
    `;
    const frag = `
        precision mediump float;
        uniform sampler2D texture;

        varying vec2 vTexCoords;
        void main() {
            vec4 color = texture2D(texture, vTexCoords);
            gl_FragColor = vec4(color.rgb, color.a) * color.a;
        }
    `;
    const shader = {
        vert,
        frag,
        positionAttribute: 'POSITION',
        extraCommandProps: {
            blend: {
                enable: true,
                func: {
                    src: 'one',
                    dst: 'one minus src alpha'
                },
                equation: 'add'
            },
            depth: {
                enable: true,
                func: 'always',
                mask: true,
                range: [0, 0]
            }
        }
    };
    const material = new reshader.Material();
    return { shader, material };
}