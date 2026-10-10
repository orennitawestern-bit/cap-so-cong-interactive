(() => {
      const lessons = {
        definition: {
          eyebrow: "KHÁM PHÁ ĐỊNH NGHĨA",
          title: "Trực quan hóa Cấp số cộng",
          prompt: "Mỗi số hạng được tạo bằng cách cộng cùng một công sai d vào số hạng đứng trước.",
          values: ["u₁", "u₂", "u₃", "u₄", "u₅"],
          jump: "+ d",
          formula: "u<sub>n</sub> = u<sub>n−1</sub> + d",
          note: "Công sai d không đổi với mọi n ≥ 2.",
          steps: [
            ["Bắt đầu từ số hạng đầu", "Chọn số hạng đầu u₁ làm điểm xuất phát trên trục số."],
            ["Cộng cùng một công sai", "Từ u₁, cộng thêm d để nhận được số hạng kế tiếp u₂."],
            ["Lặp lại quy tắc", "Tiếp tục cộng d: u₃ = u₂ + d, rồi u₄ = u₃ + d."],
            ["Nhận ra quy luật", "Khoảng cách giữa hai số hạng liên tiếp luôn bằng d."]
          ],
          interval: 950,
          caption: "Quy luật lặp lại qua từng số hạng"
        },
        example1: {
          eyebrow: "VÍ DỤ 1 · TÌM CÁC SỐ HẠNG",
          title: "Minh họa từng bước: Ví dụ 1",
          prompt: "Cho cấp số cộng có u₁ = 2, d = 3. Viết năm số hạng đầu.",
          values: ["2", "5", "8", "11", "14"],
          jump: "+ 3",
          formula: "u<sub>n</sub> = u<sub>n−1</sub> + 3",
          note: "Bắt đầu từ 2, mỗi lần tăng thêm 3.",
          steps: [
            ["Bước 1 · Số hạng đầu", "u₁ = 2."],
            ["Bước 2 · Tìm u₂", "u₂ = u₁ + d = 2 + 3 = 5."],
            ["Bước 3 · Tìm u₃", "u₃ = u₂ + d = 5 + 3 = 8."],
            ["Bước 4 · Tìm u₄", "u₄ = u₃ + d = 8 + 3 = 11."],
            ["Bước 5 · Tìm u₅", "u₅ = u₄ + d = 11 + 3 = 14."]
          ],
          interval: 1150,
          caption: "Mỗi bước nhảy có độ dài d = 3"
        },
        example2: {
          eyebrow: "VÍ DỤ 2 · CHỨNG MINH VÀ TÌM d",
          title: "Chứng minh dãy là cấp số cộng",
          prompt: "Cho uₙ = 5n − 1. Xét hiệu hai số hạng liên tiếp, rồi tìm u₁ và công sai.",
          values: ["4", "9", "14", "19", "24"],
          jump: "+ 5",
          formula: "u<sub>n</sub> − u<sub>n−1</sub> = 5",
          note: "Hiệu không đổi ⇒ d = 5; u₁ = 5 · 1 − 1 = 4.",
          steps: [
            ["Viết hiệu liên tiếp", "uₙ − uₙ₋₁ = (5n − 1) − [5(n − 1) − 1]."],
            ["Rút gọn biểu thức", "uₙ − uₙ₋₁ = 5n − 1 − (5n − 6) = 5."],
            ["Kết luận công sai", "Hiệu không đổi với mọi n ≥ 2 nên dãy là CSC, d = 5."],
            ["Tìm số hạng đầu", "u₁ = 5 · 1 − 1 = 4. Dãy bắt đầu: 4, 9, 14, 19, 24."]
          ],
          interval: 1350,
          caption: "Các số hạng tăng đều với công sai 5"
        },
        practice: {
          eyebrow: "LUYỆN TẬP 1 · TỰ KHÁM PHÁ",
          title: "Tìm công sai của dãy số",
          prompt: "Cho uₙ = −2n + 3. Tìm u₁, công sai d và quan sát các số hạng đầu.",
          values: ["1", "−1", "−3", "−5", "−7"],
          jump: "− 2",
          formula: "u₁ = 1, d = −2",
          note: "Dãy giảm 2 đơn vị ở mỗi bước.",
          steps: [
            ["Tìm số hạng đầu", "Thay n = 1: u₁ = −2 · 1 + 3 = 1."],
            ["Tìm số hạng tiếp theo", "u₂ = −2 · 2 + 3 = −1, vậy d = u₂ − u₁ = −2."],
            ["Kiểm tra hiệu", "uₙ − uₙ₋₁ = (−2n + 3) − [−2(n − 1) + 3] = −2."],
            ["Kết luận", "Đây là cấp số cộng có u₁ = 1, d = −2; các số hạng giảm đều."]
          ],
          interval: 1250,
          caption: "Mỗi bước nhảy lùi 2 đơn vị"
        }
      };

      const $ = (selector) => document.querySelector(selector);
      const markers = [...document.querySelectorAll(".play-marker")];
      const emptyState = $("#empty-state");
      const lessonView = $("#lesson-view");
      const sequenceItems = $("#sequence-items");
      const playButton = $("#play-button");
      const stepButton = $("#step-button");
      const replayButton = $("#replay-button");
      let activeLesson = null;
      let currentStep = 0;
      let timer = null;
      let zoom = 1;

      function setPlaying(playing) {
        if (timer) window.clearInterval(timer);
        timer = null;
        playButton.innerHTML = playing ? "Ⅱ&nbsp; Tạm dừng" : "▶&nbsp; Tiếp tục";
        playButton.setAttribute("aria-label", playing ? "Tạm dừng minh họa" : "Tiếp tục minh họa");
        $("#player-status").textContent = playing ? "Đang phát minh họa" : (currentStep >= activeLesson.steps.length ? "Đã hoàn thành" : "Đã tạm dừng");
        if (playing && currentStep < activeLesson.steps.length) {
          timer = window.setInterval(advanceStep, activeLesson.interval);
        }
      }

      function renderStep() {
        const lesson = activeLesson;
        const visibleCount = Math.min(currentStep + 1, lesson.values.length);
        [...sequenceItems.querySelectorAll(".sequence-item")].forEach((item, index) => {
          item.classList.toggle("revealed", index < visibleCount);
          item.classList.toggle("current", index === visibleCount - 1 && visibleCount > 0);
        });
        [...sequenceItems.querySelectorAll(".sequence-arrow")].forEach((arrow, index) => {
          arrow.classList.toggle("visible", index < Math.max(0, visibleCount - 1));
        });

        const step = lesson.steps[Math.min(currentStep, lesson.steps.length - 1)];
        $("#step-index").textContent = currentStep === 0 ? "1" : String(Math.min(currentStep + 1, lesson.steps.length));
        $("#step-title").textContent = step[0];
        $("#step-copy").textContent = step[1];
        $("#viz-counter").textContent = `${visibleCount} / ${lesson.values.length} số hạng`;
        $("#progress-fill").style.width = `${Math.min(100, currentStep / lesson.steps.length * 100)}%`;
        if (currentStep >= lesson.steps.length) {
          $("#player-status").textContent = "Đã hoàn thành";
          playButton.innerHTML = "✓&nbsp; Hoàn thành";
          playButton.setAttribute("aria-label", "Minh họa đã hoàn thành");
          playButton.disabled = true;
          if (timer) window.clearInterval(timer);
          timer = null;
        }
      }

      function advanceStep() {
        if (currentStep >= activeLesson.steps.length) {
          setPlaying(false);
          return;
        }
        currentStep += 1;
        renderStep();
        if (currentStep >= activeLesson.steps.length && timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      function selectLesson(id) {
        if (timer) window.clearInterval(timer);
        timer = null;
        activeLesson = { ...lessons[id], id };
        currentStep = 0;
        emptyState.hidden = true;
        lessonView.classList.add("visible");
        markers.forEach((marker) => {
          const selected = marker.dataset.lesson === id;
          marker.classList.toggle("active", selected);
          marker.setAttribute("aria-pressed", String(selected));
        });
        $("#lesson-eyebrow").textContent = activeLesson.eyebrow;
        $("#lesson-title").textContent = activeLesson.title;
        $("#lesson-prompt").textContent = activeLesson.prompt;
        $("#viz-caption").textContent = activeLesson.caption;
        $("#legend-jump").textContent = `Mỗi bước ${activeLesson.jump}`;
        $("#math-line").innerHTML = activeLesson.formula;
        $("#formula-note").textContent = activeLesson.note;
        sequenceItems.replaceChildren();
        activeLesson.values.forEach((value, index) => {
          const item = document.createElement("div");
          item.className = "sequence-item";
          item.innerHTML = `<span class="number-box"></span><span class="term-label">u<sub>${index + 1}</sub></span>`;
          item.querySelector(".number-box").textContent = value;
          sequenceItems.append(item);
          if (index < activeLesson.values.length - 1) {
            const arrow = document.createElement("div");
            arrow.className = "sequence-arrow";
            arrow.innerHTML = `<span aria-hidden="true">→</span><small>${activeLesson.jump}</small>`;
            sequenceItems.append(arrow);
          }
        });
        playButton.disabled = false;
        playButton.innerHTML = "Ⅱ&nbsp; Tạm dừng";
        playButton.setAttribute("aria-label", "Tạm dừng minh họa");
        renderStep();
        $("#player-status").textContent = "Đang phát minh họa";
        timer = window.setInterval(advanceStep, activeLesson.interval);
      }

      markers.forEach((marker) => marker.addEventListener("click", () => selectLesson(marker.dataset.lesson)));
      stepButton.addEventListener("click", () => {
        if (!activeLesson) return;
        if (currentStep >= activeLesson.steps.length) {
          currentStep = 0;
          playButton.disabled = false;
        }
        if (timer) window.clearInterval(timer);
        timer = null;
        advanceStep();
        if (currentStep < activeLesson.steps.length) {
          playButton.innerHTML = "▶&nbsp; Tiếp tục";
          playButton.disabled = false;
          playButton.setAttribute("aria-label", "Tiếp tục minh họa");
          $("#player-status").textContent = "Đang xem từng bước";
        }
      });
      playButton.addEventListener("click", () => {
        if (!activeLesson) return;
        if (currentStep >= activeLesson.steps.length) {
          currentStep = 0;
          playButton.disabled = false;
          renderStep();
        }
        setPlaying(playButton.innerHTML.includes("▶"));
      });
      replayButton.addEventListener("click", () => {
        if (!activeLesson) return;
        currentStep = 0;
        playButton.disabled = false;
        renderStep();
        setPlaying(true);
      });

      $("#zoom-in").addEventListener("click", () => {
        zoom = Math.min(1.2, +(zoom + .05).toFixed(2));
        $("#book-page").style.transform = `scale(${zoom})`;
        $("#book-page").style.transformOrigin = "top center";
      });
      $("#zoom-out").addEventListener("click", () => {
        zoom = Math.max(.85, +(zoom - .05).toFixed(2));
        $("#book-page").style.transform = `scale(${zoom})`;
        $("#book-page").style.transformOrigin = "top center";
      });
      $("#pdf-toggle").addEventListener("click", () => {
        const stage = $("#book-stage");
        if (stage.dataset.pdf === "true") {
          window.location.reload();
          return;
        }
        const embed = document.createElement("iframe");
        embed.title = "Tài liệu PDF Cấp số cộng";
        embed.src = "assets/cap-so-cong.pdf";
        embed.style.cssText = "position:absolute;inset:12px;width:calc(100% - 24px);height:calc(100% - 34px);border:0;border-radius:6px;background:#fff";
        stage.querySelector(".book-page").hidden = true;
        stage.append(embed);
        stage.dataset.pdf = "true";
        $("#pdf-toggle").textContent = "Trang mẫu";
      });
    })();
