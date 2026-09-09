import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { body, validationResult } from 'express-validator';
import { query, getDb } from './config/database.js';
import { demoUsers, demoProducts, demoSales } from './models/demoData.js';
import { requireAuth, requireRole, errorHandler } from './middleware/auth.js';
import { createPayment } from './models/paymentFactory.js';
dotenv.config({ path: new URL('./.env', import.meta.url) });
const app = express();
app.use(cors()); app.use(express.json());
const demo = process.env.DEMO_MODE === 'true';
const validate = (req, res, next) => { const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg }); next(); };

app.get('/api/health', (req,res) => res.json({ status:'ok', mode: demo ? 'demo' : 'mysql' }));
app.post('/api/auth/login', [body('email').isEmail(), body('password').isLength({ min: 4 })], validate, async (req,res,next) => {
  try {
    const user = demo ? demoUsers.find(item => item.email === req.body.email) : (await query('SELECT id,name,email,password_hash,role FROM users WHERE email=? AND active=1',[req.body.email]))[0][0];
    if (!user || (!demo && !(await bcrypt.compare(req.body.password, user.password_hash))) || (demo && req.body.password !== 'demo123')) return res.status(401).json({ error:'Invalid email or password' });
    const safeUser = { id:user.id, name:user.name, email:user.email, role:user.role }; const token = jwt.sign(safeUser, process.env.JWT_SECRET || 'development-secret', { expiresIn:'8h' });
    res.json({ token, user:safeUser });
  } catch (e) { next(e); }
});
app.get('/api/products', requireAuth, async (req,res,next) => { try { const search = `%${req.query.search || ''}%`; const products = demo ? demoProducts.filter(p => `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes((req.query.search || '').toLowerCase())) : (await query('SELECT p.*,i.quantity,i.reorder_level FROM products p JOIN inventory i ON i.product_id=p.id WHERE p.active=1 AND (p.name LIKE ? OR p.sku LIKE ?)',[search,search]))[0]; res.json({ products }); } catch(e){next(e);} });
app.get('/api/reports/summary', requireAuth, requireRole('MANAGER'), async (req,res,next) => { try { if(demo) return res.json({ totalSales: demoSales.reduce((sum,s)=>sum+s.total,0) || 1248.60, orders: demoSales.length || 37, lowStock: demoProducts.filter(p=>p.quantity<=p.reorder_level).length, topProduct:'Ground Coffee 500g' }); const [rows] = await query("SELECT COALESCE(SUM(total),0) totalSales, COUNT(*) orders FROM sales WHERE status='COMPLETED' AND created_at >= CURDATE()"); const [low] = await query('SELECT COUNT(*) lowStock FROM inventory WHERE quantity<=reorder_level'); res.json({...rows[0], lowStock:low[0].lowStock}); } catch(e){next(e);} });
app.post('/api/sales', requireAuth, [body('items').isArray({min:1}), body('paymentMethod').isIn(['CASH','CARD','MOBILE_MONEY','QR']), body('discountPercent').optional().isFloat({min:0,max:100})], validate, async (req,res,next) => {
  try { const {items,paymentMethod,discountPercent=0,reference} = req.body; let products = demo ? demoProducts : (await query(`SELECT p.*,i.quantity FROM products p JOIN inventory i ON i.product_id=p.id WHERE p.id IN (${items.map(()=>'?').join(',')})`,items.map(i=>i.productId)))[0];
    const normalized = items.map(item => { const p=products.find(product=>product.id===item.productId); if(!p || p.quantity<item.quantity) throw Object.assign(new Error(`Insufficient stock for ${p?.name || 'item'}`),{status:409}); return {...p, quantity:item.quantity, lineTotal:Number(p.price)*item.quantity}; });
    const subtotal=normalized.reduce((sum,p)=>sum+p.lineTotal,0), discount=Number((subtotal*Number(discountPercent)/100).toFixed(2)), tax=Number(normalized.reduce((sum,p)=>sum+(p.lineTotal-discount* p.lineTotal/subtotal)*(Number(p.tax_rate)/100),0).toFixed(2)), total=Number((subtotal-discount+tax).toFixed(2)); const payment=createPayment(paymentMethod,total,reference); const sale={id:uuid(),receiptNumber:`FM-${Date.now().toString().slice(-8)}`,subtotal,discount,total,items:normalized,payment,createdAt:new Date().toISOString()};
    if(demo){ normalized.forEach(item=>{ const p=demoProducts.find(p=>p.id===item.id); p.quantity-=item.quantity; }); demoSales.push(sale); return res.status(201).json({ sale }); }
    const connection=await (await import('./db.js')).getDb().getConnection(); try { await connection.beginTransaction(); await connection.execute('INSERT INTO sales (id,receipt_number,cashier_id,subtotal,discount_total,tax_total,total) VALUES (?,?,?,?,?,?,?)',[sale.id,sale.receiptNumber,req.user.id,subtotal,discount,tax,total]); for(const item of normalized){ await connection.execute('INSERT INTO sale_items (id,sale_id,product_id,quantity,unit_price,line_total) VALUES (?,?,?,?,?,?)',[uuid(),sale.id,item.id,item.quantity,item.price,item.lineTotal]); await connection.execute('UPDATE inventory SET quantity=quantity-? WHERE product_id=?',[item.quantity,item.id]); } await connection.execute('INSERT INTO payments (id,sale_id,method,amount,reference) VALUES (?,?,?,?,?)',[uuid(),sale.id,payment.method,total,payment.reference]); await connection.commit(); res.status(201).json({sale}); } catch(e){ await connection.rollback(); throw e; } finally { connection.release(); }
  } catch(e){next(e);} });
app.post('/api/returns', requireAuth, async (req,res,next)=>{ try { if(!req.body.saleId || !req.body.reason) return res.status(400).json({error:'Sale and reason are required'}); res.status(201).json({ return:{id:uuid(),saleId:req.body.saleId,status:'REFUND_PENDING'} }); } catch(e){next(e);} });
app.use(errorHandler);
const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`FreshMart POS API listening on http://localhost:${port}`));
export default app;
