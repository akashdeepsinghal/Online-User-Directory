"use strict";

//Userlist array to fill into the boxes
var userListData = [];

//DOM Ready ======================
$(document).ready(function () {
	//Populate the user table on initial load
	populateTable();
});

//Functions =======================

//Fill the table with data
function populateTable() {
	//Empty content string
	var tableContent = '';

	//Jquery AJAX call for JSON
	$.getJSON('/users/userlist', function ( data) {
		 // Stick our user data array into a userlist variable in the global object
		userListData = data;

		//For each item in our JSON, add a new table row and cells to the content string
		$.each(data, function () {
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">'+ this.username + '</td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '" title="Delete User">Delete</td>';
			tableContent += '<td><a href="#" class="linkedituser" rel="' + this._id + '" title="Edit Info">Edit</td>';
			tableContent += '</tr>';
		});
		//Inject the whole content string into existing html table
		$('#userList table tbody').html(tableContent);
		$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
		$('#btnAddUser').on('click', addUser);
		$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
		$('#userList table tbody').on('click', 'td a.linkedituser', editUser);
		$('#btnEditUser').on('click', editSubmit);
	});
};

//Show user data
function showUserInfo(event) {
	
	//Prevent link from firing
	event.preventDefault;

	//Retrieve username from link rel attribute
	var thisUserName = $(this).attr('rel');

	//Get index of object based on id value
	var arrayPosition = userListData.map(function (arrayItem) {return arrayItem.username;}).indexOf(thisUserName);

	//Get our user object
	var thisUserObject = userListData[arrayPosition];

	//Populate info box
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
};


//Add User
function addUser (event) {

	//Prevent link from firing
	event.preventDefault;

	//Super basic validation
	var errorCount = 0;
	$('#addUser input').each(function (index, val) {
		if($(this).val()===''){ errorCount++ ;}
	});

	//If finally error count is zero, then proceed
	if (errorCount === 0) {
		var newUser = {
			'username'	: $('#addUser fieldset input#inputUserName').val(),
			'email' 	: $('#addUser fieldset input#inputUserEmail').val(),
			'fullname' 	: $('#addUser fieldset input#inputUserFullname').val(),
			'age' 		: $('#addUser fieldset input#inputUserAge').val(),
			'location' 	: $('#addUser fieldset input#inputUserLocation').val(),
			'gender' 	: $('#addUser fieldset input#inputUserGender').val()
		}
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function (response) {
			if (response.msg === '') {
				//clear the fields
				$('#addUser fieldset input').val('');
				//Populate the table
				populateTable();
			}
			else{
				alert('Error: '+ response.msg);
			}
		});
	}
	else{
		alert('Please fill in all fields');
        return false;
	}
};

//Delete User
function deleteUser (event) {
	
	//Prevent link from firing
	event.preventDefault;

	//Pop up confirmation dialog:-
	//var confirmation = confirm('Are you sure you want to delete this user?');

	var confirmation = true;
	//If user confirms, delete!
	if(confirmation==true){
		$.ajax({
			type: 'DELETE',
			url: '/users/delete/' + $(this).attr('rel')
		}).done(function (response) {
			if(response.msg==''){
			}
			else{
				alert('Error: ' + response.msg);
			}

			//Update the table
			populateTable();
		})
	}
	else{
		return false;
	}

};

//Edit User info
// 1.) Populate User data into edit fields
function editUser (event) {
	
	//Prevent link from firing
	event.preventDefault;

	//Retrieve ID from link rel attribute
	var thisUserId = $(this).attr('rel');
	//console.log(thisUserId);

	//Get index of object based on id value
	var arrayPosition = userListData.map(function (arrayItem) {return arrayItem._id;}).indexOf(thisUserId);

	//Get our user object
	var thisUserObject = userListData[arrayPosition];

	//Make the Edit form visible
	$('#editUser').css("visibility","visible");
	//Populate info box
	$('#editUser fieldset input#inputUserName').val(thisUserObject.username);
	$('#editUser fieldset input#inputUserEmail').val(thisUserObject.email);
	$('#editUser fieldset input#inputUserFullname').val(thisUserObject.fullname);
	$('#editUser fieldset input#inputUserAge').val(thisUserObject.age);
	$('#editUser fieldset input#inputUserLocation').val(thisUserObject.location);
	$('#editUser fieldset input#inputUserGender').val(thisUserObject.gender);
	$('#editUser fieldset span#inputUserId').text(thisUserObject._id);
};
// 2.) Finally Edit in database
function editSubmit (event) {
	//Prevent link from firing
	event.preventDefault;

	//Super basic validation
	var errorCount = 0;
	$('#editUser input').each(function (index, val) {
		if($(this).val()===''){ errorCount++ ;}
	});

	//If finally error count is zero, then proceed
	if (errorCount === 0) {
		var editInfo = {
			'username'	: $('#editUser fieldset input#inputUserName').val(),
			'email' 	: $('#editUser fieldset input#inputUserEmail').val(),
			'fullname' 	: $('#editUser fieldset input#inputUserFullname').val(),
			'age' 		: $('#editUser fieldset input#inputUserAge').val(),
			'location' 	: $('#editUser fieldset input#inputUserLocation').val(),
			'gender' 	: $('#editUser fieldset input#inputUserGender').val()
		}
		var user_id = $('#editUser fieldset span#inputUserId').text();
		console.log(editInfo);
		console.log(user_id);
		$.ajax({
			type: 'PUT',
			data: editInfo,
			url: '/users/edituser/' + user_id,
			dataType: 'JSON'
		}).done(function (response) {
			var url3 = '/users/edituser/' + user_id;
			console.log(url3);
			if (response.msg === '') {
				//clear the fields
				$('#editUser fieldset input').val('');
				//Populate the table
				populateTable();
				
				//Hide the Edit form
				$('#editUser').css("visibility","hidden");
			}
			else{
				alert('Error: '+ response.msg);
			}
		});
	}
	else{
		alert('Please fill in all fields');
        return false;
	}

}