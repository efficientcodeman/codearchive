// This took long to make, i used a bunch of ai but here it is, paste it in console whilst doing educake

(async () => {
  // --- CONFIGURATION ---
  const QUESTION_SELECTOR = 'fieldset.question-text .pre-line';
  const INPUT_SELECTOR = 'input.answer-text';
  const DB_KEY = 'quizDB';

  // --- DATABASE HELPERS ---
  const loadDB = () => JSON.parse(localStorage.getItem(DB_KEY) || '{}');
  const saveDB = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db));

  // --- STATE ---
  let lastHash = null;
  let autoLearn = true;
  let autoFinish = false;
  let isSubmitting = false;

  // =================================================================================
  // === UI & STYLING ================================================================
  // =================================================================================

  function injectStyles() {
    const styles = `
      :root {
        --panel-bg: linear-gradient(145deg, #2c3e50, #1a2533);
        --panel-text: #ecf0f1;
        --panel-border: #4a627a;
        --btn-bg: #3498db;
        --btn-hover-bg: #5dade2;
        --btn-text: #ffffff;
        --input-bg: #2c3e50;
        --success-color: #2ecc71;
        --font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
      }
      .quiz-helper-panel {
        position: fixed; top: 15px; right: 15px; width: 350px;
        background: var(--panel-bg); color: var(--panel-text);
        border: 1px solid var(--panel-border); border-radius: 12px;
        padding: 15px; z-index: 9999; font-family: var(--font-family);
        box-shadow: 0 10px 30px rgba(0,0,0,0.3); font-size: 14px;
        overflow: hidden;
      }
      .quiz-helper-settings-cog {
        position: fixed; top: 25px; right: 375px; background: #2c3e50;
        border: 1px solid var(--panel-border); color: var(--panel-text);
        border-radius: 50%; width: 35px; height: 35px; cursor: pointer;
        z-index: 10000; display: flex; align-items: center; justify-content: center;
        font-size: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transition: transform 0.2s ease, background-color 0.2s ease;
      }
      .quiz-helper-settings-cog:hover { transform: rotate(45deg); background-color: #34495e; }
      .quiz-helper-settings-menu {
        display: none; position: fixed; top: 65px; right: 375px;
        background: #34495e; padding: 10px; border-radius: 8px;
        border: 1px solid var(--panel-border); z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2); width: 220px;
      }
      .quiz-helper-settings-menu label { display: block; margin-bottom: 10px; cursor: pointer; }
      .quiz-helper-settings-menu button { width: 100%; margin-top: 5px; }
      .quiz-helper-panel .question-text, .quiz-helper-panel .waiting-text {
        font-weight: bold; margin-bottom: 12px; padding-bottom: 8px;
        border-bottom: 1px solid var(--panel-border); min-height: 50px;
        display: flex; align-items: center; justify-content: center; text-align: center;
      }
      .quiz-helper-panel .button-group { display: flex; gap: 10px; margin-bottom: 12px; }
      .quiz-helper-panel button {
        flex-grow: 1; background: var(--btn-bg); color: var(--btn-text);
        border: none; padding: 10px; border-radius: 6px; cursor: pointer;
        font-size: 14px; font-weight: bold;
        transition: all 0.2s ease;
      }
      .quiz-helper-panel .saved-answer-display {
        background: var(--input-bg); padding: 10px; border-radius: 6px;
        border: 1px solid var(--panel-border); margin-bottom: 10px;
      }
      .quiz-helper-panel .edit-answer-container { display: flex; gap: 5px; align-items: center; }
      .quiz-helper-panel .edit-answer-input { flex-grow: 1; background: #34495e; border: 1px solid var(--panel-border); color: white; padding: 5px; border-radius: 4px; font-size:14px; }
      .quiz-helper-panel .edit-answer-save-btn { flex-grow: 0; padding: 5px 10px; font-size: 12px; background: var(--success-color); }
      .quiz-helper-panel .nav-button { width: 100%; background-color: var(--success-color); }
      .quiz-helper-panel #panel-message {
        position: absolute; bottom: -50px; left: 15px; right: 15px;
        background-color: var(--success-color); color: white; text-align: center;
        padding: 8px; border-radius: 6px;
        transition: bottom 0.3s ease-in-out;
      }
    `;
    document.head.appendChild(Object.assign(document.createElement("style"), { innerText: styles }));
  }

  function showPanelMessage(message, duration = 2000) {
      let msgEl = document.getElementById('panel-message');
      if (!msgEl) {
          msgEl = document.createElement('div');
          msgEl.id = 'panel-message';
          panel.appendChild(msgEl);
      }
      msgEl.textContent = message;
      msgEl.style.bottom = '15px';
      setTimeout(() => { msgEl.style.bottom = '-50px'; }, duration);
  }

  function buildUI() {
    const panel = document.createElement('div');
    panel.className = 'quiz-helper-panel';
    panel.id = 'gemini-quiz-panel';
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'quiz-helper-settings-cog';
    settingsBtn.innerHTML = '⚙️';
    const settingsDiv = document.createElement('div');
    settingsDiv.className = 'quiz-helper-settings-menu';
    settingsDiv.innerHTML = `
      <label title="Automatically save the correct answer when it's shown on screen."><input type="checkbox" id="autoLearnCheckbox" checked> Auto-Learn Answers</label>
      <label title="Automatically run through the entire quiz."><input type="checkbox" id="autoFinishCheckbox"> Auto-Finish Quiz</label>
      <button id="copyDbBtn">Copy DB</button>
      <button id="loadDbBtn">Load DB</button>
    `;
    document.body.append(panel, settingsBtn, settingsDiv);
    settingsBtn.onclick = () => settingsDiv.style.display = (settingsDiv.style.display === 'block' ? 'none' : 'block');
    document.getElementById('autoLearnCheckbox').onchange = (e) => autoLearn = e.target.checked;
    document.getElementById('autoFinishCheckbox').onchange = (e) => autoFinish = e.target.checked;
    document.getElementById('copyDbBtn').onclick = () => {
        navigator.clipboard.writeText(JSON.stringify(loadDB(), null, 2));
        showPanelMessage('Database copied!');
    };
    document.getElementById('loadDbBtn').onclick = () => {
      const json = prompt("Paste DB JSON:");
      if (json) try {
        saveDB({ ...loadDB(), ...JSON.parse(json) });
        showPanelMessage('Database merged!');
      } catch (e) { showPanelMessage('Error: Invalid JSON!', 3000); }
    };
    return panel;
  }

  // =================================================================================
  // === CORE LOGIC ==================================================================
  // =================================================================================

  const sha256 = async (msg) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg)))).map(b => b.toString(16).padStart(2, '0')).join('');

  async function getImageHash(imgEl) {
    if (!imgEl?.src) return null;
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        [canvas.width, canvas.height] = [img.naturalWidth, img.naturalHeight];
        canvas.getContext('2d').drawImage(img, 0, 0);
        resolve(await sha256(canvas.toDataURL('image/png')));
      };
      img.onerror = () => resolve(null);
      img.src = imgEl.src;
    });
  }

  function pasteAnswer(answer) {
      const input = document.querySelector(INPUT_SELECTOR);
      const choice = [...document.querySelectorAll('label[role="option"]')]
          .find(l => l.innerText.trim().toLowerCase() === String(answer).toLowerCase());
      if (choice) choice.click();
      else if (input) {
          input.value = answer;
          input.dispatchEvent(new Event('input', { bubbles: true }));
      }
  }

  function findCorrectAnswerOnPage() {
      const wrongAnswerNode = document.evaluate("//*[contains(text(), 'The right answer is')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (wrongAnswerNode) {
          let fullAnswerText = wrongAnswerNode.innerText.split(/The right answer is/i)[1] || wrongAnswerNode.innerText;
          fullAnswerText = fullAnswerText.replace(/["“”.,]/g, '').trim();
          const firstAnswer = fullAnswerText.split(/\s+or\s+|\s*,\s*/i)[0].trim();
          const num = parseFloat(firstAnswer);
          if (!isNaN(num)) return String(num);
          return firstAnswer;
      }
      const rightAnswerNode = document.evaluate("//strong[contains(text(), \"That's right!\")]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (rightAnswerNode) {
          const selectedChoice = document.querySelector('label.selected[role="option"]');
          const isMarkedWrong = selectedChoice && selectedChoice.querySelector('svg [fill="#b3b3b3"]');
          if (isMarkedWrong) return null;
          const textInput = document.querySelector(INPUT_SELECTOR);
          if (textInput?.value) return textInput.value;
          if (selectedChoice) return selectedChoice.innerText.trim();
      }
      return null;
  }

  async function updatePanel() {
    try {
      const qContainer = document.querySelector('.question-container');
      const qEl = qContainer ? qContainer.querySelector(QUESTION_SELECTOR) : null;
      if (!qEl) {
        panel.innerHTML = `<div class="waiting-text">Searching for question...</div>`;
        return;
      }

      const text = qEl.innerText.trim();
      const imgHash = await getImageHash(qContainer.querySelector('img'));
      
      // **THE NEW COMBINED HASHING LOGIC**
      const combinedIdString = text + (imgHash || '');
      const questionId = await sha256(combinedIdString);
      
      const isNewQuestion = lastHash !== questionId;
      if (isNewQuestion) lastHash = questionId;

      let db = loadDB();
      let savedAnswer = db[questionId]?.answer || '';
      
      if (autoLearn) {
          const correctAnswerOnPage = findCorrectAnswerOnPage();
          if (correctAnswerOnPage && String(correctAnswerOnPage) !== savedAnswer) {
              savedAnswer = String(correctAnswerOnPage);
              db[questionId] = { answer: savedAnswer, correct: true };
              saveDB(db);
              showPanelMessage(`Answer learned: "${savedAnswer}"`);
          }
      }
      
      if (savedAnswer && isNewQuestion && !document.querySelector('.edit-answer-input:focus')) {
          pasteAnswer(savedAnswer);
      }

      panel.innerHTML = `
        <div class="question-text" title="${text}">${text}</div>
        <div class="saved-answer-display" id="saved-answer-container"></div>
        <div id="nav-container"></div>
      `;
      
      // **NEW: EDITABLE ANSWER BOX**
      const answerContainer = document.getElementById('saved-answer-container');
      if (savedAnswer) {
          answerContainer.innerHTML = `
              <div class="edit-answer-container">
                  <input type="text" value="${savedAnswer}" class="edit-answer-input" id="edit-answer-field">
                  <button class="edit-answer-save-btn" id="edit-answer-save">Save</button>
              </div>
          `;
          document.getElementById('edit-answer-save').onclick = () => {
              const newAnswer = document.getElementById('edit-answer-field').value;
              db = loadDB();
              db[questionId] = { answer: newAnswer, correct: true };
              saveDB(db);
              showPanelMessage(`Answer updated to "${newAnswer}"`);
          };
      } else {
          answerContainer.innerHTML = `<i>No answer in DB</i>`;
      }

      const allButtons = [...qContainer.querySelectorAll('button')];
      const pageNav = {
          submit: allButtons.find(btn => btn.innerText.trim().toLowerCase().startsWith('submit')),
          next: allButtons.find(btn => btn.innerText.includes('Next question')),
          finish: allButtons.find(btn => btn.innerText.includes('View quiz results'))
      };
      const navContainer = document.getElementById('nav-container');

      const handleAction = (button) => {
          lastHash = null;
          button.click();
      };
      
      if (isNewQuestion && autoFinish) {
          if (pageNav.submit && savedAnswer) return handleAction(pageNav.submit);
          if (pageNav.next) return handleAction(pageNav.next);
          if (pageNav.finish) return handleAction(pageNav.finish);
          if (autoLearn && !savedAnswer && pageNav.submit) {
              const firstChoice = document.querySelector('label[role="option"]');
              if (firstChoice) firstChoice.click(); else pasteAnswer("1");
              return handleAction(pageNav.submit);
          }
      }
      
      const createNavBtn = (text, el) => {
          const btn = document.createElement('button');
          btn.innerText = text;
          btn.className = 'nav-button';
          btn.style.marginTop = '10px';
          btn.onclick = () => handleAction(el);
          navContainer.appendChild(btn);
      };

      if (pageNav.submit) createNavBtn('Submit', pageNav.submit);
      else if (pageNav.next) createNavBtn('Next Question', pageNav.next);
      else if (pageNav.finish) createNavBtn('View Results', pageNav.finish);
    } catch (error) {
        console.error("Quiz Helper Script Error:", error);
        panel.innerHTML = `<div class="waiting-text" style="color: #e74c3c;">An error occurred. See console.</div>`;
    }
  }

  // --- INITIALIZATION ---
  const panel = buildUI();
  injectStyles();
  setInterval(updatePanel, 500);
})();
