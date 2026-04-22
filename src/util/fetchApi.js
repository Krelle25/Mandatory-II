const BASE_URL = import.meta.env.VITE_BASE_URL;

async function parseResponse(res) {
	const contentType = res.headers.get('content-type') || '';

	if (contentType.includes('application/json')) {
		return await res.json();
	}

	const text = await res.text();
	return {
		message: text || 'Unexpected server response' 
	};
}

export async function login(email, password) {
	const res = await fetch(`${BASE_URL}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({ email, password })
	});

	const data = await parseResponse(res);

	if (!res.ok) {
		throw new Error(data.message || 'Login failed');
	}

	return data;
}

export async function register(username, email, password) {
	const res = await fetch(`${BASE_URL}/auth/signup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({ username, email, password })
	});

	const data = await parseResponse(res);

	if (!res.ok) {
		throw new Error(data.message || 'Signup failed');
	}

	return data;
}

export async function getUser() {
	const res = await fetch(`${BASE_URL}/auth/me`, {
		credentials: 'include'
	});

	const data = await parseResponse(res);

	if (!res.ok) {
		throw new Error(data.message || 'Could not get user');
	}

	return data;
}

export async function logout() {
	const res = await fetch(`${BASE_URL}/auth/logout`, {
		method: 'POST',
		credentials: 'include'
	});

	const data = await parseResponse(res);

	if (!res.ok) {
		throw new Error(data.message || 'Logout failed');
	}

	return data;
}

export async function getAllUsers() {
	const res = await fetch(`${BASE_URL}/auth/users`, {
		method: 'GET',
		credentials: 'include'
	});

	const data = await parseResponse(res);

	if (!res.ok) {
		throw new Error(data.message || 'Could not fetch users');
	}

	return data;
}