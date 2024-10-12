  // Get references to the DOM elements
  const textInput = document.getElementById('textInput');
  const controlBtn = document.getElementById('controlBtn');
  const stopBtn = document.getElementById('stopBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  const animation = document.getElementById('animation');

  let utterance = null;
  let voices = [];

  function populateVoices() {
      voices = speechSynthesis.getVoices();
      // You can select a preferred voice here
      // For example, prefer a voice that includes 'Microsoft' or 'Google' in the name
  }

  populateVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoices;
  }

  // Load saved text from localStorage on page load
  window.addEventListener('DOMContentLoaded', () => {
      const savedText = localStorage.getItem('savedText');
      if (savedText) {
          textInput.value = savedText;
      }
  });

  // Save text to localStorage whenever it changes
  textInput.addEventListener('input', () => {
      localStorage.setItem('savedText', textInput.value);
  });

  // Control button handles Start, Pause, and Resume
  controlBtn.addEventListener('click', () => {
      if (!speechSynthesis.speaking && !speechSynthesis.paused) {
          // Not speaking, start speaking
          const text = textInput.value;
          if (text.trim() === '') {
              alert('Please enter some text to speak');
              return;
          }
          utterance = new SpeechSynthesisUtterance(text);
          // Select a preferred voice
          let selectedVoice = voices.find(voice => voice.name.includes('Microsoft') && voice.lang === 'en-US');
          if (!selectedVoice) {
              selectedVoice = voices.find(voice => voice.name.includes('Google US English'));
          }
          if (selectedVoice) {
              utterance.voice = selectedVoice;
          }
          utterance.rate = 1; // Adjust the rate as desired
          speechSynthesis.speak(utterance);
          controlBtn.textContent = 'Pause';
          animation.style.display = 'block'; // Show the animation

          // Reset button text when speech ends
          utterance.addEventListener('end', () => {
              controlBtn.textContent = 'Start';
              animation.style.display = 'none'; // Hide the animation
          });
      } else if (speechSynthesis.speaking && !speechSynthesis.paused) {
          // Speaking, so pause it
          speechSynthesis.pause();
          controlBtn.textContent = 'Resume';
          animation.style.display = 'none'; // Hide the animation
      } else if (speechSynthesis.paused) {
          // Paused, so resume
          speechSynthesis.resume();
          controlBtn.textContent = 'Pause';
          animation.style.display = 'block'; // Show the animation
      }
  });

  // Stop speaking
  stopBtn.addEventListener('click', () => {
      if (speechSynthesis.speaking || speechSynthesis.paused) {
          speechSynthesis.cancel();
          controlBtn.textContent = 'Start';
          animation.style.display = 'none'; // Hide the animation
      }
  });

  // Delete text
  deleteBtn.addEventListener('click', () => {
      textInput.value = '';
      localStorage.removeItem('savedText'); // Remove saved text from localStorage
      textInput.focus(); // Optional: focus the textarea after clearing
  });