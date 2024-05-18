import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
const Customers = () => {
  const [loading, setLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const [customers, setCustomers] = useState(null)
  const [selectAll, setSelectAll] = useState(false)
  const [selectedCustomers, setSelectedCustomers] = useState(null)
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 15,
    page: 0,
    sortField: null,
    sortOrder: null,
    filters: {
      name: { value: '', matchMode: 'contains' },
      surname: { value: '', matchMode: 'contains' },
      phoneNumber: { value: '', matchMode: 'contains' },
      email: { value: '', matchMode: 'contains' },
      address: { value: '', matchMode: 'contains' },
      id: { value: '', matchMode: 'contains' },
    },
  })
  useEffect(() => {
    loadLazyData()
  }, [lazyState])
  const loadLazyData = () => {
    setLoading(true)
    const name = lazyState.filters['name']?.value ?? ''
    console.log(lazyState.filters['name'].value)
    fetch('http://localhost:5422/get-customers', {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: lazyState.filters['name']?.value ?? '',
        surName: lazyState.filters['surName']?.value ?? '',
        phoneNumber: lazyState.filters['phoneNumber']?.value ?? '',
        email: lazyState.filters['email']?.value ?? '',
        address: lazyState.filters['address']?.value ?? '',

        skip: lazyState.page,
        take: lazyState.rows,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalRecords(data.totalRecords)
        setCustomers(data.customers)
        setLoading(false)
      })
      .catch((error) => console.error('Error:', error))
  }
  const onPage = (event) => {
    console.log(event)
    setlazyState(event)
  }

  const onSort = (event) => {
    setlazyState(event)
  }

  const onFilter = (event) => {
    event['first'] = 0
    setlazyState(event)
  }

  const onSelectionChange = (event) => {
    const value = event.value

    setSelectedCustomers(value)
    setSelectAll(value.length === totalRecords)
  }

  const onSelectAllChange = (event) => {
    const selectAll = event.checked

    if (selectAll) {
      CustomerService.getCustomers().then((data) => {
        setSelectAll(true)
        setSelectedCustomers(data.customers)
      })
    } else {
      setSelectAll(false)
      setSelectedCustomers([])
    }
  }
  return (
    <>
      {' '}
      <CRow>
        <CCol xl={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Müşterilerim</strong>
            </CCardHeader>
            <CCardBody>
              <DataTable
                value={customers}
                lazy
                filterDisplay="row"
                dataKey="id"
                paginator
                first={lazyState.first}
                rows={5}
                totalRecords={totalRecords}
                onPage={onPage}
                onSort={onSort}
                sortField={lazyState.sortField}
                sortOrder={lazyState.sortOrder}
                onFilter={onFilter}
                filters={lazyState.filters}
                loading={loading}
                tableStyle={{ minWidth: '75rem' }}
                selection={selectedCustomers}
                onSelectionChange={onSelectionChange}
                selectAll={selectAll}
                onSelectAllChange={onSelectAllChange}
              >
                <Column field="id" header="Id" sortable />
                <Column field="name" header="Ad" sortable filter filterPlaceholder="Ara" />
                <Column
                  field="surName"
                  sortable
                  header="Soyad"
                  filterField="surName"
                  filter
                  filterPlaceholder="Ara"
                />
                <Column
                  field="phoneNumber"
                  sortable
                  header="Telefon"
                  filterField="phoneNumber"
                  filter
                  filterPlaceholder="Ara"
                />
                <Column
                  field="email"
                  sortable
                  header="E-mail"
                  filterField="email"
                  filter
                  filterPlaceholder="Ara"
                />
                <Column
                  field="address"
                  sortable
                  header="Adres"
                  filterField="address"
                  filter
                  filterPlaceholder="Ara"
                />
              </DataTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Customers
