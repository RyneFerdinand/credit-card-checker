import axios from 'axios';
import { useState } from 'react';
import './PaymentPage.css';

const API = 'http://localhost:8080/payment';

const PaymentPage = () => {
  const [pan, setPan] = useState('');
  const [cvv, setCvv] = useState('');
  const [expDate, setExpDate] = useState('');
  const [status, setStatus] = useState('');

  const checkNumerical = (num) => {
    const length = num.length;

    for (let i = 0; i < length; i++) {
      if (num[i] < '0' || num[i] > '9') {
        return false;
      }
    }
    return true;
  };

  const checkExpDate = (num) => {
    const length = num.length;

    if (length > 5) {
      return false;
    }

    for (let i = 0; i < length; i++) {
      if (i < 2 || i > 2) {
        if (num[i] < '0' || num[i] > '9') {
          return false;
        }
      } else if (i == 2) {
        if (num[i] != '/') {
          return false;
        }
      }
    }

    return true;
  };

  const updatePan = (e) => {
    const num = e.target.value;
    if (checkNumerical(num)) {
      setPan(num);
    }
  };

  const updateCvvNumber = (e) => {
    const num = e.target.value;
    if (checkNumerical(num)) {
      setCvv(num);
    }
  };

  const updateExpDate = (e) => {
    const date = e.target.value;
    if (checkExpDate(date)) {
      setExpDate(date);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const body = {
      pan,
      cvv,
      expDate,
    };

    try {
      const response = await axios.post(API, body);
      const data = response.data;

      console.log(data);
      if (data.success) {
        setStatus('Success');
      } else {
        setStatus(data.error);
      }
    } catch (error) {
      setStatus('Something went wrong with the server');
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler} className='form-container'>
        <h1 className='title-heading'>Payment Method</h1>
        <div className='col'>
          <label className='input-label' htmlFor='PAN'>
            PAN
          </label>
          <input
            type='text'
            placeholder='PAN'
            name='PAN'
            id='PAN'
            className='input-field'
            value={pan}
            onChange={updatePan}
          />
        </div>
        <div className='row'>
          <div className='col'>
            <label className='input-label' htmlFor='PAN'>
              CVV
            </label>
            <input
              type='text'
              placeholder='CVV'
              name='CVV'
              id='CVV'
              className='input-field'
              value={cvv}
              onChange={updateCvvNumber}
            />
          </div>
          <div className='col'>
            <label className='input-label' htmlFor='PAN'>
              Expire Date
            </label>
            <input
              type='text'
              placeholder='mm/yy'
              name='expDate'
              id='expDate'
              className='input-field'
              value={expDate}
              onChange={updateExpDate}
            />
          </div>
        </div>
        <p
          className={`status-label ${
            status === 'Success' ? 'color-green' : 'color-red'
          }`}
        >
          Status: {status}
        </p>
        <button className='submit-btn'>Check</button>
      </form>
    </div>
  );
};

export default PaymentPage;
