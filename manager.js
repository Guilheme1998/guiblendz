// Define 30-minute time slots between 10:00 AM and 6:00 PM
function generateTimeSlots(startHour, endHour, interval) {
    const slots = [];
    let currentTime = new Date();
    currentTime.setHours(startHour, 0, 0, 0); // Start at 10:00 AM

    while (currentTime.getHours() < endHour || (currentTime.getHours() === endHour && currentTime.getMinutes() === 0)) {
        const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        slots.push(timeString);
        currentTime.setMinutes(currentTime.getMinutes() + interval); // Add 30 minutes
    }
    return slots;
}

// Initialize default schedule
function initializeDefaultSchedule() {
    const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    const timeSlots = generateTimeSlots(10, 18, 30); // Generates slots from 10:00 AM to 6:00 PM

    // Create a schedule object with default availability
    let schedule = {};

    // Fill today's slots with availability
    schedule[today] = timeSlots.map(time => ({ time, available: true }));

    // Store the schedule in localStorage if it doesn't exist
    if (!localStorage.getItem("schedule")) {
        localStorage.setItem("schedule", JSON.stringify(schedule));
    }
}

// Reset schedule daily (optional, based on your preference)
function resetScheduleDaily() {
    const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    const lastUpdate = localStorage.getItem("lastUpdate");

    if (lastUpdate !== today) {
        // Reset schedule if the date has changed (comment out if you want to keep slots)
        // localStorage.removeItem("schedule");
        localStorage.setItem("lastUpdate", today);
    }
}

// Run daily check and initialize on page load
initializeDefaultSchedule();
resetScheduleDaily();

let schedule = JSON.parse(localStorage.getItem("schedule")) || {};

// Load the schedule for the selected date when the date changes
document.getElementById("manageDate").addEventListener("change", showTimeSlots);

function showTimeSlots() {
    const selectedDate = document.getElementById("manageDate").value;
    const container = document.getElementById("timeSlotsContainer");
    container.innerHTML = "";  // Clear previous slots

    // Initialize the schedule for the selected date if it doesn't exist
    if (!schedule[selectedDate]) {
        schedule[selectedDate] = generateTimeSlots(10, 18, 30).map(time => ({ time, available: true }));
    }

    // Display time slots with toggle buttons
    schedule[selectedDate].forEach(slot => {
        const slotDiv = document.createElement("div");
        slotDiv.className = "slot";

        const timeLabel = document.createElement("span");
        timeLabel.textContent = slot.time;

        const toggleButton = document.createElement("button");
        toggleButton.textContent = slot.available ? "Open" : "Closed";
        toggleButton.className = slot.available ? "open" : "closed";
        
        // Toggle slot availability on click
        toggleButton.addEventListener("click", () => {
            slot.available = !slot.available;
            toggleButton.textContent = slot.available ? "Open" : "Closed";
            toggleButton.className = slot.available ? "open" : "closed";
            
            // Save the updated schedule to Local Storage
            localStorage.setItem("schedule", JSON.stringify(schedule));
        });

        slotDiv.appendChild(timeLabel);
        slotDiv.appendChild(toggleButton);
        container.appendChild(slotDiv);
    });
}

// Save schedule when "Save Schedule" button is clicked (optional)
document.getElementById("saveSchedule").addEventListener("click", () => {
    localStorage.setItem("schedule", JSON.stringify(schedule));
    document.getElementById("saveConfirmation").textContent = "Schedule saved!";
});