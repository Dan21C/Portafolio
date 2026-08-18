/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authRepository } from '../repositories';
import { setUnauthorizedHandler } from '../api/apiClient';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [status, setStatus] = useState('loading'); const [session, setSession] = useState(null);
  const becomeAnonymous = useCallback(() => { setSession(null); setStatus('anonymous'); }, []);
  const loadCurrentUser = useCallback(async () => { setStatus('loading'); try { const current = await authRepository.getCurrentSession(); setSession(current); setStatus(current?.authenticated ? 'authenticated' : 'anonymous'); return current; } catch { becomeAnonymous(); return null; } }, [becomeAnonymous]);
  useEffect(() => { setUnauthorizedHandler(becomeAnonymous); const task = Promise.resolve().then(loadCurrentUser); void task; return () => setUnauthorizedHandler(undefined); }, [becomeAnonymous, loadCurrentUser]);
  const requestOtp = useCallback((request) => authRepository.requestCode(request), []);
  const verifyOtp = useCallback(async (request) => { const current = await authRepository.verifyCode(request); setSession(current); setStatus(current.authenticated ? 'authenticated' : 'anonymous'); return current; }, []);
  const logout = useCallback(async () => { try { await authRepository.logout(); } finally { becomeAnonymous(); } }, [becomeAnonymous]);
  const value = useMemo(() => ({ status, session, user: session ? { id: session.userId, displayName: session.displayName, email: session.email } : null, roles: session?.roles ?? [], permissions: session?.permissions ?? [], requestOtp, verifyOtp, logout, loadCurrentUser, hasPermission: (permission) => session?.permissions?.includes(permission) ?? false }), [status, session, requestOtp, verifyOtp, logout, loadCurrentUser]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export const useAdminAuth = () => { const value = useContext(AdminAuthContext); if (!value) throw new Error('useAdminAuth must be used inside AdminAuthProvider'); return value; };
