// frontend/src/api/auth.ts
import { apiRequest } from '@/lib/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await fetch('http://localhost:8000/api/v1/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Login failed');
  }

  return response.json();
}

export async function logout(): Promise<void> {
  // 백엔드에서 토큰 무효화 로직이 있다면 호출
  localStorage.removeItem('auth_token');
}

export async function getCurrentUser() {
  return apiRequest('/users/me');
}