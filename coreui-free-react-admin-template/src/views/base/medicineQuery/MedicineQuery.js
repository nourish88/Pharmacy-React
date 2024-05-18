import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import { BlockUI } from 'primereact/blockui'
import { Button } from 'primereact/button'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import 'primeicons/primeicons.css'
const MedicineQuery = () => {
  const [loading, setLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const [medicines, setMedicines] = useState(null)
  const [selected, setSelected] = useState(null)
  console.log(selected)
  const notify = (message, status) => {
    if (status === 1) toast.info(' 😊' + message)
    if (status === 2) toast(' ⚠️' + message)
    if (status === 3) toast(' 😡' + message)
  }
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 5,
    page: 0,
    sortField: null,
    sortOrder: null,
    filters: {
      name: { value: '', matchMode: 'contains' },
      groupName: { value: '', matchMode: 'contains' },
      id: { value: '', matchMode: 'contains' },
    },
  })
  useEffect(() => {
    loadLazyData()
  }, [lazyState])
  const loadLazyData = () => {
    setLoading(true)
    debugger
    console.log(lazyState)
    let name = lazyState.filters['name']?.value

    if (name === '') name = 'null'
    let groupName = lazyState.filters['groupName']?.value
    if (groupName === '') groupName = 'null'
    let page = lazyState.page
    if (page === undefined) page = 0
    fetch(`http://localhost:5422/medicines/${name}/${groupName}/${page}/${lazyState.rows}`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        console.log(data)
        setTotalRecords(data.totalRecords)
        setMedicines(data.medicines)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setLoading(false)
      })
  }
  const onPage = (event) => {
    console.log(event)
    setlazyState(event)
  }

  const onSort = (event) => {
    setlazyState(event)
  }

  const onFilter = (event) => {
    console.log(event)
    setlazyState(event)
  }

  const accept = () => {
    fetch('http://localhost:5422/medicines', {
      method: 'DELETE',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: selected?.id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        console.log(data)
        toast.info(' 😊' + 'İşlem Başarılı')
        loadLazyData()
      })
      .catch((error) => console.error('There was a problem with the fetch operation:', error))
  }
  const reject = () => {
    console.log('reject')
    notify('Reddedildi', 2)
  }
  const confirm = async (event) => {
    console.log(event)

    confirmPopup({
      target: event.currentTarget,
      message: 'Kaydı silmek istediğinizden emin misiniz?',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      accept,
      reject,
    })
  }
  const bodyTemplate = (e) => {
    setSelected(e)
    return (
      <Button
        onClick={() => confirm(e)}
        icon="pi pi-times"
        label="Sil"
        className="p-button-danger"
      ></Button>
    )
  }
  return (
    <>
      <ToastContainer />
      <ConfirmPopup />
      <BlockUI blocked={loading} fullScreen>
        <CRow>
          <CCol xl={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>İlaçlar</strong>
              </CCardHeader>
              <CCardBody>
                <DataTable
                  showGridlines
                  value={medicines}
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
                  stripedRows
                  tableStyle={{ minWidth: '50rem' }}
                >
                  <Column id="id" field="id" header="Id" sortable />
                  <Column
                    field="name"
                    sortable
                    header="Ad"
                    filterField="name"
                    filter
                    filterPlaceholder="Ara"
                  />

                  <Column
                    filterPlaceholder="Ara"
                    filterField="groupName"
                    field="groupName"
                    sortable
                    filter
                    header="Grup"
                  />
                  <Column body={bodyTemplate} header="İşlem" />
                </DataTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </BlockUI>
    </>
  )
}

export default MedicineQuery
