document.addEventListener('DOMContentLoaded', () => {
  let list = JSON.parse(localStorage.getItem('list')) || [];

  const add_button = document.getElementById('add_task');
  const clear_button = document.getElementById('save_button');
  const task_section = document.getElementById('tasks');
  const task_division = document.getElementById('tasks_space');
  const input_space = document.getElementById('inp');
  const input_div = document.getElementById('input_div');
  const enter_button = document.getElementById('enter_button');

  display_tasks();

  clear_button.addEventListener('click', () => {
    if (list.length === 0) {
      alert('list is already empty');
    } else {
      list = [];
      localStorage.removeItem('list');
      display_tasks();
    }
  });

  add_button.addEventListener('click', () => {
    input_div.style.display = 'flex';
    input_space.focus();
  });

  enter_button.addEventListener('click', () => {
    const input_text = input_space.value.trim();
    if (input_text === '') {
      alert('enter a task to add in list');
      input_div.style.display = 'none';
    } else {
      const new_task = {
        id: Date.now(),
        content: input_text,
        completed: false
      };
      list.push(new_task);
      save_tasks();
      display_tasks();
      input_space.value = '';
      input_div.style.display = 'none';
    }
  });

  function save_tasks() {
    localStorage.setItem('list', JSON.stringify(list));
  }

  function display_tasks() {
    task_section.innerHTML = '';

    if (list.length !== 0) {
      task_division.style.display = 'block';

      list.forEach(task => {
        // outer wrapper (you had 'one_of_all')
        const task_div = document.createElement('div');
        task_div.className = 'one_of_all';

        // inner container
        const el = document.createElement('div');
        el.className = 'task_element';
        if (task.completed) el.classList.add('completed');

        // input (use property instead of injecting into innerHTML)
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.content;
        input.id = `input-${task.id}`;
        input.disabled = true;
        input.className = 'task_input';

        // edit/save button
        const editBtn = document.createElement('button');
        editBtn.id = `edit-${task.id}`;
        editBtn.className = 'edit_button';
        editBtn.textContent = 'Edit';
        editBtn.dataset.mode = 'edit'; // 'edit' or 'save'

        // done/undo button
        const doneBtn = document.createElement('button');
        doneBtn.id = `done-${task.id}`;
        doneBtn.className = 'done_button';
        doneBtn.textContent = task.completed ? 'Undo' : 'Done';

        // delete button
        const delBtn = document.createElement('button');
        delBtn.id = `delete-${task.id}`;
        delBtn.className = 'delete_button';
        delBtn.textContent = 'Delete';

        // assemble
        el.appendChild(input);
        el.appendChild(editBtn);
        el.appendChild(doneBtn);
        el.appendChild(delBtn);
        task_div.appendChild(el);
        task_section.appendChild(task_div);

        // --------------- Event listeners for this task ----------------

        // Edit / Save logic
        editBtn.addEventListener('click', () => {
          if (editBtn.dataset.mode === 'edit') {
            input.disabled = false;
            input.focus();
            editBtn.textContent = 'Save';
            editBtn.dataset.mode = 'save';
            // put caret at end
            input.selectionStart = input.selectionEnd = input.value.length;
          } else {
            const newContent = input.value.trim();
            if (newContent === '') {
              alert("Task can't be empty");
              input.focus();
              return;
            }
            list = list.map(t => (t.id === task.id ? { ...t, content: newContent } : t));
            save_tasks();
            display_tasks(); // re-render
          }
        });

        // Save on Enter while editing
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !input.disabled) {
            e.preventDefault();
            editBtn.click(); // trigger save flow
          }
        });

        // Done / Undo logic
        doneBtn.addEventListener('click', () => {
          list = list.map(t => (t.id === task.id ? { ...t, completed: !t.completed } : t));
          save_tasks();
          display_tasks();
        });

        // Delete logic
        delBtn.addEventListener('click', () => {
          list = list.filter(t => t.id !== task.id);
          save_tasks();
          display_tasks();
        });

      }); // end forEach

    } else {
      task_division.style.display = 'none';
    }
  }

});
