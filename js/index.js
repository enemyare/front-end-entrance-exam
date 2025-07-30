function downloadPDF() {
  const element = document.getElementById('resume-content');

  const options = {
    margin: [10, 30, 0, 30],
    filename: 'Karthik_SR_Portfolio.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  };
  html2pdf().set(options).from(element).save();
}

document.addEventListener('DOMContentLoaded', function() {
  initializeEditing();
});

function initializeEditing() {
  addUniqueIdentifiers();
  loadSavedData();
  addEventListeners();
}

function addUniqueIdentifiers() {
  const editableSelectors = [
    '.introduction__greetings',
    '.introduction__name',
    '.introduction__position',
    '.languages__name',
    '.experience__period',
    '.experience__position',
    '.experience__tags',
    '.experience__description li',
    '.education__card-title',
    '.education__card-date',
    '.education__card-place',
    '.interests__item',
    '.footer__title',
    '.footer__mail'
  ];

  let globalIndex = 0;

  editableSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const classes = Array.from(element.classList);
      const specificClass = classes.find(cls => cls.includes('__')) || classes[0];
      const uniqueId = `${specificClass}_${globalIndex}`;

      element.setAttribute('data-editable-id', uniqueId);
      globalIndex++;
    });
  });
}

function addEventListeners() {
  const editableElements = document.querySelectorAll('[data-editable-id]');

  editableElements.forEach(element => {
    element.addEventListener('click', makeEditable);
  });
}

function loadSavedData() {
  const savedData = localStorage.getItem('resumeData');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);

      Object.keys(data).forEach(elementId => {
        const element = document.querySelector(`[data-editable-id="${elementId}"]`);
        if (element) {
          element.innerHTML = data[elementId];
        }
      });
    } catch (error) {
      throw new Error('Ошибка при загрузке данных');
    }
  } else {
    console.log('Нет сохраненных данных в localStorage');
  }
}

function saveData() {
  const data = {};
  const editableElements = document.querySelectorAll('[data-editable-id]');

  editableElements.forEach(element => {
    const elementId = element.getAttribute('data-editable-id');
    if (elementId) {
      data[elementId] = element.innerHTML;
    }
  });

  try {
    localStorage.setItem('resumeData', JSON.stringify(data));
  } catch (error) {
    throw new Error("Не получилось сохранить изменения")
  }
}

function makeEditable(event) {
  const element = event.target;

  if (element.contentEditable === 'true') {
    return;
  }

  element.style.transition = 'all 0.2s ease';
  element.style.border = '2px solid var(--yellow)';
  element.style.padding = '4px';
  element.style.borderRadius = '4px';
  element.style.backgroundColor = 'rgba(246, 237, 30, 0.1)';
  element.style.outline = 'none';
  element.style.cursor = 'text';
  element.contentEditable = 'true';
  element.focus();

  const originalHTML = element.innerHTML;

  function finishEditing() {
    element.style.transition = 'all 0.3s ease';
    element.style.border = '';
    element.style.padding = '';
    element.style.borderRadius = '';
    element.style.backgroundColor = '';
    element.style.cursor = '';
    element.contentEditable = 'false';

    saveData();

    element.removeEventListener('blur', finishEditing);
    element.removeEventListener('keydown', handleKeydown);
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      finishEditing();
    } else if (event.key === 'Escape') {
      element.innerHTML = originalHTML;
      finishEditing();
    }
  }

  element.addEventListener('blur', finishEditing);
  element.addEventListener('keydown', handleKeydown);
}





