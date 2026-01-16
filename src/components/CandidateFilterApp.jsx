import React, { useState, useMemo } from 'react';
import { Search, Users, Filter, Calendar, Award, FileText, Globe } from 'lucide-react';
import candidatesData from '../data/candidatos_sample_para_business_case.json';


// Componente principal
export default function CandidateFilterApp() {
  // Estados para los filtros
  const [filters, setFilters] = useState({
    role: '',
    isMigrant: null,
    hasRFC: null,
    minExperience: '',
    sortByDate: 'desc' // 'desc' = recientes primero, 'asc' = antiguos primero
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener roles únicos para el dropdown
  const uniqueRoles = useMemo(() => {
    const roles = [...new Set(candidatesData.map(c => c.role))];
    return roles.sort();
  }, []);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Lógica de filtrado usando useMemo para optimización
  const filteredCandidates = useMemo(() => {
    let result = [...candidatesData];

    // Filtrar por rol
    if (filters.role) {
      result = result.filter(c => c.role === filters.role);
    }

    // Filtrar por migrante
    if (filters.isMigrant !== null) {
      result = result.filter(c => c.isMigrant === filters.isMigrant);
    }

    // Filtrar por RFC
    if (filters.hasRFC !== null) {
      result = result.filter(c => c.hasRFC === filters.hasRFC);
    }

    // Filtrar por experiencia mínima
    if (filters.minExperience !== '') {
      const minExp = parseInt(filters.minExperience);
      result = result.filter(c => c.experienceYears >= minExp);
    }

    // Filtrar por búsqueda de texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.email.toLowerCase().includes(term)
      );
    }

    // Ordenar por fecha
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return filters.sortByDate === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [filters, searchTerm]);

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters({
      role: '',
      isMigrant: null,
      hasRFC: null,
      minExperience: '',
      sortByDate: 'desc'
    });
    setSearchTerm('');
  };

  // Función para actualizar filtros
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema de Candidatos</h1>
                <p className="text-sm text-gray-600">Intrare - Gestión de Talento</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span className="font-medium">{filteredCandidates.length}</span>
              <span>de {candidatesData.length} candidatos</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Panel de Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpiar filtros
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Filtro por Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <select
                value={filters.role}
                onChange={(e) => updateFilter('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los roles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Experiencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experiencia mínima (años)
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={filters.minExperience}
                onChange={(e) => updateFilter('minExperience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por RFC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RFC
              </label>
              <select
                value={filters.hasRFC === null ? '' : filters.hasRFC.toString()}
                onChange={(e) => updateFilter('hasRFC', e.target.value === '' ? null : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="true">Con RFC</option>
                <option value="false">Sin RFC</option>
              </select>
            </div>

            {/* Filtro por Migrante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estatus migratorio
              </label>
              <select
                value={filters.isMigrant === null ? '' : filters.isMigrant.toString()}
                onChange={(e) => updateFilter('isMigrant', e.target.value === '' ? null : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="true">Migrante</option>
                <option value="false">No migrante</option>
              </select>
            </div>

            {/* Ordenar por Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por fecha
              </label>
              <select
                value={filters.sortByDate}
                onChange={(e) => updateFilter('sortByDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Más recientes primero</option>
                <option value="asc">Más antiguos primero</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Candidatos */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando candidatos...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron candidatos</h3>
            <p className="text-gray-600">Intenta ajustar los filtros para ver más resultados</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experiencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RFC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Migrante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de registro
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                          <div className="text-sm text-gray-500">{candidate.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {candidate.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Award className="w-4 h-4 text-gray-400" />
                          {candidate.experienceYears} {candidate.experienceYears === 1 ? 'año' : 'años'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {candidate.hasRFC ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            <FileText className="w-3 h-3" />
                            Sí
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {candidate.isMigrant ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            <Globe className="w-3 h-3" />
                            Sí
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(candidate.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}