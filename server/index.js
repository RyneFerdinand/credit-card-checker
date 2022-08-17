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

  // split the expire date to get the month and the year

  if (!expDate.includes('/') || expDate.length != 5) {
    error = 'Invalid Expire Date';
  } else {
    const splitExp = expireDate.split('/');

    // get current date
    const currDate = new Date();

    // get current month and year
    const currMonth = currDate.getMonth() + 1;
    const currYear = currDate.getFullYear();

    // get the front of the year (yy)
    const yearPrefix = currYear.toString().substring(0, 2);

    // make month and year as integer for future comparison
    const expMonth = parseInt(splitExp[0]);
    // make year to yyxx format
    const expYear = parseInt(yearPrefix + splitExp[1]);

    // check if the PAN is american express
    const isAmericanExpress = PAN.startsWith('34') || PAN.startsWith('37');

    // get PAN length
    const panLength = PAN.length;

    // if the date is not after the current date
    if (expYear < currYear || (expYear == currYear && expMonth <= currMonth)) {
      error = 'Credit Card is Expired';
      // if the CVV length is valid
    } else if (
      !(CVV.length == 4 && isAmericanExpress) &&
      !(CVV.length == 3 && !isAmericanExpress)
    ) {
      error = 'Invalid CVV';
      // if the PAN length is valid
    } else if (panLength < 16 || panLength > 19) {
      error = 'PAN Length Must be between 16 and 19';
      // if it's not valid in the case of luhn's algorithm
    } else if (!luhnAlgorithm(PAN)) {
      error = 'Invalid PAN Number';
    }
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
