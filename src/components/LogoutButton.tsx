import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton = ({ className = "" }: LogoutButtonProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 ${className}`}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
