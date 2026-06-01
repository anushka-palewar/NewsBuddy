import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const AdminContent = () => {
  const navigate = useNavigate();

  const goTo = (audience, section) => {
    if (section === "live") {
      navigate(`/admin/live-channels?audience=${audience}`);
    } else if (section === "newspapers") {
      navigate(`/admin/newspapers?audience=${audience}`);
    }
  };

  return (
    <AdminLayout
      title="Content Management"
      subtitle="Switch between Kids and Adult content contexts"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Kids Content</h3>
          <p className="text-sm text-gray-600 mb-4">
            Manage live TV channels and newspapers that are shown in the Kids section.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => goTo("CHILD", "live")}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Manage Live TV (Kids)
            </button>
            <button
              onClick={() => goTo("CHILD", "newspapers")}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Manage Newspapers (Kids)
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Adult Content</h3>
          <p className="text-sm text-gray-600 mb-4">
            Manage live TV channels and newspapers that are shown in the Adult section.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => goTo("ADULT", "live")}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Manage Live TV (Adult)
            </button>
            <button
              onClick={() => goTo("ADULT", "newspapers")}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Manage Newspapers (Adult)
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
