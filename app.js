  let secret = 0, attempts = 0, maxNum = 100, gameOver = false, best = null;

  function startGame() {
    const v = parseInt(document.getElementById('maxInput').value);
    if (!v || v < 2) { showHint('info', 'ti-alert-circle', 'Enter a number greater than 1.'); return; }
    maxNum = v;
    secret = Math.floor(Math.random() * maxNum) + 1;
    attempts = 0;
    gameOver = false;
    document.getElementById('attemptCount').textContent = '0';
    document.getElementById('rangeVal').textContent = maxNum;
    document.getElementById('chipsRow').innerHTML = '';
    document.getElementById('guessInput').value = '';
    document.getElementById('guessInput').min = 1;
    document.getElementById('guessInput').max = maxNum;
    document.getElementById('progressFill').style.width = '0%';
    clearHint();
    document.getElementById('setupSection').style.display = 'none';
    document.getElementById('playSection').classList.add('show');
    setTimeout(() => document.getElementById('guessInput').focus(), 50);
  }

  function submitGuess() {
    if (gameOver) return;
    const raw = document.getElementById('guessInput').value.trim();
    const g = parseInt(raw);
    if (!raw || isNaN(g) || g < 1 || g > maxNum) {
      showHint('info', 'ti-alert-circle', 'Enter a number between 1 and ' + maxNum + '.');
      return;
    }
    attempts++;
    document.getElementById('attemptCount').textContent = attempts;
    document.getElementById('guessInput').value = '';
    const pct = Math.min(100, Math.round((attempts / (Math.ceil(Math.log2(maxNum)) + 2)) * 100));
    document.getElementById('progressFill').style.width = pct + '%';

    if (g === secret) {
      addChip(g, 'win');
      if (best === null || attempts < best) best = attempts;
      document.getElementById('bestStat').textContent = best;
      showHint('win', 'ti-trophy', 'Correct! The number was ' + secret + '. You got it in ' + attempts + ' attempt' + (attempts === 1 ? '' : 's') + '!');
      gameOver = true;
    } else if (g < secret) {
      addChip(g, 'low');
      showHint('low', 'ti-arrow-big-up', 'Too small — go higher.');
      document.getElementById('guessInput').focus();
    } else {
      addChip(g, 'high');
      showHint('high', 'ti-arrow-big-down', 'Too large — go lower.');
      document.getElementById('guessInput').focus();
    }
  }

  function addChip(value, type) {
    const c = document.createElement('span');
    c.className = 'chip ' + type;
    c.textContent = value;
    document.getElementById('chipsRow').appendChild(c);
  }

  function showHint(type, icon, msg) {
    const b = document.getElementById('hintBar');
    b.className = 'hint show ' + type;
    document.getElementById('hintIcon').className = 'ti ' + icon;
    document.getElementById('hintText').textContent = msg;
  }

  function clearHint() {
    document.getElementById('hintBar').className = 'hint';
  }

  function quitGame() {
    if (gameOver) return;
    showHint('info', 'ti-eye', 'You quit. The secret number was ' + secret + '.');
    gameOver = true;
  }

  function resetToSetup() {
    document.getElementById('setupSection').style.display = 'block';
    document.getElementById('playSection').classList.remove('show');
    clearHint();
  }

  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    if (document.getElementById('playSection').classList.contains('show')) submitGuess();
    else startGame();
  });