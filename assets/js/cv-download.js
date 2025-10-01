// CV Download Password Protection
(function() {
  // Configuration
  const CONFIG = {
    password: 'edmond2025', // Change this to your desired password
    pdfUrl: '/assets/documents/EdmondMiu_CV.pdf', // Path to your CV PDF
    cvContentUrl: 'cv-content-a8f3k2j9p7m4n6q1.html', // Path to CV content file (obfuscated filename)
  };

  // DOM elements
  const passwordForm = document.getElementById('password-form');
  const passwordInput = document.getElementById('cv-password');
  const unlockBtn = document.getElementById('unlock-btn');
  const downloadSuccess = document.getElementById('download-success');
  const downloadLink = document.getElementById('download-link');
  const passwordError = document.getElementById('password-error');
  const cvContent = document.getElementById('cv-content');

  // Check if elements exist
  if (!passwordForm || !passwordInput || !unlockBtn) {
    return;
  }

  // Check if already unlocked in this session
  const isUnlocked = sessionStorage.getItem('cvUnlocked') === 'true';
  if (isUnlocked) {
    loadAndShowCV();
  }

  // Handle unlock button click
  unlockBtn.addEventListener('click', handleUnlock);

  // Handle Enter key in password input
  passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  });

  // Clear error when typing
  passwordInput.addEventListener('input', function() {
    hideError();
  });

  function handleUnlock() {
    const enteredPassword = passwordInput.value.trim();

    if (!enteredPassword) {
      showError('Please enter a password');
      return;
    }

    if (enteredPassword === CONFIG.password) {
      // Correct password
      sessionStorage.setItem('cvUnlocked', 'true');
      loadAndShowCV();
    } else {
      // Incorrect password
      showError('Incorrect password. Please try again.');
      passwordInput.value = '';
      passwordInput.focus();
    }
  }

  async function loadAndShowCV() {
    try {
      // Fetch the CV content
      console.log('Fetching CV content from:', CONFIG.cvContentUrl);
      const response = await fetch(CONFIG.cvContentUrl);

      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`Failed to load CV content: ${response.status} ${response.statusText}`);
      }

      const htmlContent = await response.text();
      console.log('CV content loaded successfully, length:', htmlContent.length);

      // Hide form and error
      passwordForm.style.display = 'none';
      passwordError.style.display = 'none';

      // Set download link
      downloadLink.href = CONFIG.pdfUrl;

      // Show success message and download button
      downloadSuccess.style.display = 'flex';

      // Inject the CV content into the page
      if (cvContent) {
        cvContent.innerHTML = htmlContent;
        cvContent.style.display = 'block';
        console.log('CV content injected successfully');
      } else {
        console.error('CV content container not found');
      }
    } catch (error) {
      console.error('Error loading CV:', error);
      showError(`Failed to load CV content: ${error.message}`);
      sessionStorage.removeItem('cvUnlocked');
    }
  }

  function showError(message) {
    passwordError.textContent = message;
    passwordError.style.display = 'block';
  }

  function hideError() {
    passwordError.style.display = 'none';
  }
})();
