import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const handlePurchase = async (productId, email) => {
    try {
      console.log('🛒 Initiating purchase...', { productId, email });
      
      const response = await axios.post('/api/create-escrow', {
        productId,
        buyerEmail: email
      });

      console.log('📦 Response received:', response.data);
      console.log('🔗 Checkout URL:', response.data.checkoutUrl);

      if (response.data.success) {
        showNotification('success', 'Escrow transaction created! Redirecting to payment...');
        
        // Redirect to Escrow.com checkout
        console.log('🚀 Opening checkout URL in new tab...');
        setTimeout(() => {
          if (response.data.checkoutUrl) {
            console.log('Opening:', response.data.checkoutUrl);
            window.open(response.data.checkoutUrl, '_blank');
          } else {
            console.error('❌ No checkout URL in response!');
            showNotification('danger', 'No checkout URL received from server');
          }
        }, 1500);
      }
    } catch (err) {
      console.error('❌ Purchase error:', err);
      const errorMessage = err.response?.data?.error || 'Failed to create escrow transaction';
      showNotification('danger', errorMessage);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            <i className="bi bi-shop me-2"></i>
            Escrow Shop
          </span>
          <span className="badge bg-light text-primary">
            <i className="bi bi-shield-check me-1"></i>
            All Payments Secured by Escrow.com
          </span>
        </div>
      </nav>

      {/* Notification */}
      {notification && (
        <div className="container mt-3">
          <div className={`alert alert-${notification.type} alert-dismissible fade show`} role="alert">
            {notification.message}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setNotification(null)}
            ></button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">Premium Products</h1>
          <p className="lead text-muted">
            Shop with confidence - All transactions protected by Escrow.com
          </p>
        </div>

        {/* Info Banner */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card bg-info bg-opacity-10 border-info">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-info-circle me-2"></i>
                  How Escrow Payment Works
                </h5>
                <div className="row mt-3">
                  <div className="col-md-3">
                    <div className="text-center">
                      <i className="bi bi-1-circle-fill fs-2 text-primary"></i>
                      <p className="mt-2 small">Buyer places order</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <i className="bi bi-2-circle-fill fs-2 text-primary"></i>
                      <p className="mt-2 small">Payment held in escrow</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <i className="bi bi-3-circle-fill fs-2 text-primary"></i>
                      <p className="mt-2 small">Seller ships item</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <i className="bi bi-4-circle-fill fs-2 text-primary"></i>
                      <p className="mt-2 small">Funds released after approval</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="row">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onPurchase={handlePurchase}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white mt-5 py-4">
        <div className="container text-center">
          <p className="mb-0">
            <i className="bi bi-shield-check me-2"></i>
            Secured by <strong>Escrow.com</strong> - The world's most trusted escrow service
          </p>
          <p className="small text-muted mt-2 mb-0">
            Your payment is protected until you confirm receipt of your item
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
