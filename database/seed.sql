insert into business_settings (business_name, currency, business_address, low_stock_alert, admin_name, admin_email)
values ('Demo Manufacturing Company', 'USD', 'Industrial Area, Main Road', true, 'Admin User', 'admin@example.com');

insert into categories (name, type) values
('Sales', 'income'),
('Service', 'income'),
('Raw Materials', 'expense'),
('Rent', 'expense'),
('Utilities', 'expense'),
('Finished Goods', 'product'),
('Raw Material', 'product');

insert into suppliers (name, phone, email, address) values
('ABC Supplies', '+1 555 0100', 'sales@abcsupplies.test', 'Supplier Street 1'),
('Metro Wholesale', '+1 555 0200', 'hello@metrowholesale.test', 'Warehouse Road');

insert into products (name, sku, category, unit, purchase_price, selling_price, quantity, minimum_stock_level, supplier)
values
('Steel Sheet', 'STL-001', 'Raw Material', 'sheet', 40, 65, 25, 10, 'ABC Supplies'),
('Finished Box', 'BOX-001', 'Finished Goods', 'pcs', 8, 15, 140, 30, 'Metro Wholesale'),
('Packaging Tape', 'TAPE-001', 'Raw Material', 'roll', 2, 4, 12, 20, 'ABC Supplies');

insert into transactions (type, category, amount, transaction_date, payment_method, notes)
values
('income', 'Sales', 5200, current_date - interval '5 day', 'Bank', 'Bulk product sale'),
('income', 'Service', 850, current_date - interval '2 day', 'Cash', 'Repair service'),
('expense', 'Raw Materials', 1800, current_date - interval '4 day', 'Bank', 'Material purchase'),
('expense', 'Utilities', 420, current_date - interval '1 day', 'Cash', 'Electric bill');

insert into employees (name, phone, email, department, designation, joining_date, salary_type, salary_amount, status)
values
('Ali Khan', '+1 555 1111', 'ali@example.com', 'Production', 'Machine Operator', current_date - interval '180 day', 'monthly', 2800, 'active'),
('Sara Ahmed', '+1 555 2222', 'sara@example.com', 'Accounts', 'Accountant', current_date - interval '120 day', 'monthly', 3200, 'active'),
('John Smith', '+1 555 3333', 'john@example.com', 'Warehouse', 'Stock Manager', current_date - interval '90 day', 'daily', 120, 'active');

insert into attendance (employee_id, attendance_date, status, check_in_time, check_out_time, overtime_hours)
select id, current_date, 'present', '09:00', '17:00', 1 from employees where name in ('Ali Khan','Sara Ahmed');

insert into stock_movements (product_id, movement_type, quantity, previous_quantity, new_quantity, note, movement_date)
select id, 'stock_in', 20, quantity - 20, quantity, 'Opening stock', current_date - interval '3 day' from products where sku='BOX-001';
