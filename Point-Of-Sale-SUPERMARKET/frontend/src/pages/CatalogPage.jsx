import { useEffect, useState } from 'react';
import { Search, ShoppingCart, WifiOff } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { api, queuedCount } from '../utils/api.js';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [offline, setOffline] = useState(!navigator.onLine);
  const { cart } = useCart();
  useEffect(() => {
    const loadProducts = () => api('/products').then((data) => setProducts(data.products)).catch((err) => setError(err.message));
    loadProducts();
    const online = () => setOffline(false); const offlineHandler = () => setOffline(true);
    const inventoryUpdated = () => loadProducts();
    addEventListener('online', online); addEventListener('offline', offlineHandler); addEventListener('inventory-updated', inventoryUpdated);
    return () => { removeEventListener('online', online); removeEventListener('offline', offlineHandler); removeEventListener('inventory-updated', inventoryUpdated); };
  }, []);
  const filtered = products.filter((product) => `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(search.toLowerCase()));
  return <><div className="header"><div><div className="eyebrow">FreshMart / products</div><h1>Catalog</h1><p className="muted">Choose products to add to the current sale.</p></div><div className="eyebrow"><ShoppingCart size={15} style={{ verticalAlign: '-3px' }} /> {cart.reduce((sum, item) => sum + item.quantity, 0)} in cart</div></div>{offline && <div className="notice"><WifiOff size={15} style={{ verticalAlign: '-3px' }} /> Offline · {queuedCount()} queued sales</div>}{error && <p className="error">{error}</p>}<section className="panel"><div style={{ position: 'relative' }}><Search size={17} style={{ position: 'absolute', top: 13, left: 14, color: '#788' }} /><input className="search" style={{ paddingLeft: 42 }} placeholder="Search product or scan SKU..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search products" /></div><div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div></section></>;
}