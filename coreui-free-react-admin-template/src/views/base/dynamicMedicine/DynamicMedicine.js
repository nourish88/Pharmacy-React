import React, { useEffect, useState, useCallback } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { CRow, CCol, CButton } from '@coreui/react'

function DynamicMedicine(props) {
  const [entries, setEntries] = useState([{ name: '', id: null }])
  const [entriess, setEntriess] = useState([{ amount: 1 }])
  const [medicines, setMedicines] = useState([])
  const [disabled, setDisabled] = useState(true)
  const handleAddEntry = () => {
    /* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
    props.handleActiveNess(true)
    // setDisabled(true)
    props.setEntries([...props.entries, { name: '', id: null }])
    props.setEntriess([...props.entriess, { amount: 1 }])
    setEntries([...props.entries, { name: '', id: null }])
    setEntriess([...props.entriess, { amount: 1 }])
  }
  const handleRemoveEntry = () => {
    /* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
    props.handleActiveNess(false)
    // setDisabled(true)
    let newEntries = [...props.entries].slice(0, -1)
    let newEntriess = [...props.entriess].slice(0, -1)
    console.log(newEntries)
    setEntries(newEntries)
    setEntriess(newEntriess)
    props.setEntries(newEntries)
    props.setEntriess(newEntriess)
  }
  console.log(disabled)
  const handleInputChange = (index, field, value) => {
    let newEntries = [...props.entries]
    let newEntriess = [...props.entriess]
    if (field === 'name') {
      newEntries[index]['name'] = value.name
      newEntries[index]['id'] = value.id
    } else newEntriess[index]['amount'] = value
    setEntries(newEntries)
    setEntriess(newEntriess)
    props.setEntries(newEntries)
    props.setEntriess(newEntriess)
  }
  useEffect(() => {
    let active = true

    const last = props.entries[props.entries.length - 1]

    if (!(last.id === null || last.id === undefined)) {
      active = false
    }
    /* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
    props.handleActiveNess(active)
    //setDisabled(active)
  }, [props.entries, props.entriess])
  useEffect(() => {
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
    <div>
      {entries.map((entry, index) => (
        <div style={{ marginBottom: '20px' }} key={index} className="entry">
          <CRow style={{ margin: '15px !important' }}>
            <CCol style={{ width: '100%' }} xs>
              <Dropdown
                value={entry}
                onChange={(e) => handleInputChange(index, 'name', e.target?.value)}
                style={{ width: '100%' }}
                options={medicines}
                optionLabel="name"
                className="w-full md:w-14rem"
              />
            </CCol>

            <CCol xs>
              <InputText
                style={{ width: '100%' }}
                placeholder="Miktar Giriniz..."
                value={entriess[index]?.amount}
                onChange={(e) => handleInputChange(index, 'amount', e.target?.value)}
                useGrouping={false}
              />
            </CCol>
          </CRow>
        </div>
      ))}
      <div className="row justify-content-md-right">
        <CCol style={{ marginTop: '20px', float: 'right' }} xs={12}>
          <CButton
            style={{ float: 'right' }}
            disabled={props.disabled}
            onClick={handleAddEntry}
            color="primary"
            type="submit"
          >
            Yeni Ekle
          </CButton>
          <CButton
            style={{ marginRight: '10px', float: 'right' }}
            onClick={handleRemoveEntry}
            disabled={props.entries.length < 2}
            color="danger"
            type="button"
          >
            Çıkar
          </CButton>
        </CCol>
      </div>
    </div>
  )
}

export default DynamicMedicine
