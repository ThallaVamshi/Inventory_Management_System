import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';

import { ProductList } from './features/products/product-list/product-list';
import { ProductForm } from './features/products/product-form/product-form';
import { EditProduct } from './features/products/edit-product/edit-product';

import { SupplierList } from './features/suppliers/supplier-list/supplier-list';
import { SupplierForm } from './features/suppliers/supplier-form/supplier-form';

import { StockIn } from './features/stock/stock-in/stock-in';
import { StockOut } from './features/stock/stock-out/stock-out';
import { StockHistory } from './features/stock/stock-history/stock-history';

import { OrderList } from './features/orders/order-list/order-list';
import { OrderForm } from './features/orders/order-form/order-form';

import { Reports } from './features/reports/reports/reports';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: 'products',
    component: ProductList,
    canActivate: [authGuard]
  },
  {
    path: 'products/add',
    component: ProductForm,
    canActivate: [authGuard]
  },
  {
    path: 'products/edit/:id',
    component: EditProduct,
    canActivate: [authGuard]
  },
  {
    path: 'suppliers',
    component: SupplierList,
    canActivate: [authGuard]
  },
  {
    path: 'suppliers/add',
    component: SupplierForm,
    canActivate: [authGuard]
  },
  {
    path: 'suppliers/edit/:id',
    component: SupplierForm,
    canActivate: [authGuard]
  },
  {
    path: 'stock/in',
    component: StockIn,
    canActivate: [authGuard]
  },
  {
    path: 'stock/out',
    component: StockOut,
    canActivate: [authGuard]
  },
  {
    path: 'stock/history',
    component: StockHistory,
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    component: OrderList,
    canActivate: [authGuard]
  },
  {
    path: 'orders/add',
    component: OrderForm,
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    component: Reports,
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];