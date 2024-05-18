import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavGroup,
    name: 'Müşteri',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Ekleme',
        to: '/base/addCustomers',
      },
      {
        component: CNavItem,
        name: 'Sorgulama',
        to: '/base/customers',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Grup',
    to: '/',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Ekleme',
        to: '/base/addGroups',
      },
      {
        component: CNavItem,
        name: 'Sorgulama',
        to: '/base/groups',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'İlaç',
    to: '/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Ekleme',
        to: '/base/addMedicine',
      },
      {
        component: CNavItem,
        name: 'Sorgulama',
        to: '/base/medicineQuery',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Satış',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Tanımlama (İlaç)',
        to: '/base/sales',
      },
      {
        component: CNavItem,
        name: 'Sorgulama (İlaç Satış)',
        to: '/base/salesQuery',
      },
      {
        component: CNavItem,
        name: 'Tanımlama (Grup)',
        to: '/base/salesGroup',
      },
      {
        component: CNavItem,
        name: 'Sorgulama (Grup Satış)',
        to: '/base/salesGroupQuery',
      },
      {
        component: CNavItem,
        name: 'Analiz',
        to: '/forms/select',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Analiz',
    to: '/charts',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
]

export default _nav
