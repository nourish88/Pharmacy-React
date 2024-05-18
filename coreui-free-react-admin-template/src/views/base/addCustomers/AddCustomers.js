import React from 'react'

import { ToastContainer, toast } from 'react-toastify'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CButton,
} from '@coreui/react'
import 'react-toastify/dist/ReactToastify.css'
import { IMaskMixin } from 'react-imask'

const Accordion = () => {
  const notify = (message, status) => {
    if (status === 1) toast.info(' 😊' + message)
    if (status === 2) toast(' ⚠️' + message)
    if (status === 3) toast(' 😡' + message)
  }

  const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
    <CFormInput {...props} ref={inputRef} />
  ))
  const handleSubmit = (event) => {
    const form = event.currentTarget
    console.log(event.target['inputName'].value)
    const formData = {
      name: event.target['inputName'].value,
      surName: event.target['inputSurName'].value,
      phoneNumber: event.target['inputPhone'].value,
      email: event.target['inputEmail'].value,
      address: event.target['inputAddress'].value,
    }
    event.preventDefault()

    console.log(JSON.stringify(formData))

    fetch('http://localhost:5422/customers', {
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
        console.log('Success:', data)
        notify('İşlem Başarılı', 1)
      })
      .catch((error) => {
        console.error('Error:', error.message)
        notify(error.message, 3)
      })
  }
  return (
    <>
      {' '}
      <CRow>
        <CCol xl={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Müşteri Ekleme Formu</strong>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" validated={true} onSubmit={handleSubmit}>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="inputName"
                    label="Ad"
                    required
                    feedbackInvalid="Müşteri adını giriniz."
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="inputSurName"
                    label="Soyad"
                    required
                    feedbackInvalid="Müşteri soyadını giriniz."
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput type="email" id="inputEmail" label="Email" />
                </CCol>
                <CCol md={6}>
                  <CFormInputWithMask mask="(500)000-00-00" id="inputPhone" label="Telefon" />
                </CCol>
                <CCol md={12}>
                  <CFormInput type="text" id="inputAddress" label="Adres" />
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
      <ToastContainer />
    </>
  )
}

export default Accordion
