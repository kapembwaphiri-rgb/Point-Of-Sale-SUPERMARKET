import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { formatZmw } from '../utils/currency.js';

const productImages = { Staples: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80', Pantry: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80', Bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80', Dairy: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80', Meat: 'https://images.unsplash.com/photo-1588347818036-558601350947?auto=format&fit=crop&w=500&q=80', Produce: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=500&q=80', Beverages: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=500&q=80' };
export default function ProductCard({ product }) {
	const { addToCart } = useCart();
	const [added, setAdded] = useState(false);
	const stock = Number(product.stock_quantity ?? product.quantity ?? 0);
	const handleAdd = () => { addToCart(product); if (stock > 0) { setAdded(true); window.setTimeout(() => setAdded(false), 700); } };
	return <article className="product"><img className="product-image" src={product.image || productImages[product.category]} alt="" /><span className="tag">{product.category}</span><h3>{product.name}</h3><p className={stock ? 'stock' : 'low'}>{stock} items available</p><footer><span className="price">{formatZmw(product.price)}</span><button className={`bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 active:scale-95 transition transform duration-150 ease-in-out product-add ${added ? 'product-add-success' : ''}`} onClick={handleAdd} disabled={!stock} aria-label={`Add ${product.name} to cart`}>{added ? 'Added' : <><Plus size={16} /> Add</>}</button></footer></article>;
}