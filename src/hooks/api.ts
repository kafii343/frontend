import { useState, useEffect } from 'react';
import api from '@/lib/api';

// Hook for fetching mountains
export const useMountains = () => {
  const [mountains, setMountains] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMountains = async () => {
      try {
        setLoading(true);
        const response = await api.get('api/mountains');
        if (response.data.success) {
          setMountains(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch mountains');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching mountains');
      } finally {
        setLoading(false);
      }
    };

    fetchMountains();
  }, []);

  return { mountains, loading, error };
};

// Hook for fetching guides
export const useGuides = () => {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        const response = await api.get('api/guides');
        if (response.data.success) {
          setGuides(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch guides');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching guides');
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  return { guides, loading, error };
};

// Hook for fetching porters
export const usePorters = () => {
  const [porters, setPorters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPorters = async () => {
      try {
        setLoading(true);
        const response = await api.get('api/porters');
        if (response.data.success) {
          setPorters(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch porters');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching porters');
      } finally {
        setLoading(false);
      }
    };

    fetchPorters();
  }, []);

  return { porters, loading, error };
};

// Hook for fetching open trips
export const useOpenTrips = () => {
  const [openTrips, setOpenTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpenTrips = async () => {
      try {
        setLoading(true);
        const response = await api.get('api/open-trips');
        if (response.data.success) {
          setOpenTrips(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch open trips');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching open trips');
      } finally {
        setLoading(false);
      }
    };

    fetchOpenTrips();
  }, []);

  return { openTrips, loading, error };
};

// Hook for fetching user bookings
export const useBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get('api/bookings');
        if (response.data.success) {
          setBookings(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch bookings');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return { bookings, loading, error };
};

// Hook for user authentication
export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, data: response.data.data };
      } else {
        setError(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/auth/register', { username, email, password });
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        setError(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  return { user, loading, error, login, register, logout };
};