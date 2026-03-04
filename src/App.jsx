import React from 'react';
import UserProfile from '../Section-2_State-Management-And-Effects/UserProfile.jsx';
import UserList from '../Section-1_Core-React-Concepts/Question1.2.jsx';
import ModalExamples from '../Section-3_Component-Design-And-Props/Modal.jsx';
import ProductListReviewDemo from '../Section-4_Code-Review/ProductListReview.jsx';

const mockUsers = [
  { id: 1, name: 'Alice', email: 'alice@test.com' },
  { id: 2, name: 'Bob', email: 'bob@test.com' },
  { id: 3, name: 'Charlie', email: 'charlie@test.com' }
];

function App() {
  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h1>Insight React Demo</h1>

      <section style={{ marginBottom: 40 }}>
        <h2>Question 1.2 - UserList</h2>
        <p>Click vào 1 user để xem phần Selected bên dưới.</p>
        <UserList users={mockUsers} />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>Section 2 - UserProfile</h2>
        <p>Demo fetch user, loading, error, optimistic update, cancel request.</p>
        <UserProfile />
      </section>

      <section style={{ marginBottom: 40 }}>
        <ModalExamples />
      </section>

      <section>
        <ProductListReviewDemo />
      </section>
    </div>
  );
}

export default App;

