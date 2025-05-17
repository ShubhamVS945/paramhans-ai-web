// 1. LLM लोड (gpt4all.js WASM मॉडल)
// मॉडल बिनरी रिपो में रखो और URL एडजस्ट करो अगर ज़रूरत हो
let model;
(async () => {
  model = await GPT4All.load({
    model: "gpt4all-lora-quantized.bin", // रिपो रूट में रखो
    wasm: true
  });
})();

// 2. Text QA
async function askText() {
  const q = document.getElementById("textQ").value.trim();
  if (!q) return alert("पहले सवाल लिखें!");
  document.getElementById("textA").textContent = "सोच रहा हूँ…";
  const ans = await model.chat(q);
  document.getElementById("textA").textContent = ans;
}

// 3. Image OCR + QA
async function askImage() {
  const file = document.getElementById("imgInput").files[0];
  if (!file) return alert("पहले फोटो चुनें!");
  document.getElementById("imgA").textContent = "OCR हो रहा है…";
  const { data: { text } } = await Tesseract.recognize(file);
  document.getElementById("imgA").textContent = "OCR: " + text + "\n\nसोच रहा हूँ…";
  const ans = await model.chat(text);
  document.getElementById("imgA").textContent += "\n\nउत्तर: " + ans;
}

// 4. PDF Certificate
function generateCert() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const q = document.getElementById("certQ").value.trim();
  if (!q) return alert("प्रश्न लिखें!");
  doc.setFontSize(22);
  doc.text("Certificate of Answer", 105, 20, { align: "center" });
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
