const query = document.getElementById('searchBar');
const qrCode = document.getElementById('qrCode');
const qrCloseBtn = document.getElementById('qrClose');
const currencyCloseBtn = document.getElementById('currencyClose');
const qrModal = document.getElementById('qrModal');
const currencyModal = document.getElementById('currencyModal');
const generateQr = document.getElementById('generateQr');
const notification = document.getElementById('notification');
const paragraph = document.getElementById('notificationData');
const currencyBtn = document.getElementById('currencyExchange');
const currencyDropDown = document.querySelectorAll('.currencyDropDown');
const currencyResult = document.getElementById('currencyResult');
const currencyInput = document.getElementById('currencyInputNumber');
const currencyConvertBtn = document.getElementById('convertCurrency')
const quoteLoading = document.getElementById('quoteLoading');
const quoteIcon = document.getElementById('quoteIcon');
const weatherContainer = document.getElementById('weatherContainer');
const weatherLoading = document.getElementById('weatherLoading');
const airQContainer = document.getElementById('airQContainer');
const airQLoading = document.getElementById('airQLoading');
const connection = document.getElementById('noConnection')
let advice = document.getElementById('advice');
let day = document.getElementById('day');
let month = document.getElementById('month');
let year = document.getElementById('year');
let city = document.getElementById('city');
let country = document.getElementById('country');
let temp = document.getElementById('temp');
let airQ = document.getElementById('airQ');
let airQDetails = document.getElementById('airQDetails');



let ipAddress;
let timeZone;
let lat;
let lng;
let userCity;
let continent;

const airQualitySituation = {
    1: "Good",
    2: "Moderate",
    3: "Unhealthy for sensitive group",
    4: "Unhealthy",
    5: "Very Unhealthy",
    6: "Hazardous",
};


// Check Internet Connection
(function checkMode() {
    if(window.navigator.onLine == false){
      connection.classList.remove("hidden")
    }
})();

// Get IP Address 
(async function fetchUserIp() {
    const response = await fetch('https://api.techniknews.net/ip/');
    const data = await response.text();
    ipAddress = data
    userInfo()
})();

// Search Bar functionality
function serach() {
    let url = `https://www.google.com/search?q=${query.value}`
    window.open(url, "_self")
};

query.addEventListener("keypress", (event) => {
    if (event.key === "Enter"){ serach() }
});

// QR code Modal
qrCode.addEventListener("click", ()=>{
    qrModal.style.visibility = "visible"
})
qrCloseBtn.addEventListener("click", () => {
    qrModal.style.visibility = "hidden"
})
generateQr.addEventListener("click", () => {
    const qrData = document.getElementById('qrData').value
    if(qrData === ""){
        sendNotification('Please enter your data', 'red')
        }else{
        generateQRCode()
    }
})

// QR Code 

function generateQRCode() {
    const qrData = document.getElementById('qrData').value
    fetch(`https://image-charts.com/chart?chs=400x400&cht=qr&chl=${qrData}&choe=UTF-8&icqrf=00FF00&chof=.svg`)
    .then((response) => {
        const qr = response.url
        window.open(qr, "_blank")
    })
};

//Currency Exghange
currencyBtn.addEventListener("click", () => {
    currencyModal.style.visibility = "visible"
});
currencyCloseBtn.addEventListener("click", () => {
    currencyModal.style.visibility = "hidden"
});
(function getCurrency() {
    fetch('https://api.frankfurter.app/currencies')
    .then((response) => response.json())
    .then((data) => {
        const entries = Object.entries(data)
        for(i=0; i< entries.length; i++) {
            currencyDropDown[0].innerHTML += `<option value="${entries[i][0]}">${entries[i][1]}</option>`
            currencyDropDown[1].innerHTML += `<option value="${entries[i][0]}">${entries[i][1]}</option>`
        }
    })    
})();

currencyConvertBtn.addEventListener('click', ()=>{
    convertCurrency()
})

function convertCurrency() {
    const currencyInputNumber = document.getElementById('currencyInputNumber').value
    const currencyFirstInputData = document.getElementById('currencyFirstInputData').value
    const currencySecondInputData = document.getElementById('currencySecondInputData').value
   
    if((currencyInputNumber && currencyInputNumber > 0) && currencyFirstInputData && currencySecondInputData && (currencyFirstInputData != currencySecondInputData)){
        currencyResult.innerText = "..."
        currencyResult.classList.add('animate-pulse')
        try {
            fetch(`https://api.frankfurter.app/latest?amount=${currencyInputNumber}&from=${currencyFirstInputData}&to=${currencySecondInputData}`)
            .then(resp => resp.json())
            .then((data) => {
                currencyResult.innerText = Object.values(data.rates)[0]
                currencyResult.classList.remove('animate-pulse')
            });    
        } catch (error) {
            sendNotification(error, 'red')
        }
        
    }else {
        sendNotification('Please Check Your Entered Data', 'red');
    }
};

// Get Random Advice
(
async function getAdvice() {
    try {
        const response = await fetch('https://xbyt-server.vercel.app/advice');
        const data = await response.json()
        const resData = JSON.parse(data)
        advice.innerText = resData.slip.advice
        localStorage.setItem("advice", resData.slip.advice)
        quoteLoading.style.display = 'none'
        quoteIcon.style.visibility = 'visible'
        
    } catch {
        advice.innerText = localStorage.getItem("advice"),
        quoteLoading.style.display = 'none',
        quoteIcon.style.visibility = 'visible'
    }    
    
})();

// User informations
const userInfo = function(){
    fetch(`https://api.techniknews.net/ipgeo/${ipAddress}`)
      .then((response) => response.json())
      .then((data) => {
        lat = data.lat
        lng = data.lon
        city.innerText = data.city
        userCity = data.city
        country.innerText = data.country
        weather() 
    });
};

// Weather & Air Quality
const weather = async function(){
    try {
        const response = await fetch(`https://xbyt-server.vercel.app/weather?q=${userCity}&aqi=yes`)
        const data = await response.json()
            temp.innerText = data.current.temp_c
            localStorage.setItem("temp", data.current.temp_c)
            document.getElementById('weatherIcon').src = data.current.condition.icon
            localStorage.setItem("weatherIcon", data.current.condition.icon)
            airQ.innerText = data.current.air_quality["us-epa-index"]
            localStorage.setItem("airQ", data.current.air_quality["us-epa-index"])
            const airQNumber = data.current.air_quality["us-epa-index"].toString()
            const filteredByKey = Object.fromEntries(
            Object.entries(airQualitySituation).filter(([key]) => key === airQNumber) )
            const details =  Object.values(filteredByKey)[0];
            airQDetails.innerText = details
            localStorage.setItem("airQDetails", details)
            weatherContainer.style.display = "block"
            weatherLoading.style.display = "none"
            airQContainer.style.display = "block"
            airQLoading.style.display = "none"
    } catch {
        temp.innerText = localStorage.getItem("temp")
        document.getElementById('weatherIcon').src =localStorage.getItem("weatherIcon")
        airQ.innerText = localStorage.getItem("airQ")
        airQDetails.innerText = localStorage.getItem("airQDetails")
        weatherContainer.style.display = "block"
        weatherLoading.style.display = "none"
        airQContainer.style.display = "block"
        airQLoading.style.display = "none"
    }
    
};

// Date
function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', {
      month: 'long',
    });
};
(function getDate() {
    const date = new Date();
    year.innerText = date.getFullYear();
    day.innerText = date.getDate();
    
    const monthNumber = date.getMonth() + 1
    date.setMonth(monthNumber - 1);
    const monthName = date.toLocaleString('en-US', {
        month: 'long',
    });

    month.innerText = monthName
    
})();


// Notification 

function sendNotification(data, color) {
    notification.style.visibility = "visible";
    notification.style.backgroundColor = color
    paragraph.innerText = data
    setTimeout(hideNotification, 4000);
}
function hideNotification () {
    notification.style.visibility = "hidden"
}
