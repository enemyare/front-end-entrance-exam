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
  loadSavedData();
  
  const editableElements = document.querySelectorAll('.introduction__name, .introduction__position, .introduction__greetings, .experience__position, .experience__tags, .experience__period, .experience__description li, .education__card-title, .education__card-date, .education__card-place, .interests__item, .footer__title, .footer__mail, .languages__name');
  
  editableElements.forEach(element => {
    element.addEventListener('click', makeEditable);
  });
});

function loadSavedData() {
  const savedData = localStorage.getItem('resumeData');
  if (savedData) {
    const data = JSON.parse(savedData);
    
    Object.keys(data).forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.textContent = data[selector];
      }
    });
  }
}

function saveData() {
  const data = {};
  const editableElements = document.querySelectorAll('.introduction__name, .introduction__position, .introduction__greetings, .experience__position, .experience__tags, .experience__period, .experience__description li, .education__card-title, .education__card-date, .education__card-place, .interests__item, .footer__title, .footer__mail, .languages__name');
  
  editableElements.forEach(element => {
    const selector = getElementSelector(element);
    if (selector) {
      data[selector] = element.textContent;
    }
  });
  
  localStorage.setItem('resumeData', JSON.stringify(data));
}

function getElementSelector(element) {
  const classes = Array.from(element.classList);
  if (classes.length > 0) {
    const specificClass = classes.find(cls => cls.includes('__'));
    if (specificClass) {
      return '.' + specificClass;
    }
    return '.' + classes[0];
  }
  return null;
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
  element.style.backgroundColor = 'inherit';
  element.style.outline = 'none';
  element.style.cursor = 'text';
  
  if (element.tagName === 'LI') {
    element.style.setProperty('--before-content', 'none');
    element.style.setProperty('--before-display', 'none');
  }
  
  element.contentEditable = 'true';
  element.focus();
  
  const originalText = element.textContent;
  
  function finishEditing() {
    element.style.transition = 'all 0.3s ease';
    element.style.border = '';
    element.style.padding = '';
    element.style.borderRadius = '';
    element.style.backgroundColor = '';
    element.style.cursor = '';
    element.style.boxShadow = '';
    
    if (element.tagName === 'LI') {
      element.style.removeProperty('--before-content');
      element.style.removeProperty('--before-display');
    }
    
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
