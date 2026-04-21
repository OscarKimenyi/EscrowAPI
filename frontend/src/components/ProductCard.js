import React, { useState } from 'react';

function ProductCard({ product, onPurchase }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleBuyClick = () => {
    setShowEmailForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onPurchase(product.id, email);
    setLoading(false);
    setShowEmailForm(false);
    setEmail('');
  };

  const handleCancel = () => {
    setShowEmailForm(false);
    setEmail('');
  };

  return (
    <div className="col-md-6 mb-4">
      <div className="card h-100 shadow-sm">
        <img 
          src={product.image} 
          className="card-img-top" 
          alt={product.name}
          style={{ height: '250px', objectFit: 'cover' }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text text-muted">{product.description}</p>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-primary mb-0">${product.price.toFixed(2)}</h4>
              <span className="badge bg-success">Escrow Protected</span>
            </div>
            
            {!showEmailForm ? (
              <button 
                className="btn btn-primary w-100"
                onClick={handleBuyClick}
              >
                <i className="bi bi-shield-check me-2"></i>
                Buy with Escrow
              </button>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <small className="text-muted">
                    You'll receive escrow payment instructions
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary flex-fill"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : (
                      'Proceed to Escrow'
                    )}
                  </button>
                  <button 
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
