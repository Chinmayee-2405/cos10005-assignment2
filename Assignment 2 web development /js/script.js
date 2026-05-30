window.onload = function () {
    setupRegisterForm();
    setupReservationForm();
    setupReservationFromURL();
    loadBillPage();
};

function setupRegisterForm() {
    var form = document.getElementById("registerForm");

    if (form) {
        form.onsubmit = validateRegister;
    }
}

function setupReservationForm() {
    var form = document.getElementById("reservationForm");

    if (form) {
        form.onsubmit = validateReservation;
    }

    var restaurant = document.getElementById("restaurant");
    var voucher = document.getElementById("voucher");
    var online = document.getElementById("online");
    var sameEmail = document.getElementById("sameEmail");

    if (restaurant) {
        restaurant.onchange = updateDeposit;
    }

    if (voucher) {
        voucher.onchange = showPaymentFields;
    }

    if (online) {
        online.onchange = showPaymentFields;
    }

    if (sameEmail) {
        sameEmail.onchange = copyEmail;
    }
}

function validateRegister() {
    var username = document.getElementById("username").value.trim();
    var email = document.getElementById("regEmail").value.trim();
    var phone = document.getElementById("regPhone").value.trim();
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var dietPref = document.getElementById("dietPref").value;
    var country = document.getElementById("country").value.trim();
    var error = document.getElementById("registerError");

    var errMsg = "";

    if (username === "") {
        errMsg += "Please enter your username.\n";
    }

    if (email === "") {
        errMsg += "Please enter your email.\n";
    }

    if (phone === "") {
        errMsg += "Please enter your phone number.\n";
    }

    if (password === "") {
        errMsg += "Please enter your password.\n";
    }

    if (confirmPassword === "") {
        errMsg += "Please confirm your password.\n";
    }

    if (password !== confirmPassword) {
        errMsg += "Passwords do not match.\n";
    }

    if (dietPref === "") {
        errMsg += "Please select your dietary preference.\n";
    }

    if (country === "") {
        errMsg += "Please enter your country or region.\n";
    }

    if (errMsg !== "") {
        error.textContent = errMsg;
        return false;
    }

    error.textContent = "";
    alert("Registration successful!");
    return true;
}

function setupReservationFromURL() {
    var restaurantSelect = document.getElementById("restaurant");

    if (!restaurantSelect) {
        return;
    }

    var params = new URLSearchParams(window.location.search);
    var selectedRestaurant = params.get("restaurant");

    if (selectedRestaurant) {
        restaurantSelect.value = selectedRestaurant;
        updateDeposit();
    }
}

function updateDeposit() {
    var restaurant = document.getElementById("restaurant");
    var deposit = document.getElementById("deposit");

    if (!restaurant || !deposit) {
        return;
    }

    var prices = {
        "Saravanaa Bhavan": 20,
        "MammaMia": 25,
        "More Coffee": 15,
        "Gyro Gyro Oli": 30,
        "Lune Croissanterie": 20,
        "Stalactites": 35
    };

    if (restaurant.value === "") {
        deposit.value = "";
    } else {
        deposit.value = "$" + prices[restaurant.value];
    }
}

function showPaymentFields() {
    var voucher = document.getElementById("voucher");
    var online = document.getElementById("online");
    var voucherBox = document.getElementById("voucherBox");
    var cardBox = document.getElementById("cardBox");

    voucherBox.classList.add("hidden");
    cardBox.classList.add("hidden");

    if (voucher.checked) {
        voucherBox.classList.remove("hidden");
    }

    if (online.checked) {
        cardBox.classList.remove("hidden");
    }
}

function copyEmail() {
    var sameEmail = document.getElementById("sameEmail");
    var email = document.getElementById("email");
    var billingEmail = document.getElementById("billingEmail");

    if (sameEmail.checked) {
        billingEmail.value = email.value;
    } else {
        billingEmail.value = "";
    }
}

function validateReservation() {
    var restaurant = document.getElementById("restaurant").value;
    var fullname = document.getElementById("fullname").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var guests = document.getElementById("guests").value;
    var voucher = document.getElementById("voucher");
    var online = document.getElementById("online");
    var voucherCode = document.getElementById("voucherCode").value.trim();
    var cardNumber = document.getElementById("cardNumber").value.trim();
    var billingEmail = document.getElementById("billingEmail").value.trim();
    var error = document.getElementById("reservationError");

    var errMsg = "";

    if (restaurant === "") {
        errMsg += "Please select a restaurant.\n";
    }

    if (fullname === "") {
        errMsg += "Please enter your full name.\n";
    }

    if (email === "") {
        errMsg += "Please enter your email.\n";
    }

    if (phone === "") {
        errMsg += "Please enter your phone number.\n";
    }

    if (date === "") {
        errMsg += "Please select a reservation date.\n";
    }

    if (time === "") {
        errMsg += "Please select a reservation time.\n";
    }

    if (guests === "" || guests < 1 || guests > 20) {
        errMsg += "Guests must be between 1 and 20.\n";
    }

    if (!voucher.checked && !online.checked) {
        errMsg += "Please select a deposit payment method.\n";
    }

    if (voucher.checked && !/^[0-9]{12}$/.test(voucherCode)) {
        errMsg += "Voucher code must be 12 digits.\n";
    }

    if (online.checked && !/^([0-9]{15}|[0-9]{16})$/.test(cardNumber)) {
        errMsg += "Card number must be 15 or 16 digits.\n";
    }

    if (billingEmail === "") {
        errMsg += "Please enter your billing email.\n";
    }

    if (errMsg !== "") {
        error.textContent = errMsg;
        return false;
    }

    error.textContent = "";
    saveReservationForBill();
    window.location.href = "bill.html";
    return false;
}

function saveReservationForBill() {
    var reservationData = {
        restaurant: document.getElementById("restaurant").value,
        name: document.getElementById("fullname").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        guests: document.getElementById("guests").value,
        deposit: document.getElementById("deposit").value.replace("$", "")
    };

    localStorage.setItem("reservationBill", JSON.stringify(reservationData));
}

function loadBillPage() {
    if (!document.getElementById("billRestaurant")) {
        return;
    }

    var billData = localStorage.getItem("reservationBill");

    if (!billData) {
        return;
    }

    var data = JSON.parse(billData);

    document.getElementById("billRestaurant").textContent = data.restaurant;
    document.getElementById("billName").textContent = data.name;
    document.getElementById("billEmail").textContent = data.email;
    document.getElementById("billPhone").textContent = data.phone;
    document.getElementById("billDate").textContent = data.date;
    document.getElementById("billTime").textContent = data.time;
    document.getElementById("billGuests").textContent = data.guests;

    var deposit = Number(data.deposit);
    var serviceFee = 5;
    var total = deposit + serviceFee;

    document.getElementById("billDeposit").textContent = deposit;
    document.getElementById("billService").textContent = serviceFee;
    document.getElementById("billTotal").textContent = total;
}

function recommendRestaurant() {
    var diet = document.getElementById("diet").value;
    var budget = document.getElementById("budget").value;
    var purpose = document.getElementById("purpose").value;
    var error = document.getElementById("recommendError");

    if (diet === "" || budget === "" || purpose === "") {
        error.textContent = "Please select all options.";
        return;
    }

    error.textContent = "";

    var name = "";
    var desc = "";

    if (diet === "vegetarian" || diet === "vegan") {
        name = "Saravanaa Bhavan";
        desc = "A great vegetarian-friendly option with South Indian food.";
    } else if (budget === "low") {
        name = "More Coffee";
        desc = "A cosy and affordable cafe option in Hawthorn.";
    } else if (purpose === "date") {
        name = "Lune Croissanterie";
        desc = "A stylish bakery perfect for a cute food date.";
    } else if (purpose === "friends") {
        name = "Gyro Gyro Oli";
        desc = "A fun Greek street food spot for casual group dining.";
    } else if (budget === "high") {
        name = "Stalactites";
        desc = "A popular Melbourne Greek restaurant with filling meals.";
    } else {
        name = "MammaMia";
        desc = "A cute Italian-inspired cafe with coffee and tiramisu.";
    }

    document.getElementById("resultName").textContent = name;
    document.getElementById("resultDesc").textContent = desc;
    document.getElementById("reserveRecommended").href =
        "reservation.html?restaurant=" + encodeURIComponent(name);

    document.getElementById("recommendResult").classList.remove("hidden");
}