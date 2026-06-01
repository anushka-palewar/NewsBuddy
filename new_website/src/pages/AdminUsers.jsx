import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAdminUsers } from "../services/newsService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAdminUsers().then((data) => setUsers(data || []));
  }, []);

  return (
    <AdminLayout title="Users" subtitle="View registered accounts and roles">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {users.length === 0 ? (
          <p className="text-sm text-gray-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Age</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{user.fullName}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3">{user.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
