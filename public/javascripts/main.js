/*
add course page
 */
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
