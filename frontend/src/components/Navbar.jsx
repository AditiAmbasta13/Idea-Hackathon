import { useNavigate, useLocation } from 'react-router-dom';
import UnionLogo from './union_bank_logo.png';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path ? 'bg-unionblue-800' : 'hover:bg-unionblue-800';
  };

  // Function to handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-gray-50">
      {/* Header with Union Bank Logo */}
      <header className="bg-unionblue-700 text-white py-4">
        <div className="container mx-auto px-4 flex items-center">
          <div className="mr-4">
            <img 
              src={UnionLogo} 
              alt="Union Bank Logo" 
              className="h-10"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold">UNION BANK OF INDIA</h1>
            <p className="text-sm">Financial Fraud Prevention System</p>
          </div>
          <div className="ml-auto">
            <button onClick={() => navigate('/onboarding')} className="bg-white text-unionblue-700 px-4 py-2 text-sm font-medium rounded">Login</button>
          </div>
          <a 
            onClick={() => handleNavigation('/profiles')} 
            className={`block py-3 px-4 cursor-pointer ${isActive('/profiles')}`}
          >
            Profile
          </a>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-unionblue-900 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap">
            <li>
              <a 
                onClick={() => handleNavigation('/')} 
                className={`block py-3 px-4 cursor-pointer ${isActive('/')}`}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                onClick={() => handleNavigation('/about')} 
                className={`block py-3 px-4 cursor-pointer ${isActive('/about')}`}
              >
                About
              </a>
            </li>
            <li>
              <a 
                onClick={() => handleNavigation('/services')} 
                className={`block py-3 px-4 cursor-pointer ${isActive('/services')}`}
              >
                Services
              </a>
            </li>
            <li>
              <a 
                onClick={() => handleNavigation('/resources')} 
                className={`block py-3 px-4 cursor-pointer ${isActive('/resources')}`}
              >
                Resources
              </a>
            </li>
            <li>
              <a 
                onClick={() => handleNavigation('/contact')} 
                className={`block py-3 px-4 cursor-pointer ${isActive('/contact')}`}
              >
                Contact
              </a>
            </li>
            <li>
              <a 
                onClick={() => handleNavigation('/faqs')} 
                className={`block py-3 px-4 cursor-pointer ${isActive('/faqs')}`}
              >
                FAQs
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;