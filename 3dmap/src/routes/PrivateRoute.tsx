import { Outlet} from "react-router-dom";
import {useIdentify} from "@/context/AuthProvider.tsx";
import Forbidden from "@/pages/Forbidden.tsx";
import LoaderPage from "@/pages/LoaderPage.tsx";
import UnAuthorized from "@/pages/UnAuthorized.tsx";

const PrivateRoute = ({ allowedRoles } : {allowedRoles:string[];}) => {

    const identify = useIdentify();
    //console.log(identify);

    if (identify.loading) {
        return <LoaderPage />
    } else {
        if (identify.user) {
            if (!allowedRoles.includes(identify.user?.user?.role)) {
                return <Forbidden />;
            } else {
                return <Outlet />;
            }
        } else {
            //console.log("harus ");
            return <UnAuthorized />;
        }
    }


};

export default PrivateRoute;