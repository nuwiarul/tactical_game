import {useNavigate} from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        // Kembali ke halaman sebelumnya
        navigate("/");
    };

    return (
        <div className="w-screen h-screen bg-gray-50 text-gray-800">
            <div className="flex items-center justify-center min-h-screen p-4">
                <div
                    className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center border-t-4 border-gray-500">
                    <div className="mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-500 animate-pulse"
                             fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.382 17c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">404</h1>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">Not FOUND</h2>
                    <p className="text-lg text-gray-500 mb-6">
                        Sorry, your page is not found
                    </p>

                    <button
                        onClick={() => handleGoBack()}
                        className="cursor-pointer inline-block px-8 py-3 font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition duration-300 transform hover:scale-105 shadow-lg">
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;