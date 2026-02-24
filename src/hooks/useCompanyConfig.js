import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'mindspo_company_config';

const DEFAULT_DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Operations',
  'HR',
  'Finance',
  'Leadership'
];

const getInitialConfig = () => ({
  companyName: 'Your Company',
  departments: DEFAULT_DEPARTMENTS,
  setupComplete: false,
  createdAt: null,
});

export default function useCompanyConfig() {
  const [config, setConfig] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load company config:', e);
    }
    return getInitialConfig();
  });

  // Save to localStorage whenever config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save company config:', e);
    }
  }, [config]);

  const saveConfig = useCallback((companyName, departments) => {
    setConfig({
      companyName,
      departments,
      setupComplete: true,
      createdAt: new Date().toISOString(),
    });
  }, []);

  const updateCompanyName = useCallback((companyName) => {
    setConfig(prev => ({ ...prev, companyName }));
  }, []);

  const addDepartment = useCallback((department) => {
    setConfig(prev => ({
      ...prev,
      departments: [...prev.departments, department]
    }));
  }, []);

  const removeDepartment = useCallback((department) => {
    setConfig(prev => ({
      ...prev,
      departments: prev.departments.filter(d => d !== department)
    }));
  }, []);

  const updateDepartment = useCallback((oldName, newName) => {
    setConfig(prev => ({
      ...prev,
      departments: prev.departments.map(d => d === oldName ? newName : d)
    }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(getInitialConfig());
  }, []);

  return {
    config,
    isSetupComplete: config.setupComplete,
    saveConfig,
    updateCompanyName,
    addDepartment,
    removeDepartment,
    updateDepartment,
    resetConfig,
  };
}
