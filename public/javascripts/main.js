//for add page
var topic1 = document.getElementById('topic1_drop');
var topic2 = document.getElementById('topic2_drop');
var warning = document.getElementById('warning');

topic1.addEventListener('change', function() {
  if (topic1.value === topic2.value && topic1.value !== null) {
    warning.textContent='Topic 1 and Topic 2 must be different!'
  }else{
    warning.textContent='';
  }
});


topic2.addEventListener('change', function() {
  if (topic1.value === topic2.value && topic1.value !== null) {
    warning.textContent='Topic 1 and Topic 2 must be different!'
  }else{
    warning.textContent='';
  }
});


//for update page
var selectedCourse = document.getElementById('course_drop');
var course_name = document.getElementById('course_input');
var course_sub = document.getElementById('sub_drop');
var course_plat = document.getElementById('plat_drop');
var course_org = document.getElementById('org_drop');

//if selected course is changed, set course name input to the selected
selectedCourse.addEventListener('change', function(){
  course_name.value = selectedCourse.value;
});



