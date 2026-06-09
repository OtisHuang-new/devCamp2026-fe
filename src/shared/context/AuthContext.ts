import { createContext } from 'react';
import type { AuthContextType } from './types/contextTypes';

// cục wifi
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
