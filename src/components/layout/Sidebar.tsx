import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  BarChart3, 
  Package, 
  Settings, 
  FileText, 
  ChevronLeft,
  ChevronRight,
  Pill
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { profile } = useAuthStore();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const isAdmin = profile?.role === 'admin';
  const isPharmacist = profile?.role === 'pharmacist' || isAdmin;
  const isVendor = profile?.role === 'vendor' || isAdmin;
  
  return (
    <aside 
      className={`bg-[#1e88e5] text-white transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } hidden md:block relative`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className={`flex items-center ${collapsed ? 'justify-center w-full' : ''}`}>
          <Pill className="h-8 w-8" />
          {!collapsed && <span className="ml-2 text-xl font-bold">PharmaSaaS</span>}
        </div>
        <button 
          onClick={toggleSidebar}
          className="text-white p-1 rounded hover:bg-blue-600"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2 px-2">
          {isVendor && (
            <li>
              <NavLink
                to="/vendor"
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg ${
                    isActive ? 'bg-blue-700' : 'hover:bg-blue-600'
                  } ${collapsed ? 'justify-center' : 'pl-3'}`
                }
              >
                <MessageSquare className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Conversations</span>}
              </NavLink>
            </li>
          )}
          
          {isPharmacist && (
            <li>
              <NavLink
                to="/pharmacist"
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg ${
                    isActive ? 'bg-blue-700' : 'hover:bg-blue-600'
                  } ${collapsed ? 'justify-center' : 'pl-3'}`
                }
              >
                <Pill className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Prescriptions</span>}
              </NavLink>
            </li>
          )}
          
          {isAdmin && (
            <>
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => 
                    `flex items-center p-2 rounded-lg ${
                      isActive ? 'bg-blue-700' : 'hover:bg-blue-600'
                    } ${collapsed ? 'justify-center' : 'pl-3'}`
                  }
                >
                  <BarChart3 className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Dashboard</span>}
                </NavLink>
              </li>
              
              <li>
                <NavLink
                  to="/stock"
                  className={({ isActive }) => 
                    `flex items-center p-2 rounded-lg ${
                      isActive ? 'bg-blue-700' : 'hover:bg-blue-600'
                    } ${collapsed ? 'justify-center' : 'pl-3'}`
                  }
                >
                  <Package className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Inventory</span>}
                </NavLink>
              </li>
              
              <li>
                <NavLink
                  to="/reports"
                  className={({ isActive }) => 
                    `flex items-center p-2 rounded-lg ${
                      isActive ? 'bg-blue-700' : 'hover:bg-blue-600'
                    } ${collapsed ? 'justify-center' : 'pl-3'}`
                  }
                >
                  <FileText className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Reports</span>}
                </NavLink>
              </li>
              
              <li>
                <NavLink
                  to="/users"
                  className={({ isActive }) => 
                    `flex items-center p-2 rounded-lg ${
                      isActive ? 'bg-blue-700' : 'hover:bg-blue-600'
                    } ${collapsed ? 'justify-center' : 'pl-3'}`
                  }
                >
                  <Users className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Users</span>}
                </NavLink>
              </li>
              
              <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) => 
                    `flex items-center p-2 rounded-lg ${
                      isActive ? 'bg-blue-700' : 'hover:bg-blue-600'
                    } ${collapsed ? 'justify-center' : 'pl-3'}`
                  }
                >
                  <Settings className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Settings</span>}
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className={`text-xs text-blue-100 ${collapsed ? 'text-center' : ''}`}>
          {!collapsed && <p>Version 1.0.0</p>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;