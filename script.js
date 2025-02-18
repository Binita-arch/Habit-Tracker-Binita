document.addEventListener("DOMContentLoaded", () => {
    loadHabits();
});

function addHabit() {
    const habitInput = document.getElementById('habitInput');
    const habitText = habitInput.value.trim();

    if (habitText === '') return;

    const habits = JSON.parse(localStorage.getItem('habits')) || [];
    const habit = { id: Date.now(), name: habitText };
    habits.push(habit);
    localStorage.setItem('habits', JSON.stringify(habits));

    habitInput.value = '';
    loadHabits();
}

function loadHabits() {
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = '';

    const habits = JSON.parse(localStorage.getItem('habits')) || [];

    habits.forEach(habit => {
        const li = document.createElement('li');

        const habitSpan = document.createElement('span');
        habitSpan.textContent = habit.name;
        habitSpan.classList.add("habit-text");

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add("hidden");
        editButton.onclick = function() {
            editHabit(habit.id, habitSpan, saveButton);
        };

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.classList.add("hidden");
        saveButton.onclick = function() {
            saveHabit(habit.id, habitSpan, saveButton, editButton);
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add("hidden");
        deleteButton.onclick = function() {
            deleteHabit(habit.id, habit.name);
        };

        // Show buttons when the habit is clicked
        habitSpan.onclick = function() {
            editButton.classList.remove("hidden");
            saveButton.classList.remove("hidden");
            deleteButton.classList.remove("hidden");
        };

        li.appendChild(habitSpan);
        li.appendChild(editButton);
        li.appendChild(saveButton);
        li.appendChild(deleteButton);
        habitList.appendChild(li);
    });
}

function editHabit(id, habitSpan, saveButton) {
    habitSpan.contentEditable = true;
    habitSpan.focus();

    // Save on blur (click outside) or pressing Enter
    habitSpan.onblur = () => saveHabit(id, habitSpan, saveButton);
    habitSpan.onkeypress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent new line
            habitSpan.blur(); // Save and exit edit mode
        }
    };
}

function saveHabit(id, habitSpan, saveButton, editButton) {
    const habits = JSON.parse(localStorage.getItem('habits')) || [];
    const habit = habits.find(h => h.id === id);
    if (habit) {
        habit.name = habitSpan.textContent;
        localStorage.setItem('habits', JSON.stringify(habits));
    }
    habitSpan.contentEditable = false;
    saveButton.classList.add("hidden");
    editButton.classList.add("hidden");

    showMessage("Saved!");
}

function deleteHabit(id, name) {
    const confirmation = confirm(`Do you want to delete the habit: "${name}"?`);
    if (!confirmation) return;

    let habits = JSON.parse(localStorage.getItem('habits')) || [];
    habits = habits.filter(habit => habit.id !== id);
    localStorage.setItem('habits', JSON.stringify(habits));
    loadHabits();

    showMessage("Deleted!");
}

function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.classList.add("message");

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 2000); // Remove the message after 2 seconds
}

// Generate QR Code for sharing the website
document.getElementById('qrButton').onclick = function() {
    const websiteUrl = window.location.href;
    const qrDiv = document.getElementById('qrCode');

    qrDiv.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(websiteUrl)}" alt="QR Code">`;

    // Add a share button
    const shareButton = document.createElement('button');
    shareButton.textContent = 'Share QR Code';
    shareButton.onclick = function() {
        if (navigator.share) {
            navigator.share({
                title: 'Share Habit Tracker',
                text: 'Check out this habit tracker!',
                url: websiteUrl
            }).catch((error) => console.log('Error sharing:', error));
        } else {
            alert("Sharing is not supported in this browser.");
        }
    };

    qrDiv.appendChild(shareButton);
};

document.getElementById('authButton').onclick = function() {
    alert('Biometric authentication coming soon!');
};

document.getElementById('habitForm').onsubmit = function(event) {
    event.preventDefault();
    addHabit();
};
