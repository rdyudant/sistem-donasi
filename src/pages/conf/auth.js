import { url } from './baseurl.js';

export async function checkLogin() {
  const token = localStorage.getItem('token');

  if (!token) {
    return { success: false, message: 'Token tidak ditemukan' };
  }

  try {
    const response = await fetch(`${ url }/auth/cek-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      return { success: false, message: 'Token tidak valid' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Gagal cek login:', error);
    return { success: false, message: 'Terjadi kesalahan jaringan' };
  }
}
