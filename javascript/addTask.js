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

/**
 * This function closes the pop-up window for contacts in the "Assigned to" section.
 */
function closeAssigned() {
  document.getElementById('assignedContainer').classList.add('d-none');
  document.getElementById('selectedContact').classList.add('selected-contact');
  document.getElementById('selectedContact').classList.remove('d-none');
}

/**
 * This function opens the pop-up window for contacts in the "Assigned to" section.
 * 
 * @param {Event} event - The event object representing the user interaction.
 */
function openAssigned(event) {
  event.stopPropagation();
  document.getElementById('assignedContainer').classList.remove('d-none');
  document.getElementById('selectedContact').classList.remove('selected-contact');
  document.getElementById('selectedContact').classList.add('d-none');
}

/**
 * This function clears the content of all entered fields in the task form.
 */
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

/**
 * This function saves the priority text as a variable (in this case the string 'Urgent') 
 * and the corresponding image. It updates the UI to reflect the selected priority.
 */
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

/**
 * This function saves the priority text as a variable (in this case the string 'Medium') 
 * and the corresponding image. It updates the UI to reflect the selected priority.
 */
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

/**
 * This function saves the priority text as a variable (in this case the string 'Low') 
 * and the corresponding image. It updates the UI to reflect the selected priority.
 */
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

/**
 * This function filters the contacts for the "Assigned to" section in the pop-up window.
 * 
 * @param {string} path - The path to append to the Firebase URL for fetching contacts.
 */
async function filterContacts(path = '') {
  let contacts = await fetchContacts(path);
  let filteredContacts = filterContactsBySearch(contacts);
  renderFilteredContacts(filteredContacts);
}

/**
* Fetches the contacts from Firebase.
* 
* @param {string} path - The path to append to the Firebase URL for fetching contacts.
* @returns {Array} The array of contacts.
*/
async function fetchContacts(path) {
  let response = await fetch(`${firebaseUrl}.json`);
  let responseToJson = await response.json();
  return Object.values(responseToJson.contacts);
}

/**
* Filters the contacts based on the search query.
* 
* @param {Array} contacts - The array of contacts.
* @returns {Array} The array of filtered contacts.
*/
function filterContactsBySearch(contacts) {
  let search = document.getElementById('assignedSearch').value.toLowerCase();
  return contacts.filter(contact => contact.name.toLowerCase().includes(search));
}

/**
* Renders the filtered contacts in the "Assigned to" section.
* 
* @param {Array} contacts - The array of filtered contacts.
*/
function renderFilteredContacts(contacts) {
  let content = document.getElementById('assignedContainer');
  content.innerHTML = '';

  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let initials = getInitials(contact.name);
    let initialsBgColor = getRandomColor();

    content.innerHTML += generateContactsSearchHtml(contact, initials, initialsBgColor, i);
  }

  if (document.getElementById('assignedSearch').value.length === 0) {
    renderContactsAddTask();
  }
}

/**
* Gets the initials of a contact name.
* 
* @param {string} name - The name of the contact.
* @returns {string} The initials of the contact.
*/
function getInitials(name) {
  return name.split(' ').map(word => word[0]).join('');
}

/**
 * Generates the HTML for a contact card to be displayed in the search results for the "Assigned to" section.
 * 
 * @param {Object} contact - The contact object containing the contact details.
 * @param {string} initials - The initials of the contact.
 * @param {string} initialsBgColor - The background color for the contact's initials.
 * @param {number} i - The index of the contact in the contact list.
 * @returns {string} The generated HTML string for the contact card in the search results.
 */
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

/**
 * This function generates a new subtask and adds it to the list of subtasks.
 */
function addNewSubtasks() {
  let subtaskInput = document.getElementById('subtask');
  if (subtasks.length < 2) {
    if (subtaskInput.value.length >= 1) {
      let newSubtask = {
        'title': subtaskInput.value,
        'state': false
      };
      subtasks.push(newSubtask);
      subtaskInput.value = '';
      renderSubtasksList();
    }
  }
}

/**
 * This function renders the created subtasks and displays them in the content area.
 */
function renderSubtasksList() {
  let content = document.getElementById('subtasksList');
  content.innerHTML = '';
  for (let i = 0; i < subtasks.length; i++) {
    let subtask = subtasks[i];
    content.innerHTML += generateSubtaskHtml(subtask, i);
  }
}

function generateSubtaskHtml(subtask, i) {
  return `
  <div class="edit-subtask-container" id="subtaskEditContainer${i}">
    <li onkeydown="checkSubtasksEditLength(${i})" id="subtaskTitle${i}" contenteditable="false" onblur="saveSubtaskTitle(${i})">${subtask.title}</li>
    <div class="subtask-edit-svg" id="subtaskSvg">
      <img onclick="editSubtask(${i})" src="./assets/img/edit.svg">
      <div class="subtask-edit-line"></div>
      <img onclick="deleteSubtask(${i})" src="./assets/img/add_task/delete.svg">
    </div>
  </div>
  `;
}

function editSubtask(i) {
  let subtaskTitle = document.getElementById(`subtaskTitle${i}`);
  subtaskTitle.contentEditable = "true";
  subtaskTitle.focus();
}

function saveSubtaskTitle(i) {
  if (subtasks && i >= 0 && i < subtasks.length) {
    let subtaskTitle = document.getElementById(`subtaskTitle${i}`);
    if (subtaskTitle) {
      subtasks[i].title = subtaskTitle.innerText;
      subtaskTitle.contentEditable = "false";
    } else {
      console.error("Element mit ID subtaskTitle" + i + " existiert nicht im DOM.");
    }
  } else {
    console.error("subtasks Array ist nicht definiert oder der Index " + i + " ist außerhalb der Grenzen.");
  }
}

function deleteSubtask(i) {
  subtasks.splice(i, 1); // Verwende das globale 'subtasks' Array
  renderSubtasksList();
}

/**
 * This function renders the initials for the contacts in the "Assigned to" section.
 */
function renderAddTaskContactInitials() {
  let content = document.getElementById('selectedContact');
  content.innerHTML = "";
  for (let i = 0; i < taskContacts.length; i++) {
    let contact = taskContacts[i];
    content.innerHTML += generateAddTaskContactInitialsHTML(contact);
  }
}

/**
 * Generates the HTML for displaying the initials of a contact in the "Assigned to" section.
 * 
 * @param {Object} contact - The contact object containing the contact details.
 * @returns {string} The generated HTML string for the contact's initials.
 */
function generateAddTaskContactInitialsHTML(contact) {
  return `<div style="background-color: ${contact['color']};" class="assigned-initials">${contact['initials']}</div>`;
}

function checkDescriptionLength() {
  let description = document.getElementById('description').value;

  if (description.length > 300) {
    document.getElementById('description').value = description.substring(0, 300);
    document.getElementById('descriptionLengthMessage').innerHTML = `Sie haben ${description.length} Zeichen von Maximal 300`;
    document.getElementById('descriptionLengthMessage').style.color = 'red';
  } else {
    document.getElementById('descriptionLengthMessage').innerHTML = `Sie haben ${description.length} Zeichen von Maximal 300`;
    document.getElementById('descriptionLengthMessage').style.color = 'green';

  }
}

function checkTitelLength() {
  let description = document.getElementById('title').value;

  if (description.length > 30) {
    document.getElementById('title').value = description.substring(0, 30);
    document.getElementById('titelLengthMessage').innerHTML = `Sie haben ${description.length} Zeichen von Maximal 30`;
    document.getElementById('titelLengthMessage').style.color = 'red';
  } else {
    document.getElementById('titelLengthMessage').innerHTML = `Sie haben ${description.length} Zeichen von Maximal 30`;
    document.getElementById('titelLengthMessage').style.color = 'green';

  }
}

function checkSubtasksLength() {
  let description = document.getElementById('subtask').value;

  if (description.length > 40) {
    document.getElementById('subtask').value = description.substring(0, 40);
    document.getElementById('subtask').value = description.substring(0, 40);
  }
}

function checkSubtasksEditLength(i) {
  let description = document.getElementById(`subtaskTitle${i}`).innerHTML;

  if (description.length > 40) {
    document.getElementById(`subtaskTitle${i}`).innerHTML = description.substring(0, 40);
  }
}