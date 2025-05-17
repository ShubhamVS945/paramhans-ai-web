// 1. LLM इनीशियलाइज़ (gpt4all.js उदाहरण)
let model;
async function loadModel() {
  model = await GPT4All.load({ 
    model: "gpt4all-lora-quantized.bin"  // small क्वांट फाइल GitHub Repo में रखें
  });
}
loadModel();

// 2. Text QA
async function askText() {
  const q = document.getElementById("textQ").value.trim();
  if (!q) return alert("पहले सवाल डालें!");
  document.getElementById("textA").textContent = "Loading…";
  const ans = await model.chat(q);
  document.getElementById("textA").textContent = ans;
}

// 3. Image OCR + QA
async function askImage() {
  const file = document.getElementById("imgInput").files[0];
  if (!file) return alert("पहले फोटो अपलोड करें!");
  document.getElementById("imgA").textContent = "OCR रन हो रहा है…";
  const { data: { text } } = await Tesseract.recognize(file);
  document.getElementById("imgA").textContent = "OCR: " + text + "\n\nAI सोच रहा है…";
  const ans = await model.chat(text);
  document.getElementById("imgA").textContent += "\n\nउत्तर: " + ans;
}

// 4. Certificate जनरेट
function generateCert() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const q = document.getElementById("certQ").value.trim();
  if (!q) return alert("प्रश्न डालें!");
  doc.setFontSize(22);
  doc.text("Certificate of Answer", 105, 20, null, null, "center");
  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString("hi-IN")}`, 180, 30);
  doc.setFontSize(14);
  doc.text(`प्रश्न: ${q}`, 10, 50);
  doc.text("उत्तर:", 10, 60);
  model.chat(q).then(ans => {
    const lines = doc.splitTextToSize(ans, 180);
    doc.text(lines, 10, 70);
    doc.save("certificate.pdf");
  });
}
