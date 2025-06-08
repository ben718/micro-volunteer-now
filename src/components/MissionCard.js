"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MissionCard;
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const outline_1 = require("@heroicons/react/24/outline");
function MissionCard({ mission }) {
    return (<react_router_dom_1.Link to={`/mission/${mission.id}`} className="block bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
          {mission.category}
        </span>
        <span className="text-sm text-gray-500">
          {mission.spots_taken}/{mission.spots_available} places
        </span>
      </div>
      
      <h3 className="text-xl font-semibold text-primary-700 mb-2">{mission.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{mission.short_description}</p>
      
      <div className="flex items-center text-sm text-gray-500">
        <outline_1.MapPinIcon className="w-4 h-4 mr-2"/>
        {mission.city}
        {mission.distance && (<span className="ml-2 text-primary-600">
            ({mission.distance} km)
          </span>)}
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mt-2">
        <outline_1.CalendarIcon className="w-4 h-4 mr-2"/>
        {new Date(mission.date).toLocaleDateString('fr-FR')}
      </div>
    </react_router_dom_1.Link>);
}
