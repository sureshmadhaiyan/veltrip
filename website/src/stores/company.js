import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getCompanyBySubdomain, getCompanyByDomain, getCompanyById } from '../api/company';
import { getDefaultTheme, applyTheme } from '../utils/themeColors';

export const useCompanyStore = defineStore('company', () => {
  const company = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const theme = computed(() => {
    if (!company.value?.theme) {
      // Default taxi yellow and green theme
      return getDefaultTheme();
    }
    const companyTheme = typeof company.value.theme === 'string'
      ? JSON.parse(company.value.theme)
      : company.value.theme;
    
    // Merge with defaults to ensure all properties exist
    return {
      ...getDefaultTheme(),
      ...companyTheme,
    };
  });

  const companyName = computed(() => company.value?.name || 'Veltrip');

  const loadCompanyBySubdomain = async (subdomain) => {
    loading.value = true;
    error.value = null;
    try {
      company.value = await getCompanyBySubdomain(subdomain);
      if (!company.value) {
        error.value = 'Company not found';
      }
    } catch (err) {
      error.value = err.message || 'Failed to load company';
    } finally {
      loading.value = false;
    }
  };

  const loadCompanyByDomain = async (domain) => {
    loading.value = true;
    error.value = null;
    try {
      company.value = await getCompanyByDomain(domain);
      if (!company.value) {
        error.value = 'Company not found';
      }
    } catch (err) {
      error.value = err.message || 'Failed to load company';
    } finally {
      loading.value = false;
    }
  };

  const loadCompanyById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      company.value = await getCompanyById(id);
      if (!company.value) {
        error.value = 'Company not found';
      }
    } catch (err) {
      error.value = err.message || 'Failed to load company';
    } finally {
      loading.value = false;
    }
  };

  const detectCompany = async () => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // Check if it's a subdomain (e.g., company.veltrip.com)
    if (parts.length > 2) {
      const subdomain = parts[0];
      await loadCompanyBySubdomain(subdomain);
    } else {
      // Try to load by domain
      await loadCompanyByDomain(hostname);
    }
    
    // Apply theme after company is loaded
    if (theme.value) {
      applyTheme(theme.value);
    }
  };

  return {
    company,
    theme,
    companyName,
    loading,
    error,
    loadCompanyBySubdomain,
    loadCompanyByDomain,
    loadCompanyById,
    detectCompany,
  };
});

