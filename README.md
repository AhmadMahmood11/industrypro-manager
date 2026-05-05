# IndustryPro Manager

IndustryPro Manager is a complete business and industry management system built for Netlify free testing and Supabase PostgreSQL.

## Features

- Authentication with Admin, Manager, and Employee roles
- Protected routes and role-based access
- Dashboard with real database totals
- Income and expense CRUD
- Stock and inventory CRUD
- Stock in, stock out, and stock adjustment
- Low stock alerts
- Employee CRUD
- Attendance marking and monthly report
- Payroll generation with absent deductions, overtime, bonus, and deductions
- Reports with CSV export
- Business settings
- Netlify Functions backend
- Supabase PostgreSQL database

## Tech Stack

- React + Vite
- Tailwind CSS
- Netlify Functions
- Supabase PostgreSQL
- JWT authentication
- bcrypt password hashing

## Complete Folder Structure

```text
industrypro-manager/
  package.json
  vite.config.js
  tailwind.config.js
  postcss.config.js
  netlify.toml
  .env.example
  index.html
  README.md
  database/
    schema.sql
    seed.sql
  src/
    main.jsx
    App.jsx
    index.css
    lib/
      api.js
      auth.js
      utils.js
      csv.js
    context/
      AuthContext.jsx
    components/
      Layout.jsx
      Sidebar.jsx
      Topbar.jsx
      ProtectedRoute.jsx
      StatCard.jsx
      Modal.jsx
      ConfirmDialog.jsx
    pages/
      Login.jsx
      Register.jsx
      Dashboard.jsx
      IncomeExpenses.jsx
      Stock.jsx
      Employees.jsx
      Attendance.jsx
      Payroll.jsx
      Reports.jsx
      Settings.jsx
      NotFound.jsx
  netlify/
    functions/
      _utils/
        supabase.js
        response.js
        auth.js
      auth-register.js
      auth-login.js
      auth-current-user.js
      dashboard-summary.js
      transactions.js
      products.js
      stock-movements.js
      employees.js
      attendance.js
      payroll.js
      reports.js
      settings.js
```

## 1. Install Locally

```bash
npm install
```

## 2. Create Supabase Project

1. Go to Supabase.
2. Create a new project.
3. Open SQL Editor.
4. Open `database/schema.sql`.
5. Run the full schema.
6. Open `database/seed.sql`.
7. Run the seed data.

Important: seed data creates demo business records, products, transactions, employees, and attendance. It does not create a demo login user because passwords must be hashed. Register your first user from the app. The first registered user automatically becomes Admin.

## 3. Add Environment Variables

Create a local `.env` file from `.env.example`.

```bash
cp .env.example .env
```

Fill these values:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=use_a_long_random_secret
VITE_APP_NAME=IndustryPro Manager
```

Important: never expose the Supabase service role key in frontend code. This project only uses it inside Netlify Functions.

## 4. Test Locally

For normal frontend only:

```bash
npm run dev
```

For frontend plus Netlify Functions:

```bash
npm run netlify:dev
```

Open the local Netlify URL shown in terminal.

## 5. Deploy on Netlify

1. Push this project to GitHub.
2. Go to Netlify.
3. Click Add new site.
4. Import from GitHub.
5. Choose this repository.
6. Netlify should detect:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
7. Add environment variables in Netlify:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `VITE_APP_NAME`
8. Deploy the site.

## 6. Connect Custom Domain Later

When testing is complete:

1. Go to Netlify site settings.
2. Open Domain management.
3. Add your real domain or subdomain.
4. Update DNS records in Hostinger.
5. Keep the same Supabase project and environment variables.

## 7. Testing Checklist

### Authentication
- Register first admin user.
- Logout.
- Login again.
- Try Manager and Employee roles.

### Dashboard
- Confirm totals show income, expenses, profit, stock value, employee count, attendance, and pending payroll.

### Income and Expenses
- Add income.
- Add expense.
- Edit transaction.
- Delete transaction.
- Filter by date and category.
- Export CSV.

### Stock
- Add product.
- Edit product.
- Delete product.
- Stock in.
- Stock out.
- Adjustment.
- Confirm low stock warning.
- Export products and stock history.

### Employees
- Add employee.
- Edit employee.
- Delete employee.

### Attendance
- Mark present.
- Mark absent.
- Mark late.
- Add overtime.
- Review monthly attendance report.
- Delete attendance record.

### Payroll
- Generate salary.
- Check absent deductions.
- Check overtime amount.
- Add bonus.
- Add deductions.
- Mark paid/unpaid.
- View salary slip alert.
- Export CSV.

### Reports
- Generate profit report.
- Generate income report.
- Generate expense report.
- Generate stock report.
- Generate low stock report.
- Generate attendance report.
- Generate payroll report.
- Export CSV.

### Settings
- Update business name.
- Update currency.
- Update address.
- Toggle low stock alert.
- Save admin profile.

## Notes for Production

This is a complete starter system for Netlify and Supabase. Before using for a real company, add:
- Full audit logging for every action
- Supabase Row Level Security policies
- Password reset flow
- Email verification
- Multi-business tenancy if selling as SaaS
- Better payroll rules based on local labor law
- File export as PDF for salary slips
