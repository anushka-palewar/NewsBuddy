import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAdminStatus } from "../services/newsService";

const AdminSystem = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getAdminStatus().then(setStatus);
  }, []);

  return (
    <AdminLayout title="System" subtitle="Server and platform health overview">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard label="Server time" value={status?.serverTime} />
        <StatusCard label="Total users" value={status?.totalUsers} />
        <StatusCard label="Active adult channels" value={status?.activeAdultChannels} />
        <StatusCard label="Active kids channels" value={status?.activeKidsChannels} />
        <StatusCard label="Active adult newspapers" value={status?.activeAdultNewspapers} />
        <StatusCard label="Active kids newspapers" value={status?.activeKidsNewspapers} />
      </div>
    </AdminLayout>
  );
};

const StatusCard = ({ label, value }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </div>
    <div className="mt-2 text-2xl font-semibold text-gray-900">{value ?? "—"}</div>
  </div>
);

export default AdminSystem;
