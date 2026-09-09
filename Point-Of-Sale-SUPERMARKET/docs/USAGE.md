# POS workflows

## Cashier

1. Sign in with the cashier account.
2. Search by product name or SKU and select products.
3. Adjust quantities, choose a promotion, and select cash, card, mobile money, or QR. Prices, subtotals, and receipts are displayed in Zambian Kwacha (ZMW).
4. Complete the sale. The receipt payload is returned and can be printed.
5. If the network drops, the sale is held in the browser queue and the checkout screen shows the offline count.
6. Submit a return with the original sale ID and a reason when a refund is requested.

## Manager

1. Sign in with the manager account.
2. Open Overview to see daily sales, transactions, low-stock items, and top product.
3. Open Inventory to scan current quantity, reorder level, category, SKU, and price.
4. Use the report action to print the current summary.

## MySQL verification

After a completed MySQL sale, verify `sales`, `sale_items`, and `payments` contain the receipt and `inventory.quantity` is lower by the purchased quantity. If any write fails, the backend rolls back all writes in that checkout transaction.
