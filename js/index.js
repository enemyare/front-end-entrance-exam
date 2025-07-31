function downloadPDF() {
  const element = document.getElementById('resume-content');

  const options = {
    margin: [10, 40, 0, 40],
    filename: 'portfolio.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
  };
  html2pdf().set(options).from(element).save();
}

document.addEventListener('DOMContentLoaded', function () {
  addUniqueIds();
  loadSavedData();
  addHoverEffects();

  const editableElements = document.querySelectorAll(
    '.introduction__name, .introduction__position, .introduction__greetings, .experience__position, .experience__tags, .experience__period, .experience__description li, .education__card-title, .education__card-date, .education__card-place, .education__card-hashtag, .interests__item, .footer__title, .footer__mail, .languages__name'
  );

  editableElements.forEach((element) => {
    element.addEventListener('click', makeEditable);
  });
});

function addUniqueIds() {
  const editableSelectors = [
    '.introduction__name',
    '.introduction__position',
    '.introduction__greetings',
    '.experience__position',
    '.experience__tags',
    '.experience__period',
    '.experience__description li',
    '.education__card-title',
    '.education__card-date',
    '.education__card-place',
    '.education__card-hashtag',
    '.interests__item',
    '.footer__title',
    '.footer__mail',
    '.languages__name',
  ];

  let globalIndex = 0;
  editableSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      if (!element.id) {
        element.id = `editable_${globalIndex}`;
        globalIndex++;
      }
    });
  });
}

function addHoverEffects() {
  const hoverElements = document.querySelectorAll(
    '.introduction__name, .introduction__position, .introduction__greetings, .experience__position, .experience__tags, .experience__period, .experience__description li, .education__card-title, .education__card-date, .education__card-place, .education__card-hashtag, .interests__item, .footer__title, .footer__mail, .languages__name'
  );

  hoverElements.forEach((element) => {
    element.addEventListener('mouseenter', function () {
      this.style.backgroundColor = 'rgba(243, 233, 29, 0.5)';
      this.style.transition = 'all 0.4s ease';
      this.style.cursor = 'pointer';
    });

    element.addEventListener('mouseleave', function () {
      this.style.backgroundColor = '';
      this.style.transition = '';
      this.style.cursor = '';
    });
  });
}

function loadSavedData() {
  const savedData = localStorage.getItem('resumeData');
  if (savedData) {
    const data = JSON.parse(savedData);

    Object.keys(data).forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = data[id];
      }
    });
  }
}

function saveData() {
  const data = {};
  const editableElements = document.querySelectorAll(
    '.introduction__name, .introduction__position, .introduction__greetings, .experience__position, .experience__tags, .experience__period, .experience__description li, .education__card-title, .education__card-date, .education__card-place, .education__card-hashtag, .interests__item, .footer__title, .footer__mail, .languages__name'
  );

  editableElements.forEach((element) => {
    if (element.id) {
      data[element.id] = element.textContent;
    }
  });

  localStorage.setItem('resumeData', JSON.stringify(data));
}

function makeEditable(event) {
  const element = event.target;

  if (element.contentEditable === 'true') {
    return;
  }

  element.style.transition = 'all 0.3s ease';
  element.style.outline = '2px solid var(--yellow)';
  element.style.padding = '4px';
  element.style.borderRadius = '4px';
  element.style.backgroundColor = 'inherit';
  element.style.cursor = 'text';
  element.contentEditable = 'true';
  element.focus();

  const originalText = element.textContent;

  function finishEditing() {
    element.style.transition = 'all 0.3s ease';
    element.style.outline = '';
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
      element.textContent = originalText;
      finishEditing();
    }
  }

  element.addEventListener('blur', finishEditing);
  element.addEventListener('keydown', handleKeydown);
}
