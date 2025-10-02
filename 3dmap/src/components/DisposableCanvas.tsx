import {type ReactNode, useEffect} from "react";
import {useThree} from "@react-three/fiber";
import {useGLTF} from "@react-three/drei";

export function BaseModel({url}: { url: string }) {
    const gltf = useGLTF(url);
    const model = gltf.scene;
    model.rotation.y = Math.PI / -2;
    return <primitive object={model}/>;

}

export const DisposableCanvas = ({children}: {children: ReactNode}) => {
    const {gl} = useThree();
    useEffect(() => {
        return () => {
            gl.dispose();
        };
    }, [gl]);

    return <>{children}</>;
};