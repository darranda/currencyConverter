const baseCurrency = document.querySelector("#base-currency");
const currencyAmount= document.querySelector("#amount");
const targetCurrency = document.querySelector("#target-currency");
const convertedAmount = document.querySelector("#converted-amount");
const historicalRates = document.querySelector("#historical-rates");
const historicalResults = document.querySelector("#historical-rates-container");
const saveFavButton = document.querySelector("#save-favorite");
const currencyPairs = document.querySelector("#favorite-currency-pairs");

let myHeaders = new Headers();
myHeaders.append("apiKey", "gJg1WKwjD9vdiEM3y6h7IbCXmIaYBx00");

let requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};

//list of currency

fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
  .then((response) => response.json())
  .then((data) => {
    const baseCurrencyList = document.querySelector("#base-currency");
    const targetCurrencyList = document.querySelector("#target-currency");
    for (let symbol in data.symbols) {
      const option = document.createElement("option");
      option.value = symbol;
      option.text = symbol;
      baseCurrencyList.appendChild(option);
      const targetOption = option.cloneNode(true);
      targetCurrencyList.appendChild(targetOption);
    }
  })
  .catch((error) => console.log("error", error));

//convert currency

function convert() {
  const from = baseCurrency.value;
  const to = targetCurrency.value;
  const amount = currencyAmount.value;

  fetch(
    `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      const result = data.result;
      convertedAmount.textContent = `${result.toFixed(2)} ${
        targetCurrency.value
      }`;
      console.log(result);
    })
    .catch((error) => {
      console.log("error", error);
      alert("Oops, please enter a number greater than 1.");
    });
}

[baseCurrency, amountValue, targetCurrency].forEach((input) => {
  input.addEventListener("change", convert);
});

amountValue.addEventListener('input', () => {
  const amount = amountValue.value;
  if (isNaN(amount) || amount < 0) {
    amountValue.value = '';
  }
});

//handle historical 

historicalButton.addEventListener("click", () => {
  const baseCurrency = document.querySelector("#base-currency").value;
  const targetCurrency = document.querySelector("#target-currency").value;
  const date = "2023-02-25";

  fetch(
    `https://api.apilayer.com/exchangerates_data/${date}?symbols=${targetCurrency}&base=${baseCurrency}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      let rates = data.rates;
      let rate = 0;
      for (let currency in rates) {
        if (currency === targetCurrency) {
          rate = rates[currency].toFixed(2);
          break;
        }
      }
      historicalResults.textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
    })
    .catch((error) => console.log("error", error));
});

//favorites saved ?

saveFavButton.addEventListener("click", () => {
  const selectedPair = `${baseCurrency.value}/${targetCurrency.value}`;
  const savedPairs = JSON.parse(localStorage.getItem("savedPairs"));
  savedPairs.push(selectedPair);
  localStorage.setItem("savedPairs", JSON.stringify(savedPairs));

  const favOption = document.createElement("option");
  favOption.value = selectedPair;
  favOption.text = selectedPair;
  favPairs.appendChild(favOption);
});

favPairs.addEventListener("change", () => {
  const selectedPair = favPairs.value;
  const currencies = selectedPair.split("/");
  baseCurrency.value = currencies[0];
  targetCurrency.value = currencies[1];
  convert();
});