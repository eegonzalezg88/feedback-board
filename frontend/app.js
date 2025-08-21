const feedbackList = document.getElementById('feedbackList');
const feedbackForm = document.getElementById('feedbackForm');

const API_BASE_URL = 'http://localhost:3001'; // Change if your backend runs on different port

// Fetch and display feedback
async function loadFeedback() {
  try {
    const res = await fetch(`${API_BASE_URL}/feedback`);
    const data = await res.json();
    feedbackList.innerHTML = '';

    data.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name}: ${item.message}`;
      feedbackList.appendChild(li);
    });
  } catch (err) {
    feedbackList.innerHTML = '<li>Error loading feedback</li>';
  }
}

// Handle form submission
feedbackForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !message) return alert('Please enter your name and feedback.');

  try {
    const res = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message })
    });

    if (!res.ok) throw new Error('Failed to submit feedback');

    // Clear form and reload list
    feedbackForm.reset();
    loadFeedback();

  } catch (err) {
    alert(err.message);
  }
});

// Load feedback on page load
loadFeedback();
