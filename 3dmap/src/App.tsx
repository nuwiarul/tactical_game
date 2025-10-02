import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ThemeProvider} from "@/providers/ThemeProvider.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import MapsIndex from "@/pages/maps/Maps.tsx";
import AuthProvider from "./context/AuthProvider";
import PrivateRoute from "@/routes/PrivateRoute.tsx";
import Home from "@/pages/home/MapHome.tsx";
import LoginPage from "@/pages/auth/LoginPage.tsx";
import Forbidden from "@/pages/Forbidden.tsx";
import UnAuthorized from "@/pages/UnAuthorized.tsx";
import NotFound from "@/pages/NotFound.tsx";
import OperasiPage from "@/pages/operasis/OperasiPage.tsx";
import OperasiCreate from "@/pages/operasis/OperasiCreate.tsx";
import OperasiUpdate from "@/pages/operasis/OperasiUpdate.tsx";
import SkenarioPage from "@/pages/skenarios/SkenarioPage.tsx";
import SkenarioMapCreate from "@/pages/skenarios/SkenarioMapCreate.tsx";
import SkenarioPlotPage from "@/pages/skenarios/SkenarioPlotPage.tsx";
import ListOperasi from "@/pages/home/ListOperasi.tsx";
import PreviewMap from "@/pages/home/PreviewMap.tsx";
import AdminDashboard from "@/pages/admin/AdminDashboard.tsx";
import UserDashboard from "@/pages/user/UserDashboard.tsx";
import UnitPage from "@/pages/units/UnitPage.tsx";
import ListGame from "@/pages/game/ListGame.tsx";
import PreviewGame from "@/pages/game/PreviewGame.tsx";
import UsersPage from "@/pages/users/UsersPage.tsx";
import UsersCreate from "@/pages/users/UsersCreate.tsx";
import UsersUpdate from "@/pages/users/UsersUpdate.tsx";

const queryClient = new QueryClient()

const App = () => {
    return (
        <div>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <AuthProvider>
                            <Routes>
                                <Route element={<PrivateRoute allowedRoles={["admin"]}/>}>
                                    <Route path="/admin" element={<AdminDashboard/>}/>
                                    <Route path="/units" element={<UnitPage/>}/>
                                    <Route path="/users" element={<UsersPage/>}/>
                                    <Route path="/users/create" element={<UsersCreate/>}/>
                                    <Route path="/users/update/:id" element={<UsersUpdate/>}/>
                                    <Route path="/operasis/create" element={<OperasiCreate/>}/>
                                    <Route path="/operasis/update/:id" element={<OperasiUpdate/>}/>
                                    <Route path="/skenarios/create/:operasiId" element={<SkenarioMapCreate/>}/>
                                </Route>
                                <Route element={<PrivateRoute allowedRoles={["admin", "user"]}/>}>
                                    <Route path="/operasis" element={<OperasiPage/>}/>
                                    <Route path="/skenarios/plot/:id" element={<SkenarioPlotPage/>}/>
                                    <Route path="/user" element={<UserDashboard/>}/>
                                    <Route path="/maps" element={<MapsIndex/>}/>
                                    <Route path="/games" element={<ListGame isRecord={1}/>}/>
                                    <Route path="/latihans" element={<ListGame isRecord={0}/>}/>
                                    <Route path="/skenarios/:operasiId" element={<SkenarioPage/>}/>
                                    <Route path="/game/:operasi_id/:skenario_id" element={<PreviewGame isRecord={1}/>}/>
                                    <Route path="/latihan/:operasi_id/:skenario_id" element={<PreviewGame isRecord={0}/>}/>
                                </Route>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/list/operasis" element={<ListOperasi/>}/>
                                <Route path="/preview/:operasi_id/:skenario_id" element={<PreviewMap/>}/>
                                <Route path="/login" element={<LoginPage/>}/>
                                <Route path="/403" element={<Forbidden/>}/>
                                <Route path="/401" element={<UnAuthorized/>}/>
                                <Route path="*" element={<NotFound/>}/>
                            </Routes>
                        </AuthProvider>
                    </BrowserRouter>
                </QueryClientProvider>
            </ThemeProvider>
        </div>
    );
};

export default App;