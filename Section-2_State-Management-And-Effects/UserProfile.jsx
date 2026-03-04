// Question - Section 2: State Management And Effects
// Create a UserProfile component that:
// - Fetches user data from an API endpoint on mount
// - Shows loading state while fetching
// - Handles and displays errors appropriately
// - Allows editing user name with optimistic updates
// - Cancels the request if component unmounts before completion
// API Endpoint: https://jsonplaceholder.typicode.com/users/1
//
// Sample response:
// {
//   "id": 1,
//   "name": "Leanne Graham",
//   "username": "Bret",
//   "email": "Sincere@april.biz",
//   ...
// }

import React, { useEffect, useState } from 'react';

const API_URL = 'https://jsonplaceholder.typicode.com/users/1';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        setUser(data);
        setNameInput(data.name ?? '');
      } catch (err) {
        if (err.name === 'AbortError') {
          // request was cancelled, do nothing
          return;
        }
        setError(err.message || 'Failed to fetch user');
      } finally {
        // chỉ set loading false nếu request chưa bị abort
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    // cancel request on unmount
    return () => {
      controller.abort();
    };
  }, []);

  const handleNameChange = (e) => {
    setNameInput(e.target.value);
  };

  const handleSaveName = async () => {
    if (!user) return;

    const previousUser = user;
    const newName = nameInput.trim();
    if (!newName) {
      setError('Name cannot be empty');
      return;
    }

    // optimistic update: update UI trước
    setUser({ ...user, name: newName });
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
      });

      if (!res.ok) {
        throw new Error(`Update failed with status ${res.status}`);
      }

      const updated = await res.json();
      // đồng bộ lại với response (nếu khác)
      setUser((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      // rollback nếu lỗi
      setUser(previousUser);
      setError(err.message || 'Failed to update name');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (error && !user) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data.</div>;
  }

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '24px auto',
        padding: 24,
        borderRadius: 8,
        border: '1px solid #ddd',
        fontFamily: 'sans-serif'
      }}
    >
      <h2>User Profile</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: 12 }}>Error: {error}</div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>
          Name (optimistic update):
        </label>
        <input
          type="text"
          value={nameInput}
          onChange={handleNameChange}
          style={{ padding: 8, width: '100%', boxSizing: 'border-box' }}
        />
        <button
          onClick={handleSaveName}
          disabled={saving}
          style={{ marginTop: 8, padding: '6px 12px' }}
        >
          {saving ? 'Saving...' : 'Save name'}
        </button>
      </div>

      <div>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>Website:</strong> {user.website}
        </p>
        <p>
          <strong>Company:</strong> {user.company?.name}
        </p>
        <p>
          <strong>Address:</strong>{' '}
          {user.address
            ? `${user.address.street}, ${user.address.city}, ${user.address.zipcode}`
            : 'N/A'}
        </p>
      </div>
    </div>
  );
}

export default UserProfile;

