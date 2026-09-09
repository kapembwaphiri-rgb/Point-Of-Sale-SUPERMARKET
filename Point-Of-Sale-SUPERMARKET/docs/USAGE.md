# POS workflows

## Cashier

1. Sign in with the cashier account. Home is the landing page.
2. Open Catalog to search products and add them to the shared cart.
3. Open Checkout to adjust quantities, enter the customer name, choose a promotion, and select cash, card, mobile money, or QR. Prices and subtotals are displayed in Zambian Kwacha (ZMW).
4. Confirm the purchase. The backend receipt payload is returned and displayed in the receipt summary.
5. Select Download Receipt to generate a PDF containing the store name, cashier, date/time, transaction ID, items, quantities, subtotal, discount, total, and payment method.

## Testing responsive buttons and receipts

1. Start the API and frontend with the normal project commands, then sign in with the demo cashier account.
2. Open Catalog at a desktop and narrow/mobile viewport. Add a product and verify the button briefly changes to green `Added`, while the shared cart quantity updates immediately.
3. Open Checkout and verify the cart item, Kwacha subtotal, quantity controls, and Confirm Purchase button remain usable at the narrow viewport.
4. Enter a customer name, select a payment method, and confirm the purchase. Verify the receipt summary matches the returned transaction response.
5. Click Download Receipt and open the generated PDF to verify the transaction ID, receipt number, cashier, date/time, line items, subtotal, discount, total, and payment method.
5. If the network drops, the sale is held in the browser queue and the checkout screen shows the offline count.
6. Submit a return with the original sale ID and a reason when a refund is requested.

## Manager

1. Sign in with the manager account.
2. Open Overview to see daily sales, transactions, low-stock items, and top product.
3. Open Inventory to scan current quantity, reorder level, category, SKU, and price.
4. Use the report action to print the current summary.

## MySQL verification

After a completed MySQL sale, verify `sales`, `sale_items`, and `payments` contain the receipt and `inventory.quantity` is lower by the purchased quantity. If any write fails, the backend rolls back all writes in that checkout transaction.
