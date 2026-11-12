document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (form)
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      document.getElementById("formMessage").textContent =
        "Thank you. Your message has been noted on this page.";
      form.reset();
    });
  const tf = document.getElementById("taskForm");
  if (!tf) return;
  const input = document.getElementById("taskInput"),
    list = document.getElementById("taskList"),
    buttons = [...document.querySelectorAll("[data-filter]")];
  let tasks = JSON.parse(localStorage.getItem("peculiarPlannerTasks") || "[]"),
    filter = "all";
  const save = () =>
    localStorage.setItem("peculiarPlannerTasks", JSON.stringify(tasks));
  function render() {
    list.replaceChildren();
    const shown = tasks.filter(
      (t) => filter === "all" || (filter === "done" ? t.done : !t.done),
    );
    if (!shown.length) {
      const p = document.createElement("p");
      p.textContent = "Nothing here yet. Add a task when you’re ready.";
      list.append(p);
    }
    shown.forEach((t) => {
      const row = document.createElement("div");
      row.className = "task" + (t.done ? " done" : "");
      const c = document.createElement("input");
      c.type = "checkbox";
      c.checked = t.done;
      c.setAttribute("aria-label", "Mark task complete");
      c.addEventListener("change", () => {
        t.done = c.checked;
        save();
        render();
      });
      const s = document.createElement("span");
      s.textContent = t.text;
      const ed = document.createElement("button");
      ed.textContent = "Edit";
      ed.type = "button";
      ed.addEventListener("click", () => {
        const v = prompt("Edit task", t.text);
        if (v && v.trim()) {
          t.text = v.trim();
          save();
          render();
        }
      });
      const del = document.createElement("button");
      del.textContent = "Delete";
      del.type = "button";
      del.addEventListener("click", () => {
        tasks = tasks.filter((x) => x.id !== t.id);
        save();
        render();
      });
      row.append(c, s, ed, del);
      list.append(row);
    });
  }
  tf.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    tasks.push({ id: Date.now(), text: v, done: false });
    save();
    input.value = "";
    render();
  });
  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      filter = b.dataset.filter;
      buttons.forEach((x) => x.classList.toggle("active", x === b));
      render();
    }),
  );
  render();
});
