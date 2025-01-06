// Load schedule
let schedule = JSON.parse(localStorage.getItem("schedule")) || {};

// Handle date change to update available time slots
document.getElementById("date").addEventListener("change", updateAvailableTimeSlots);

function updateAvailableTimeSlots() {
    const selectedDate = document.getElementById("date").value;
    const timeSelect = document.getElementById("time");
    timeSelect.innerHTML = '<option value="">Select a time slot</option>';

    // Check if the selected date has a saved schedule
    if (schedule[selectedDate]) {
        schedule[selectedDate].forEach(slot => {
            if (slot.available) {
                const option = document.createElement("option");
                option.value = slot.time;
                option.textContent = slot.time;
                timeSelect.appendChild(option);
            }
        });
    } else {
        alert("No available time slots for this date. Please select another date.");
    }
}

// Handle booking an appointment
document.getElementById("appointmentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const selectedDate = document.getElementById("date").value;
    const selectedTime = document.getElementById("time").value;

    if (selectedDate && selectedTime) {
        // Here you could send an email or notification for the appointment
        document.getElementById("confirmation").textContent =
            `Appointment booked for ${selectedDate} at ${selectedTime}!`;
        
        // Mark the slot as unavailable after booking
        if (schedule[selectedDate]) {
            const bookedSlot = schedule[selectedDate].find(slot => slot.time === selectedTime);
            if (bookedSlot) {
                bookedSlot.available = false;
                localStorage.setItem("schedule", JSON.stringify(schedule));
            }
        }
    } else {
        alert("Please select both a date and a time slot.");
    }
});

let navbar = document.querySelector('.header .navbar');
let menuBtn = document.querySelector('#menu-btn');
let closeBtn = document.querySelector('#close-navbar');

menuBtn.onclick = () =>{
    navbar.classList.add('active');
}

closeBtn.onclick = () =>{
    navbar.classList.remove('active');
}

window.onclick = () =>{
    navbar.classList.remove('active');
}
