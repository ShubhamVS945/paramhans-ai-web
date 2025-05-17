let modelReady = false, model;

// 1. ब्राउज़र में GPT4All.js मॉडल लोड करें
(async () => {
  model = await GPT4All.load({
    model: "gpt4all-lora-quantized.bin", // रिपो रूट में रखें
    wasm: true
  });
  modelReady = true;
  document.getElementById('askBtn').textContent = 'पूछो';
})();

// 2. “पूछो” बटन हैंडलर
document.getElementById('askBtn').addEventListener('click', async () => {
  if (!modelReady) {
    alert('मॉडल अभी लोड हो रहा है, थोड़ी देर में फिर पूछें।');
    return;
  }
  const q = document.getElementById('question').value.trim();
  if (!q) { alert('पहले सवाल लिखें!'); return; }

  // UI अपडेट
  document.getElementById('answers').classList.add('hidden');
  document.getElementById('shortAns').textContent = 'Loading…';
  document.getElementById('longAns').textContent = 'Loading…';

  // 3. Short Answer: prompt में कहें "Short:" 
  const shortAns = await model.chat(`Short: ${q}`);
  document.getElementById('shortAns').textContent = shortAns;

  // 4. Long Answer: prompt में कहें "Long:"
  const longAns = await model.chat(`Long: ${q}`);
  document.getElementById('longAns').textContent = longAns;

  // 5. जवाब दिखाओ + PDF बटन दिखाओ
  document.getElementById('answers').classList.remove('hidden');
});

// 6. PDF बनाएँ
document.getElementById('pdfBtn').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const q = document.getElementById('question').value.trim();
  const shortText = document.getElementById('shortAns').textContent;
  const longText = document.getElementById('longAns').textContent;

  let y = 20;
  doc.setFontSize(18);
  doc.text('Certificate of Answer', 105, y, { align: 'center' });
  y += 10;
  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString('hi-IN')}`, 180, y);
  y += 10;
  doc.setFontSize(14);
  doc.text(`Question: ${q}`, 10, y);
  y += 10;
  doc.text('Short Answer:', 10, y);
  y += 6;
  doc.setFontSize(12);
  doc.text(doc.splitTextToSize(shortText, 180), 10, y);
  y += doc.splitTextToSize(shortText, 180).length * 6 + 4;
  doc.setFontSize(14);
  doc.text('Long Answer:', 10, y);
  y += 6;
  doc.setFontSize(12);
  doc.text(doc.splitTextToSize(longText, 180), 10, y);

  doc.save('answer_certificate.pdf');
});
