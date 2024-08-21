document.addEventListener('DOMContentLoaded', () => {
  const timeSpentDiv = document.getElementById('time-spent');
  const resetBtn = document.getElementById('reset-btn');

  function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / 1000 / 60 / 60) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  function updateDisplay() {
    chrome.storage.local.get(['timeSpent'], (result) => {
      timeSpentDiv.innerHTML = '<h3>Time Spent on Social Media:</h3>';
      const timeSpent = result.timeSpent || {};
      for (const [site, time] of Object.entries(timeSpent)) {
        const siteTime = document.createElement('div');
        siteTime.textContent = `${site}: ${formatTime(time)}`;
        timeSpentDiv.appendChild(siteTime);
      }
    });
  }

  resetBtn.addEventListener('click', () => {
    chrome.storage.local.set({ timeSpent: {} }, () => {
      updateDisplay();
    });
  });

  updateDisplay();
});
