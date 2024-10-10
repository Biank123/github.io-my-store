import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Ecommercee, ProductDetailWrapper } from './Mis-componentes/Ecommercee'; 
import './App.css';

// Componente CartModal básico
const CartModal = ({ cart, onClose, removeFromCart, increaseQuantity, decreaseQuantity }) => {
  return (
    <div className="cart-modal">
      <h2>Carrito de Compras 🛒</h2>
      {cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        cart.map(product => (
          <div key={product.id}>
            <p>
              {product.title} - Cantidad: {product.quantity}
            </p>
            <button onClick={() => increaseQuantity(product.id)}>Aumentar</button>
            <button onClick={() => decreaseQuantity(product.id)}>Disminuir</button>
            <button onClick={() => removeFromCart(product.id)}>Eliminar</button>
          </div>
        ))
      )}
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setCartOpen] = useState(false); // Estado para el carrito
  const [searchTerm, setSearchTerm] = useState('');

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        // Si el producto ya existe, aumenta la cantidad
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 0) + 1 } // Asegúrate de inicializar correctamente quantity
            : item
        );
      } else {
        // Si no existe, lo añade con quantity inicializada en 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      return prevCart
        .map(item => 
          item.id === productId && item.quantity > 1 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        )
        .filter(item => item.quantity > 0);
    });
  };

  const handleCheckout = () => {
    console.log('Procediendo al checkout con los siguientes productos:', cart);
  };

  const toggleCart = () => {
    setCartOpen(!isCartOpen); // Cambia el estado de isCartOpen
  };

  return (
    <Router basename="">
      <div>
        <header className="header">
        <Link to="/my-store" style={{ textDecoration: 'none', color: 'inherit' }}> {/* Enlace a Ecommercee */}
        <h1 style={{ lineHeight: '1' }}>My Store</h1>
      </Link>
          <div className="header-right">
          
 
  
    <button onClick={toggleCart} class="cart-button">
    {console.log(cart)}
    <span className="cart-icon">🛒</span> Carrito ({cart.reduce((total, item) => total + (item.quantity || 0), 0)})
    </button>
          </div>
        </header>

        <Routes>
          <Route 
            path="/my-store" 
            element={<Ecommercee addToCart={addToCart} cart={cart} searchTerm={searchTerm} />} 
          />
          <Route 
            path="/my-store/product/:id" 
            element={<ProductDetailWrapper addToCart={addToCart} cart={cart} />} 
          />
        </Routes>

        {/* Renderiza el modal del carrito */}
        {isCartOpen && (
          <CartModal 
            cart={cart} 
            onClose={toggleCart} 
            removeFromCart={removeFromCart} 
            increaseQuantity={increaseQuantity} 
            decreaseQuantity={decreaseQuantity} 
          />
        )}
      </div>
    </Router>
  );
}

export default App;