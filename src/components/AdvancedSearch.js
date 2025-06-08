"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const outline_1 = require("@heroicons/react/24/outline");
const supabase_1 = require("../lib/supabase");
const Button_1 = __importDefault(require("./Button"));
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const AdvancedSearch = ({ onSearch, onReset, className = '', }) => {
    const [showFilters, setShowFilters] = (0, react_1.useState)(false);
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [filters, setFilters] = (0, react_1.useState)({
        query: '',
        category: '',
        date: '',
        duration: '',
        location: '',
        status: '',
    });
    (0, react_1.useEffect)(() => {
        const fetchCategories = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { data, error } = yield supabase_1.supabase
                    .from('categories')
                    .select('*')
                    .eq('active', true)
                    .order('name');
                if (error)
                    throw error;
                setCategories(data || []);
            }
            catch (error) {
                react_hot_toast_1.default.error('Erreur lors du chargement des catégories: ' + error.message);
            }
        });
        fetchCategories();
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };
    const handleReset = () => {
        setFilters({
            query: '',
            category: '',
            date: '',
            duration: '',
            location: '',
            status: '',
        });
        onReset();
    };
    return (<div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <form onSubmit={handleSubmit}>
        {/* Barre de recherche principale */}
        <div className="relative">
          <input type="text" name="query" value={filters.query} onChange={handleInputChange} placeholder="Rechercher une mission..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vs-blue-primary focus:border-vs-blue-primary"/>
          <outline_1.MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
          <button type="button" onClick={() => setShowFilters(!showFilters)} className="absolute right-3 top-2.5 text-vs-blue-primary hover:text-vs-blue-dark">
            {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
          </button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (<div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select name="category" value={filters.category} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-vs-blue-primary focus:ring-vs-blue-primary">
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (<option key={category.id} value={category.name}>
                      {category.name}
                    </option>))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input type="date" name="date" value={filters.date} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-vs-blue-primary focus:ring-vs-blue-primary"/>
              </div>

              {/* Durée */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée
                </label>
                <select name="duration" value={filters.duration} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-vs-blue-primary focus:ring-vs-blue-primary">
                  <option value="">Toutes les durées</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 heure</option>
                  <option value="120">2 heures</option>
                  <option value="180">3 heures</option>
                </select>
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localisation
                </label>
                <input type="text" name="location" value={filters.location} onChange={handleInputChange} placeholder="Ville ou code postal" className="w-full rounded-md border-gray-300 shadow-sm focus:border-vs-blue-primary focus:ring-vs-blue-primary"/>
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select name="status" value={filters.status} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-vs-blue-primary focus:ring-vs-blue-primary">
                  <option value="">Tous les statuts</option>
                  <option value="published">Publié</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-2">
              <Button_1.default type="button" variant="outline" onClick={handleReset}>
                Réinitialiser
              </Button_1.default>
              <Button_1.default type="submit" variant="primary">
                Rechercher
              </Button_1.default>
            </div>
          </div>)}
      </form>
    </div>);
};
exports.default = AdvancedSearch;
