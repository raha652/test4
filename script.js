// 🔗 لینک Google Script
const SHEET_URL = "https://script.google.com/macros/s/AKfycbwoUzsiBbpIZYMnBDKSnx2BMwJWn26Ga0bBgR79W6aXcsEowywIWIaqaLVMskvEnwFK4g/exec";

// 🔗 اطلاعات ربات تلگرام
const BOT_TOKEN = "7206337280:AAFSQlCNgFY5Rc4oebhrHz8IjDw6N0DNGR4";
const CHAT_ID = "-1002503401953"; // آیدی گروه
const THREAD_ID = 4; // آیدی تاپیک

// دکمه فرم
document.getElementById("formBtn").addEventListener("click", () => {
  document.getElementById("reportForm").classList.remove("hidden");
  document.getElementById("uploadForm").classList.add("hidden");
});

// دکمه آپلود
document.getElementById("uploadBtn").addEventListener("click", () => {
  document.getElementById("uploadForm").classList.remove("hidden");
  document.getElementById("reportForm").classList.add("hidden");
});

// فرم گزارش به Google Sheet
document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = {
    technician: document.getElementById("technician").value,
    technician_assistant: document.getElementById("technician_assistant").value,
    task: document.getElementById("task").value,
    activity: document.getElementById("activity").value,
    device_details: document.getElementById("device_details").value,
    date: document.getElementById("date").value,
    employee_id: document.getElementById("employee_id").value,
    base: document.getElementById("base").value
  };

  fetch(SHEET_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
    .then(res => res.json())
    .then(data => {
      if (data.result === "success") {
        document.getElementById("formStatus").textContent = "✅ ارسال شد.";
        this.reset();
      } else {
        document.getElementById("formStatus").textContent = "❌ خطا در ارسال.";
      }
      setTimeout(() => document.getElementById("formStatus").textContent = "", 3000);
    })
    .catch(err => {
      console.error(err);
      document.getElementById("formStatus").textContent = "❌ خطا در ارسال.";
    });
});

// فرم آپلود فایل به تلگرام
document.getElementById("uploadForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData();
  const file = this.media.files[0];

  formData.append("chat_id", CHAT_ID);
  formData.append("message_thread_id", THREAD_ID);

  if (file.type.startsWith("video/")) {
    formData.append("video", file);
  } else {
    formData.append("photo", file);
  }

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/send${file.type.startsWith("video/") ? "Video" : "Photo"}`, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("uploadStatus").textContent = "✅ فایل ارسال شد.";
      this.reset();
      setTimeout(() => document.getElementById("uploadStatus").textContent = "", 3000);
    })
    .catch(err => {
      console.error(err);
      document.getElementById("uploadStatus").textContent = "❌ خطا در ارسال فایل.";
    });
});
