import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

export function useAuthContext_v2() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
