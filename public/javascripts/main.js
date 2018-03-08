/*
add course page
 */
//change form field for add course page when drop down is selected
var sub_input = document.getElementById('sub_input');
var sub_drop = document.getElementById('sub_drop');
var plat_input = document.getElementById('plat_input');
var plat_drop = document.getElementById('plat_drop');
var org_input = document.getElementById('org_input');
var org_drop = document.getElementById('org_drop');
//subject field
sub_drop.addEventListener('change', function(){
  sub_input.value = sub_drop.value;
});
//platform field
plat_drop.addEventListener('change', function(){
  plat_input.value = plat_drop.value;
});
//organization field
org_drop.addEventListener('change', function(){
  org_input.value = org_drop.value;
});




