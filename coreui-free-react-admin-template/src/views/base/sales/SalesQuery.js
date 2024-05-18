import React, { useEffect, useState } from 'react'
import { BlockUI } from 'primereact/blockui'
import { DataTable } from 'primereact/datatable'
import { Calendar } from 'primereact/calendar'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primeflex/themes/primeone-light.css'
import { CRow, CCol, CForm, CButton, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Dropdown } from 'primereact/dropdown'
import { Card } from 'primereact/card'
import { addLocale } from 'primereact/api'
import { Column } from 'primereact/column'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
export default function SalesQuery() {
  const [date, setDate] = useState(null)
  const [date2, setDate2] = useState(null)
  const [blocked, setBlocked] = useState(false)
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(null)
  const [sales, setSales] = useState([])
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [data, setData] = useState(null)
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 5,
    page: 0,
    sortField: null,
    sortOrder: null,
  })
  function loadData() {
    const customerId = selectedCustomer?.id ?? null
    const medicineId = selectedMedicine?.id ?? null
    const startDate = date ?? null
    const endDate = date2 ?? null

    const formData = {
      startDate: startDate,
      endDate: endDate,
      medicineId: medicineId,
      customerId: customerId,
      skip: lazyState?.page ?? 0,
      take: lazyState?.rows ?? 5,
    }
    setData(formData)
    setBlocked(true)

    console.log(formData)
    fetch('http://localhost:5422/sales-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers here
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            const errorMessage = errorData.title || 'Validation error(s)'
            const validationErrors = errorData.Errors.map(
              (error) => error.Property + ': ' + error.Errors.join(', '),
            )
            notify(errorMessage + ': ' + validationErrors.join('; '), 3)
            throw new Error(errorMessage)
          })
        }
        return response.json()
      })
      .then((data) => {
        console.log(data)
        setBlocked(false)
        setTotalRecords(data.totalCount)
        setSales(data.list)
      })
      .catch((error) => {
        setBlocked(false)

        notify(error.message, 3)
      })
  }

  const notify = (message, status) => {
    if (status === 1) toast.info(' 😊' + message)
    if (status === 2) toast(' ⚠️' + message)
    if (status === 3) toast(' 😡' + message)
  }
  const onPage = (event) => {
    const data2 = data
    data2.skip = event.page
    setData(data2)
    setlazyState(event)
    loadData()
  }

  const onSort = (event) => {
    setlazyState(event)
  }

  addLocale('tr', {
    firstDayOfWeek: 1,
    showMonthAfterYear: true,
    dayNames: ['Pazar', 'Pazartesi ', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    dayNamesShort: ['pzr', 'pts', 'sal', 'çar', 'per', 'cum', 'cts'],
    dayNamesMin: ['Pzr', 'Pts', 'Salı', 'Çarş', 'Perş', 'Cum', 'Cts'],
    monthNames: [
      'Ocak',
      'Şubat',
      'Mart',
      'Nisan',
      'Mayıs',
      'Haziran',
      'Temmuz',
      'Ağustos',
      'Eylül',
      'Ekim',
      'Kasım',
      'Aralık',
    ],
    monthNamesShort: [
      'oca',
      'şub',
      'mar',
      'nis',
      'may',
      'haz',
      'tem',
      'agu',
      'sep',
      'eyl',
      'eki',
      'kas',
    ],
    today: 'Bugün',
    clear: 'Temizle',
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    loadData(
      selectedCustomer,
      selectedMedicine,
      date,
      date2,
      lazyState,

      notify,
      setTotalRecords,
      setSales,
    )
  }

  useEffect(() => {
    fetch('http://localhost:5422/customers', {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setCustomers(data.customers)
      })
      .catch((error) => console.error('Error:', error))

    fetch('http://localhost:5422/medicines', {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setMedicines(data.medicines)
      })
      .catch((error) => console.error('Error:', error))
  }, [])

  return (
    <>
      {' '}
      <BlockUI
        blocked={false}
        template={<i className="pi pi-lock" style={{ fontSize: '3rem' }}></i>}
      >
        <Card title="Satış Sorgulama (İlaç)">
          <CForm className="row g-3" validated={true} onSubmit={handleSubmit}>
            <CRow style={{ marginTop: '15px' }}>
              <CCol style={{ width: '100%' }} xs>
                <Dropdown
                  filter
                  style={{ width: '100%' }}
                  value={selectedCustomer}
                  onChange={(e) => {
                    setSelectedCustomer(e.value)
                  }}
                  options={customers}
                  optionLabel="name"
                  placeholder="Müşteri Seçiniz..."
                  className="w-full md:w-14rem"
                />
              </CCol>
              <CCol style={{ width: '100%' }} xs>
                <Dropdown
                  filter
                  style={{ width: '100%' }}
                  value={selectedMedicine}
                  onChange={(e) => {
                    setSelectedMedicine(e.value)
                  }}
                  options={medicines}
                  optionLabel="name"
                  placeholder="İlaç Seçiniz..."
                  className="w-full md:w-14rem"
                />
              </CCol>
            </CRow>
            <div style={{ marginTop: '20 px' }}>
              <CRow style={{ marginTop: '15px' }}>
                <CCol xs>
                  <Calendar
                    locale="tr"
                    showIcon
                    style={{ width: '100%' }}
                    placeholder="Satış tarihi başlangıcını giriniz.."
                    value={date}
                    onChange={(e) => setDate(e.value)}
                  />
                </CCol>
                <CCol xs>
                  <Calendar
                    locale="tr"
                    showIcon
                    style={{ width: '100%' }}
                    placeholder="Satış tarihi bitşini giriniz.."
                    value={date2}
                    onChange={(e) => setDate2(e.value)}
                  />
                </CCol>
              </CRow>
            </div>
            <CCol xs={12}>
              <CButton color="success" type="submit">
                Sorgula
              </CButton>
            </CCol>
          </CForm>
        </Card>
        {sales?.length > 0 && (
          <Card style={{ marginTop: '20px' }} title="Sorgu Sonucu (İlaç)">
            <DataTable
              showGridlines
              scrollable
              scrollHeight="500px"
              value={sales}
              filterDisplay="row"
              dataKey="id"
              onPage={onPage}
              onSort={onSort}
              //   sortField={lazyState.sortField}
              //   sortOrder={lazyState.sortOrder}

              //   filters={lazyState.filters}
              loading={loading}
              stripedRows
              tableStyle={{ minWidth: '50rem' }}
            >
              <Column id="customerName" field="customerName" header="Müşteri" sortable />
              <Column field="medicineName" sortable header="İlaç Adı" />

              <Column field="amount" sortable header="Miktar" />
            </DataTable>
          </Card>
        )}
      </BlockUI>
      <ToastContainer />
    </>
  )
}
