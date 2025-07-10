import { url } from './baseurl.js';

export async function checkLogin() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${url}/auth/cek-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: token })
  });

  return await response.json();
}
