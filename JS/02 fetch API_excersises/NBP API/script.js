// http://api.nbp.pl/api/exchangerates/tables/a

const currencyRate = async () => {
    const request = await fetch('http://api.nbp.pl/api/exchangerates/tables/a');
    const currencyData = await request.json();
    
    const targetTable = document.querySelector('#table');
    currencyData[0].rates.forEach(data => {
        const currency = document.createElement('div');
        currency.innerText = data.currency;
        
        const mid = document.createElement('div');
        mid.innerText = data.mid;

        const code = document.createElement('div');
        code.innerText = data.code;

        targetTable.appendChild(currency);
        targetTable.appendChild(mid);
        targetTable.appendChild(code);
    });
} 
currencyRate()