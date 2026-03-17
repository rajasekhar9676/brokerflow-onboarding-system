import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-primary-600">
            <span className="text-2xl">📋</span>
            BrokerFlow
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden sm:inline">
              {user?.name} <span className="text-slate-400">({user?.role})</span>
            </span>
            {(user?.role === "BROKER" || user?.role === "ADMIN") && (
              <Link
                to="/customers/new"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                New Customer
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
