"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const outline_1 = require("@heroicons/react/24/outline");
const solid_1 = require("@heroicons/react/24/solid");
const BottomNav = () => {
    const location = (0, react_router_dom_1.useLocation)();
    const isActive = (path) => {
        return location.pathname === path;
    };
    const navItems = [
        {
            path: '/',
            icon: outline_1.HomeIcon,
            label: 'Accueil'
        },
        {
            path: '/explore',
            icon: outline_1.MagnifyingGlassIcon,
            label: 'Explorer'
        },
        {
            path: '/missions',
            icon: outline_1.CalendarIcon,
            label: 'Missions'
        },
        {
            path: '/profile',
            icon: outline_1.UserIcon,
            label: 'Profil'
        }
    ];
    return (<nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-vs-gray-200 shadow-sm py-2 px-6 z-50">
      <div className="flex justify-between items-center">
        {navItems.map((item, index) => (<react_router_dom_1.Link key={item.path} to={item.path} className={`flex flex-col items-center ${isActive(item.path)
                ? 'text-vs-blue-primary'
                : 'text-vs-gray-500 hover:text-vs-gray-700'}`}>
            {index === 2 ? (<div className="relative -mt-5">
                <button className="h-14 w-14 rounded-full bg-vs-orange-accent flex items-center justify-center shadow-lg">
                  <solid_1.BoltIcon className="h-6 w-6 text-white"/>
                </button>
              </div>) : (<>
                <item.icon className="h-6 w-6"/>
                <span className="text-xs mt-1">{item.label}</span>
              </>)}
          </react_router_dom_1.Link>))}
      </div>
    </nav>);
};
exports.default = BottomNav;
