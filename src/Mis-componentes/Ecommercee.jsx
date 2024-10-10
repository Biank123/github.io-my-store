import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Ecommercee.css';

const Ecommercee = ({ addToCart, cart }) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) throw new Error('Network response was not ok');
        const json = await res.json();
        setItems(json);
      } catch (error) {
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items
    .filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === '' || item.category === categoryFilter)
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      if (sortOrder === 'desc') return b.price - a.price;
      return 0;
    });

  const toggleCart = () => {
    setCartOpen(!isCartOpen);
  };

  return (
    <div>
      <div className="header">
  <input
    type="text"
    placeholder="Buscar productos..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
 
</div>

      <div className="filter-buttons">
        <button onClick={() => setCategoryFilter('')}>Todos</button>
        <button onClick={() => setCategoryFilter('electronics')}>Electrónica</button>
        <button onClick={() => setCategoryFilter('jewelery')}>Joyería</button>
        <button onClick={() => setCategoryFilter("men's clothing")}>Ropa de Hombre</button>
        <button onClick={() => setCategoryFilter("women's clothing")}>Ropa de Mujer</button>
      </div>

      <div className="sort-buttons">
        <button onClick={() => setSortOrder('asc')}>Ordenar por precio: Menor a Mayor</button>
        <button onClick={() => setSortOrder('desc')}>Ordenar por precio: Mayor a Menor</button>
      </div>

      {/* Loading/Error Handling */}
      {loading && <p>Cargando productos...</p>}
      {error && <p>{error}</p>}

      <div className="store-container">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <Link key={item.id} to={`/product/${item.id}`} className="product-card">
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
              <p><strong>Precio:</strong> ${item.price}</p>
            </Link>
          ))
        ) : (
          <p>No se encontraron artículos...</p>
        )}
      </div>

      {/* Cart Modal Rendering */}
      {isCartOpen && (
        <div className="cart-modal">
          <h2>Carrito de Compras</h2>
          {cart.length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            cart.map(product => (
              <div key={product.id}>
                <p>{product.title} - Cantidad: {product.quantity}</p>
                
              </div>
            ))
          )}
          <button onClick={toggleCart}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

const ProductDetail = ({ productId, addToCart }) => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then(res => res.json())
      .then(json => setProduct(json))
      .catch(error => console.error('Error fetching product:', error));
  }, [productId]);

  if (!product) {
    return <p>Cargando producto...</p>;
  }

  const handleAddToCart = () => {
    const productWithQuantity = { ...product, quantity };
    addToCart(productWithQuantity);
  };

  return (
    <div className="product-detail-container">
      <div className="product-image">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-info">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p>Precio: ${product.price}</p>
        <button onClick={() => addToCart(product)}>Agregar al carrito</button>
      </div>
    </div>
  );
};

const ProductDetailWrapper = ({ addToCart, cart, removeFromCart, increaseQuantity, decreaseQuantity, handleCheckout }) => {
  const { id } = useParams();
  return (
    <ProductDetail
      productId={id}
      addToCart={addToCart}
      cart={cart}
      removeFromCart={removeFromCart}
      increaseQuantity={increaseQuantity}
      decreaseQuantity={decreaseQuantity}
      handleCheckout={handleCheckout}
    />
  );
};

export { Ecommercee, ProductDetailWrapper };