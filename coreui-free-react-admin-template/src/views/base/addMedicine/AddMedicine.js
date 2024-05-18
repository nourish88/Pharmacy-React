import React, { useState, useEffect } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CFormSelect } from '@coreui/react'

import { ToastContainer, toast } from 'react-toastify'
import { CForm, CFormInput } from '@coreui/react'
import 'react-toastify/dist/ReactToastify.css'

import { BlockUI } from 'primereact/blockui'
const AddMedicine = () => {
  const [isBlocled, setBlocked] = useState(false)
  const [groups, setGroups] = useState([])
  const notify = (message, status) => {
    if (status === 1) toast.info(' 😊' + message)
    if (status === 2) toast(' ⚠️' + message)
    if (status === 3) toast(' 😡' + message)
  }
  function handleChange(e) {
    alert(e)
    console.log(e)
    if (e.target.value === 'Seçiniz') {
    }
  }
  const handleSubmit = (event) => {
    const groupVal = event.target['inputGrup'].value
    if (groupVal == 'Seçiniz') {
      notify('Grup Seçiniz', 2)
      return false
    }
    const formData = {
      name: event.target['inputName'].value,
      price: event.target['inputGrup'].value,
      groupId: groupVal,
    }
    setBlocked(true)
    event.preventDefault()

    fetch('http://localhost:5422/medicines', {
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
    fetch(`http://localhost:5422/groups/null/0/1000`, {
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
        var x = data.groups.unshift({ value: undefined, label: 'Seçiniz' })
        setGroups(data.groups)
        console.log(data.groups)
        setBlocked(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setBlocked(false)
      })
  }, [])
  return (
    <>
      <BlockUI blocked={isBlocled}>
        <CRow>
          <CCol xl={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>İlaç Ekleme Formu</strong>
              </CCardHeader>
              <CCardBody>
                <CForm className="row g-3" validated={true} onSubmit={handleSubmit}>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      id="inputName"
                      label="Ad"
                      required
                      feedbackInvalid="İlaç adını giriniz."
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormSelect
                      label="Grup"
                      id="inputGrup"
                      aria-label="Default select example"
                      options={groups}
                      onChange={handleChange}
                    />
                  </CCol>

                  <CCol xs={12}>
                    <CButton color="primary" type="submit">
                      Kaydet
                    </CButton>
                  </CCol>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </BlockUI>

      <ToastContainer />
    </>
  )
}

export default AddMedicine
