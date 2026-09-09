import { Plus } from 'lucide-react';
import { formatZmw } from '../utils/currency.js';
export default function ProductCard({ product, onAdd }) { return <button className="product" onClick={() => onAdd(product)} disabled={!product.quantity}><span className="tag">{product.category}</span><h3>{product.name}</h3><footer><span className="price">{formatZmw(product.price)}</span><span className={product.quantity <= product.reorder_level ? 'low' : 'stock'}>{product.quantity} left <Plus size={14} style={{verticalAlign:'-3px'}}/></span></footer></button>; }
