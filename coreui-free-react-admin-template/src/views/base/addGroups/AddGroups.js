import React, { useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import 'primeicons/primeicons.css'

import { CForm, CFormInput } from '@coreui/react'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify'
import { BlockUI } from 'primereact/blockui'

const AddGroups = () => {
  const [blocked, setBlocked] = useState(false)

  const notify = (message, status) => {
    if (status === 1) toast.info(' 😊' + message)
    if (status === 2) toast(' ⚠️' + message)
    if (status === 3) toast(' 😡' + message)
  }

  const handleSubmit = (event) => {
    const formData = {
      name: event.target['inputName'].value,
    }
    setBlocked(true)
    event.preventDefault()

    fetch('http://localhost:5422/groups', {
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
        if (data.message === 'İşlem Başarılı') notify('İşlem Başarılı', 1)
        else notify(data.message, 2)
      })
      .catch((error) => {
        console.error('Error:', error.message)
        notify(error.message, 3)
      })
      .finally(() => {
        setBlocked(false)
      })
  }

  return (
    <>
      <BlockUI
        blocked={blocked}
        template={<i className="pi pi-lock" style={{ fontSize: '3rem' }}></i>}
      >
        <CRow>
          <CCol xl={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Grup Ekleme Formu</strong>
              </CCardHeader>
              <CCardBody>
                <CForm className="row g-3" validated={true} onSubmit={handleSubmit}>
                  <CCol md={12}>
                    <CFormInput
                      type="text"
                      id="inputName"
                      label="Ad"
                      required
                      feedbackInvalid="Grup adını giriniz."
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

export default AddGroups
