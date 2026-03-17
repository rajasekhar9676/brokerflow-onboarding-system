import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { customerAPI, userAPI } from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError("");
      try {
        if (user?.role === "ADMIN") {
          const [usersRes, customersRes] = await Promise.all([
            userAPI.getAll(),
            customerAPI.getMyCustomers(),
          ]);
          if (usersRes.data?.success) setUsers(usersRes.data.data.users || []);
          if (customersRes.data?.success) setCustomers(customersRes.data.data.customers || []);
        } else {
          const res = await customerAPI.getMyCustomers();
          if (res.data?.success) setCustomers(res.data.data.customers || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.role]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          {user?.role === "ADMIN" ? "Admin Dashboard" : "Broker Dashboard"}
        </h1>
        <p className="text-slate-600 mt-1">
          {user?.role === "ADMIN"
            ? "All users in the system"
            : "Customers you have onboarded"}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700">
          {error}
        </div>
      )}

      {user?.role === "ADMIN" ? (
        <>
          <div className="mb-6 flex justify-end">
            <Link
              to="/customers/new"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition"
            >
              + New Customer
            </Link>
          </div>
          <div className="mb-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Customers I&apos;ve added</h2>
              <p className="text-sm text-slate-500 mt-0.5">Customers you onboarded (as admin)</p>
            </div>
            {customers.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No customers yet.{" "}
                <Link to="/customers/new" className="text-primary-600 hover:text-primary-700 font-medium">
                  Add your first customer
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">GSTIN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{c.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{c.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{c.gstin}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-semibold text-slate-900">All Users</h2>
            </div>
            {users.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No users yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Customers
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {u.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              u.role === "ADMIN"
                                ? "bg-primary-100 text-primary-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {u._count?.customers ?? 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="mb-6 flex justify-end">
            <Link
              to="/customers/new"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition"
            >
              + New Customer
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">My Customers</h2>
            </div>
            {customers.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No customers yet.{" "}
                <Link to="/customers/new" className="text-primary-600 hover:text-primary-700 font-medium">
                  Create your first customer
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        GSTIN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {c.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {c.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {c.gstin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
