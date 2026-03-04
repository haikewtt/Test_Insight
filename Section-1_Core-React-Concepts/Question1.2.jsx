// Fix the following component that has multiple issues:
//
// import React from 'react';
//
// function UserList({ users }) {
//   const [selectedUser, setSelectedUser] = useState();
//
//   return (
//     <div>
//       <h2>Users</h2>
//       {users.map((user) => (
//         <div onClick={() => setSelectedUser(user.id)}>
//           <h3>{user.name}</h3>
//           <p>{user.email}</p>
//         </div>
//       ))}
//
//       {selectedUser && (
//         <div>
//           <h3>Selected: {selectedUser.name}</h3>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState } from 'react';

function UserList({ users }) {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div>
      <h2>Users</h2>
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => setSelectedUser(user)}
          style={{ cursor: 'pointer' }}
        >
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}

      {selectedUser && (
        <div style={{ marginTop: '16px' }}>
          <h3>Selected: {selectedUser.name}</h3>
          <p>{selectedUser.email}</p>
        </div>
      )}
    </div>
  );
}

export default UserList;

