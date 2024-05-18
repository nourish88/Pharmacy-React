import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const AddCustomers = React.lazy(() => import('./views/base/addCustomers/AddCustomers'))
const Customers = React.lazy(() => import('./views/base/customers/Customers'))

const Sales = React.lazy(() => import('./views/base/sales/Sales'))
const SalesQuery = React.lazy(() => import('./views/base/sales/SalesQuery'))
const SalesGroup = React.lazy(() => import('./views/base/sales/SalesGroup'))
const SalesGroupQuery = React.lazy(() => import('./views/base/sales/SalesGroupQuery'))
const AddGroups = React.lazy(() => import('./views/base/addGroups/AddGroups'))

const Groups = React.lazy(() => import('./views/base/groups/Groups'))

const AddMedicine = React.lazy(() => import('./views/base/addMedicine/AddMedicine'))
const MedicineQuery = React.lazy(() => import('./views/base/medicineQuery/MedicineQuery'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },

  { path: '/base/addCustomers', name: 'AddCustomers', element: AddCustomers },
  { path: '/base/customers', name: 'Customers', element: Customers },
  { path: '/base/medicineQuery', name: 'MedicineQuery', element: MedicineQuery },

  { path: '/base/sales', name: 'Sales', element: Sales },
  { path: '/base/salesQuery', name: 'SalesQuery', element: SalesQuery },
  { path: '/base/salesGroup', name: 'SalesGroup', element: SalesGroup },
  { path: '/base/salesGroupQuery', name: 'SalesGroupQuery', element: SalesGroupQuery },
  { path: '/base/addGroups', name: 'AddGroups', element: AddGroups },

  { path: '/base/groups', name: 'Groups', element: Groups },

  { path: '/base/addMedicine', name: 'AddMedicine', element: AddMedicine, exact: true },

  { path: '/forms/range', name: 'Range', element: Range },

  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },

  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
