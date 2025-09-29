import {useNavigate} from "react-router-dom";
import {Ban} from "lucide-react";

const Forbidden = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        // Kembali ke halaman sebelumnya
        navigate(-1);
    };

    const handleLogin = () => {
        // Kembali ke halaman sebelumnya
        navigate("/login");
    };

    return (
        <div className="w-screen h-screen bg-gray-50 text-gray-800">
            <div className="flex items-center justify-center min-h-screen p-4">
                <div
                    className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center border-t-4 border-red-500">
                    <div className="mb-6 text-center items-center justify-center">
                        <Ban size={100} className="text-red-500 text-center mx-auto"/>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">403</h1>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">Access Denied (Forbidden)</h2>
                    <p className="text-lg text-gray-500 mb-6">
                        Sorry, you don't have the necessary permissions to view this page. Please contact an
                        administrator if you believe this is an error.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => handleGoBack()}
                            className="cursor-pointer inline-block px-8 py-3 font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition duration-300 transform hover:scale-105 shadow-lg">
                            Back
                        </button>
                        <button
                            onClick={() => handleLogin()}
                            className="cursor-pointer inline-block px-8 py-3 font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition duration-300 transform hover:scale-105 shadow-lg">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forbidden;