// for add page
const topic1 = document.getElementById('topic1_drop');
const topic2 = document.getElementById('topic2_drop');
const warning = document.getElementById('warning');

topic1.addEventListener('change', () => {
  if (topic1.value === topic2.value && topic1.value !== null) {
    warning.textContent = 'Topic 1 and Topic 2 must be different!';
  } else {
    warning.textContent = '';
  }
});


topic2.addEventListener('change', () => {
  if (topic1.value === topic2.value && topic1.value !== null) {
    warning.textContent = 'Topic 1 and Topic 2 must be different!';
  } else {
    warning.textContent = '';
  }
});


// for update page
const selectedCourse = document.getElementById('course_drop');
const course_name = document.getElementById('course_input');
const course_sub = document.getElementById('sub_drop');
const course_plat = document.getElementById('plat_drop');
const course_org = document.getElementById('org_drop');

// if selected course is changed, set course name input to the selected
selectedCourse.addEventListener('change', () => {
  course_name.value = selectedCourse.value;
});

