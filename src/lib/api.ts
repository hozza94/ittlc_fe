// frontend/src/lib/api.ts
export const API_BASE_URL = 'http://localhost:8000/api/v1';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 토큰이 있으면 헤더에 추가
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // 쿠키를 포함한 요청
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'An error occurred');
  }

  // 204 No Content 응답 처리
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}