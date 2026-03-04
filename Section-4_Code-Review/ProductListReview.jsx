// Section 4: Code Review
// Review the following component and provide feedback:
//
// function ProductList() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('');
//
//   useEffect(() => {
//     fetch('/api/products')
//       .then((res) => res.json())
//       .then((data) => {
//         setProducts(data);
//         setLoading(false);
//       });
//   }, []);
//
//   const filteredProducts = products.filter((p) =>
//     p.name.toLowerCase().includes(filter.toLowerCase())
//   );
//
//   return (
//     <div>
//       <input
//         value={filter}
//         onChange={(e) => setFilter(e.target.value)}
//         placeholder="Search products..."
//       />
//
//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <div>
//           {filteredProducts.map((product) => (
//             <div
//               style={{
//                 border: '1px solid #ccc',
//                 margin: '10px',
//                 padding: '10px'
//               }}
//             >
//               <h3>{product.name}</h3>
//               <p>${product.price}</p>
//               <img src={product.image} style={{ width: '100px' }} />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';

// Improved ProductList component with review considerations applied.
export function ProductListImproved({ fetchUrl = '/api/products' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(fetchUrl);

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        if (!isMounted) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load products');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [fetchUrl]);

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search products..."
        style={{ padding: 8, marginBottom: 12, width: '100%', maxWidth: 320 }}
      />

      {loading && <div>Loading products...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {!loading && !error && filteredProducts.length === 0 && (
        <div>No products found.</div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={{
                border: '1px solid #ccc',
                margin: '10px 0',
                padding: '10px',
                borderRadius: 4
              }}
            >
              <h3 style={{ margin: '0 0 4px' }}>{product.name}</h3>
              {product.price != null && (
                <p style={{ margin: '0 0 8px' }}>${product.price}</p>
              )}
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100px', objectFit: 'cover' }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Review feedback + demo usage
export default function ProductListReviewDemo() {
  const mockProducts = [
    {
      id: 1,
      name: 'iPhone 15',
      price: 999,
      image:
        'https://via.placeholder.com/100x100.png?text=Phone'
    },
    {
      id: 2,
      name: 'MacBook Pro',
      price: 1999,
      image:
        'https://via.placeholder.com/100x100.png?text=Laptop'
    },
    {
      id: 3,
      name: 'AirPods',
      price: 199,
      image:
        'https://via.placeholder.com/100x100.png?text=AirPods'
    }
  ];

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Section 4 - ProductList Code Review</h2>

      <h3>Feedback</h3>
      <ul>
        <li>
          <strong>Error handling:</strong> Component gốc không xử lý lỗi fetch
          (network error, non-2xx status) nên UI sẽ kẹt ở trạng thái loading
          nếu có lỗi.
        </li>
        <li>
          <strong>Cleanup / race condition:</strong> Không hủy hoặc guard khi
          unmount, có thể set state trên unmounted component nếu request trả về
          trễ.
        </li>
        <li>
          <strong>Missing key:</strong> Khi render list product không có prop{' '}
          <code>key</code>, dễ gây warning và re-render không tối ưu.
        </li>
        <li>
          <strong>UX:</strong> Không có message khi filter không tìm thấy sản
          phẩm nào; loading text đơn giản, có thể rõ hơn.
        </li>
        <li>
          <strong>Robustness:</strong> Không check field như{' '}
          <code>product.name</code>, <code>product.image</code> có tồn tại
          không; <code>img</code> thiếu <code>alt</code>.
        </li>
      </ul>

      <h3>Improved ProductList (demo với mock data)</h3>
      <p>
        Ở đây để demo, thay vì gọi API thật, ta dùng data mock và bỏ qua phần
        fetch để bạn dễ quan sát UI filter.
      </p>

      <ProductListStaticDemo products={mockProducts} />
    </div>
  );
}

// Simple static version just for UI demo inside this app
function ProductListStaticDemo({ products }) {
  const [filter, setFilter] = useState('');

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ marginTop: 16 }}>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search products..."
        style={{ padding: 8, marginBottom: 12, width: '100%', maxWidth: 320 }}
      />

      {filteredProducts.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <div>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={{
                border: '1px solid #ccc',
                margin: '10px 0',
                padding: '10px',
                borderRadius: 4
              }}
            >
              <h3 style={{ margin: '0 0 4px' }}>{product.name}</h3>
              <p style={{ margin: '0 0 8px' }}>${product.price}</p>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100px', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

