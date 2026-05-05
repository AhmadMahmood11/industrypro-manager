create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop table if exists audit_logs cascade;
drop table if exists payroll cascade;
drop table if exists attendance cascade;
drop table if exists stock_movements cascade;
drop table if exists products cascade;
drop table if exists suppliers cascade;
drop table if exists transactions cascade;
drop table if exists categories cascade;
drop table if exists business_settings cascade;
drop table if exists users cascade;

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null check (role in ('admin','manager','employee')) default 'employee',
  status text not null check (status in ('active','inactive')) default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table business_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default 'IndustryPro Manager',
  currency text not null default 'USD',
  business_address text default '',
  low_stock_alert boolean not null default true,
  admin_name text default '',
  admin_email text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('income','expense','product')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(name, type)
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income','expense')),
  category text not null,
  amount numeric(12,2) not null check (amount >= 0),
  transaction_date date not null,
  payment_method text default 'Cash',
  notes text default '',
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text unique not null,
  category text not null,
  unit text not null default 'pcs',
  purchase_price numeric(12,2) not null default 0,
  selling_price numeric(12,2) not null default 0,
  quantity numeric(12,2) not null default 0,
  minimum_stock_level numeric(12,2) not null default 0,
  supplier text default '',
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  movement_type text not null check (movement_type in ('stock_in','stock_out','adjustment')),
  quantity numeric(12,2) not null,
  previous_quantity numeric(12,2) not null,
  new_quantity numeric(12,2) not null,
  note text default '',
  movement_date date not null default current_date,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  department text,
  designation text,
  joining_date date not null,
  salary_type text not null check (salary_type in ('monthly','daily','hourly')),
  salary_amount numeric(12,2) not null default 0,
  status text not null check (status in ('active','inactive')) default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references employees(id) on delete cascade,
  attendance_date date not null,
  status text not null check (status in ('present','absent','late','half_day','leave')),
  overtime_hours numeric(8,2) not null default 0,
  check_in_time time,
  check_out_time time,
  notes text default '',
  marked_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(employee_id, attendance_date)
);

create table payroll (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references employees(id) on delete cascade,
  payroll_month text not null,
  basic_salary numeric(12,2) not null default 0,
  absent_days integer not null default 0,
  overtime_hours numeric(8,2) not null default 0,
  overtime_amount numeric(12,2) not null default 0,
  bonus numeric(12,2) not null default 0,
  deductions numeric(12,2) not null default 0,
  net_salary numeric(12,2) not null default 0,
  status text not null check (status in ('paid','unpaid')) default 'unpaid',
  paid_at timestamptz,
  notes text default '',
  generated_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(employee_id, payroll_month)
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  action text not null,
  table_name text,
  record_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_transactions_date on transactions(transaction_date);
create index idx_transactions_type on transactions(type);
create index idx_products_sku on products(sku);
create index idx_stock_movements_product on stock_movements(product_id);
create index idx_attendance_employee_date on attendance(employee_id, attendance_date);
create index idx_payroll_employee_month on payroll(employee_id, payroll_month);

create trigger users_updated_at before update on users for each row execute function set_updated_at();
create trigger business_settings_updated_at before update on business_settings for each row execute function set_updated_at();
create trigger categories_updated_at before update on categories for each row execute function set_updated_at();
create trigger transactions_updated_at before update on transactions for each row execute function set_updated_at();
create trigger suppliers_updated_at before update on suppliers for each row execute function set_updated_at();
create trigger products_updated_at before update on products for each row execute function set_updated_at();
create trigger stock_movements_updated_at before update on stock_movements for each row execute function set_updated_at();
create trigger employees_updated_at before update on employees for each row execute function set_updated_at();
create trigger attendance_updated_at before update on attendance for each row execute function set_updated_at();
create trigger payroll_updated_at before update on payroll for each row execute function set_updated_at();
create trigger audit_logs_updated_at before update on audit_logs for each row execute function set_updated_at();
