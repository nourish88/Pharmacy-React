import React, { useEffect, useState } from 'react'
import { BlockUI } from 'primereact/blockui'
import { Calendar } from 'primereact/calendar'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primeflex/themes/primeone-light.css'
import { CRow, CCol, CForm, CButton } from '@coreui/react'
import { Dropdown } from 'primereact/dropdown'
import { Card } from 'primereact/card'
import { addLocale } from 'primereact/api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DynamicGroup from '../dynamicGroup/DynamicGroup'
export default function SalesGroup() {
  const [date, setDate] = useState(null)
  const [blocked, setBlocked] = useState(false)
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [disabled, setDisabled] = useState(true)
  const [enable, setEnabled] = useState(false)
  const [entries, setEntries] = useState([{ name: '', id: null }])
  const [entriess, setEntriess] = useState([{ amount: 1 }])
  function handleActiveNess(e) {
    setDisabled(e)
  }
  function handleEntries(e) {
    setEntries(e)
  }
  function handleEntriess(e) {
    setEntriess(e)
  }
  const notify = (message, status) => {
    if (status === 1) toast.info(' 😊' + message)
    if (status === 2) toast(' ⚠️' + message)
    if (status === 3) toast(' 😡' + message)
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
    debugger
    const customerId = selectedCustomer.id
    const saleGroupCreateDtos = []
    let formData = {}
    for (const [index, num] of entries.entries()) {
      console.log(num)
      const saleGroupCreateDto = {
        amount: entriess[index].amount,
        id: num.id,
      }
      saleGroupCreateDtos.push(saleGroupCreateDto)

      formData = {
        customerId: customerId,
        date: date,
        saleGroupCreateDtos: saleGroupCreateDtos,
      }
    }

    setBlocked(true)
    event.preventDefault()
    console.log(formData)
    fetch('http://localhost:5422/sales-group', {
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
        let status = 1
        if (data.message !== 'İşlem Başarılı') status = 2

        notify(data.message, status)
      })
      .catch((error) => {
        setBlocked(false)
        console.error('Error:', error.message)
        notify(error.message, 3)
      })
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
  }, [])
  console.log(customers)
  useEffect(() => {
    if (disabled === false && selectedCustomer && date) {
      setEnabled(true)
    } else {
      setEnabled(false)
    }
  }, [disabled, selectedCustomer, date])
  console.log(entries)
  console.log(entriess)
  return (
    <>
      {' '}
      <BlockUI
        blocked={blocked}
        template={<i className="pi pi-lock" style={{ fontSize: '3rem' }}></i>}
      >
        <Card title="Satış Tanımlama (Grup)">
          <CForm className="row g-3" validated={true} onSubmit={handleSubmit}>
            <CRow style={{ marginTop: '15px' }}>
              <CCol style={{ width: '100%' }} xs>
                <Dropdown
                  filter
                  style={{ width: '100%' }}
                  value={selectedCustomer}
                  onChange={(e) => {
                    console.log(e.value)
                    setSelectedCustomer(e.value)
                  }}
                  options={customers}
                  optionLabel="name"
                  placeholder="Müşteri Seçiniz..."
                  className="w-full md:w-14rem"
                />
              </CCol>
              <CCol xs>
                <Calendar
                  locale="tr"
                  showIcon
                  style={{ width: '100%' }}
                  placeholder="Satış tarihi giriniz.."
                  value={date}
                  onChange={(e) => setDate(e.value)}
                />
              </CCol>
            </CRow>
            <div style={{ margin: '20px' }}></div>
            <DynamicGroup
              entries={entries}
              setEntries={handleEntries}
              entriess={entriess}
              setEntriess={handleEntriess}
              disabled={disabled}
              handleActiveNess={handleActiveNess}
            ></DynamicGroup>

            <CCol xs={12}>
              <CButton disabled={!enable} color="success" type="submit">
                Satışı Kaydet
              </CButton>
            </CCol>
          </CForm>
        </Card>
      </BlockUI>
      <ToastContainer />
    </>
  )
}
