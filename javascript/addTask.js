var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function (e) {
      /* When an item is clicked, update the original select box,
      and the selected item: */
      var y, i, k, s, h, sl, yl;
      s = this.parentNode.parentNode.getElementsByTagName("select")[0];
      sl = s.length;
      h = this.parentNode.previousSibling;
      for (i = 0; i < sl; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
          s.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          y = this.parentNode.getElementsByClassName("same-as-selected");
          yl = y.length;
          for (k = 0; k < yl; k++) {
            y[k].removeAttribute("class");
          }
          this.setAttribute("class", "same-as-selected");
          break;
        }
      }
      h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function (e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

document.addEventListener("click", closeAllSelect);


function closeAssigned() {
  document.getElementById('assignedContainer').classList.add('d-none');
  document.getElementById('selectedContact').classList.add('selected-contact');
  document.getElementById('selectedContact').classList.add('d-none');
}

function openAssigned(event) {
  event.stopPropagation(); // Verhindert, dass das Click-Event weitergeleitet wird
  document.getElementById('assignedContainer').classList.remove('d-none');
  document.getElementById('selectedContact').classList.remove('selected-contact');
  document.getElementById('selectedContact').classList.remove('d-none');
}

function clearTask() {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  taskContacts = [];
  document.getElementById('date').value = '';
  prio = '';
  document.getElementById('urgent').classList.remove('urgent')
  document.getElementById('medium').classList.remove('medium')
  document.getElementById('low').classList.remove('low')
  document.getElementById('imgMedium').src = './assets/img/add_task/result.svg';
  document.getElementById('imgUrgent').src = './assets/img/add_task/arrowsTop.svg';
  document.getElementById('imgLow').src = './assets/img/add_task/arrowsButtom.svg';
  subtasks = [];
  renderAddTaskContactInitials();
  renderSubtasksList();
}

function taskUrgent() {
  prio = 'Urgent';
  prioImg = './assets/img/add_task/arrowsTop.svg';
  document.getElementById('urgent').classList.add('urgent')
  document.getElementById('medium').classList.remove('medium')
  document.getElementById('low').classList.remove('low')
  document.getElementById('imgUrgent').src = './assets/img/add_task/arrow_white.svg';
  document.getElementById('imgMedium').src = './assets/img/add_task/result.svg';
  document.getElementById('imgLow').src = './assets/img/add_task/arrowsButtom.svg';
}

function taskMedium() {
  prio = 'Medium';
  prioImg = './assets/img/add_task/result.svg';
  document.getElementById('medium').classList.add('medium')
  document.getElementById('urgent').classList.remove('urgent')
  document.getElementById('low').classList.remove('low')
  document.getElementById('imgMedium').src = './assets/img/add_task/result_white.svg';
  document.getElementById('imgUrgent').src = './assets/img/add_task/arrowsTop.svg';
  document.getElementById('imgLow').src = './assets/img/add_task/arrowsButtom.svg';
}

function taskLow() {
  prio = 'Low';
  prioImg = './assets/img/add_task/arrowsButtom.svg';
  document.getElementById('low').classList.add('low')
  document.getElementById('urgent').classList.remove('urgent')
  document.getElementById('medium').classList.remove('medium')
  document.getElementById('imgLow').src = './assets/img/add_task/arrow_buttom_white.svg';
  document.getElementById('imgMedium').src = './assets/img/add_task/result.svg';
  document.getElementById('imgUrgent').src = './assets/img/add_task/arrowsTop.svg';
}

async function filterContacts(path = '') {
  let response = await fetch(`${firebaseUrl}.json`);
  let responseToJson = await response.json();

  let contacts = responseToJson.contacts;
  let contactsArray = Object.values(contacts);

  let search = document.getElementById('assignedSearch').value.toLowerCase();

  let content = document.getElementById('assignedContainer');
  content.innerHTML = '';

  for (let i = 0; i < contactsArray.length; i++) {
      let contact = contactsArray[i];
      let contactName = contact.name.toLowerCase();

      if (contactName.includes(search)) {
          let initials = contact.name.split(' ').map(word => word[0]).join('');
          let initialsBgColor = getRandomColor();
          if (search.length == 0) {
              renderContactsAddTask();
          } else {

              content.innerHTML += generateContactsSearchHtml(contact, initials, initialsBgColor, i);
          }
      }
  }
}

function generateContactsSearchHtml(contact, initials, initialsBgColor, i) {
  return `
  <div class="assigned-contact" id="contactTask${i}">
              <div class="contact-name">
                  <div style="background-color: ${initialsBgColor};" class="assigned-initials">${initials}</div>
                  <p>${contact.name}</p>
              </div>
              <input id="taskCheckbox${i}" onclick="addContactTask('${contact.name}', '${initials}', ${i}, '${initialsBgColor}')" class="checkbox" type="checkbox">
          </div>
  `;
}

function addNewSubtasks() {
  let subtask = document.getElementById('subtask');
  if (subtasks.length < 2) {
      if (subtask.value.length >= 1) {
          subtasks.push(subtask.value);
          subtask.value = '';
          renderSubtasksList();
      }
  }
}


function renderAddTaskContactInitials() {
  let content = document.getElementById('selectedContact');
  content.innerHTML = "";
  for (let i = 0; i < taskContacts.length; i++) {
      let contact = taskContacts[i];
      content.innerHTML += generateAddTaskContactInitialsHTML(contact);
  }
}

function generateAddTaskContactInitialsHTML(contact) {
  return `<div style="background-color: ${contact['color']};" class="assigned-initials">${contact['initials']}</div>`;
}

function renderSubtasksList() {
  let content = document.getElementById('subtasksList');
  content.innerHTML = '';
  for (let i = 0; i < subtasks.length; i++) {
      let subtask = subtasks[i];
      content.innerHTML += `<li>${subtask}</li>`;
  }
}
