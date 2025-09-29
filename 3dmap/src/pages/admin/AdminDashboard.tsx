import MainLayout from "@/layouts/MainLayout.tsx";

const AdminDashboard = () => {
    return (
        <MainLayout activeMenu="dashboard">
            <div className="p-4">Ini Admin Dashboard</div>
        </MainLayout>
    );
};

export default AdminDashboard;