const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

const luhnAlgorithm = (number) => {
  const numLength = number.length;
  let total = 0;

  for (let i = 0; i < numLength; i++) {
    let currNum = parseInt(number.charAt(numLength - 1 - i));
    if (i % 2 != 0) {
      currNum = currNum * 2;
      currNum = (currNum % 10) + Math.floor(currNum / 10);
    }

    total += currNum;
  }

  return total % 10 == 0;
};

app.post('/payment', (req, res) => {
  // get body value
  const { pan, cvv, expDate } = req.body;

  // trim values
  const PAN = pan.trim();
  const CVV = cvv.trim();
  const expireDate = expDate.trim();

  // declare an error variable
  let error = '';

  // get length
  const panLength = PAN.length;

  // split the expire date to get the month and the year
  const splitExp = expireDate.split('/');

  // make month and year as integer for future comparison
  const expMonth = parseInt(splitExp[0]);
  // make year to 20xx format
  const expYear = parseInt('20' + splitExp[1]);

  // get current date
  const currDate = new Date();
  // get current month and year
  const currMonth = currDate.getMonth() + 1;
  const currYear = currDate.getFullYear();

  // check if the PAN is american express
  const isAmericanExpress = PAN.startsWith('34') || PAN.startsWith('37');

  // if the date is not after the current date
  if (expYear < currYear || (expYear == currYear && expMonth <= currMonth)) {
    error = 'Credit Card is Expired';
    // if the CVV length is valid
  } else if (!(CVV.length == 4 && isAmericanExpress) && CVV.length != 3) {
    error = 'Invalid CVV';
    // if the PAN length is valid
  } else if (panLength < 16 || panLength > 19) {
    error = 'PAN Length Must be between 16 and 19';
    // if it's not valid in the case of luhn's algorithm
  } else if (!luhnAlgorithm(PAN)) {
    error = 'Error Luhn !';
  }

  // if the error is not set, then there's no error
  if (error != '') {
    res.json({ success: false, error });
  } else {
    res.json({ success: true });
  }
});

app.listen(PORT, () => {
  console.log(`server up, listening on port ${PORT}`);
});
