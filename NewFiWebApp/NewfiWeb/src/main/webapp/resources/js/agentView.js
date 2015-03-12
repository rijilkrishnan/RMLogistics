/*
 *Contains JavaScript functions for agent dashboard pages
 */
var isAgentTypeDashboard;

function adjustAgentDashboardOnResize() {
	if (window.innerWidth <= 1200 && window.innerWidth >= 768) {
		var leftPanelWidth = $('.left-panel').width();
		var centerPanelWidth = $(window).width() - (leftPanelWidth) - 15;
		$('.rp-agent-dashboard').width(centerPanelWidth);
	}
	adjustCustomerNameWidth();
}

function adjustCustomerNameWidth() {
	var cusNameColWidth = $('.leads-container-tc1').width();
	var statusIcnWidth = $('.onl-status-icn').width();
	var cusImgWidth = $('.cus-img-icn').width();
	var cusNameWidth = cusNameColWidth - (statusIcnWidth + cusImgWidth) - 5;
	$('.cus-name').outerWidth(cusNameWidth);
}

function getAgentSecondaryLeftNav() {
	var leftTab2Wrapper = $('<div>').attr({
		"class" : "lp-t2-wrapper",
		"id" : "agent-sec-nav"
	});

	var step0 = getAgentSecondaryLeftNavStep(0, "talk to<br/>your team");
	var step1 = getAgentSecondaryLeftNavStep(1, "application progress");
	var step2 = getAgentSecondaryLeftNavStep(2, "loan<br/>details");
	var step3 = getAgentSecondaryLeftNavStep(3, "lock<br />your rate");
	var step4 = getAgentSecondaryLeftNavStep(4, "upload<br />needed items");
	var step5 = getAgentSecondaryLeftNavStep(5, "loan<br />progress");

	return leftTab2Wrapper.append(step0).append(step1).append(step2).append(
			step3).append(step4).append(step5);
}

function getAgentSecondaryLeftNavStep(step, text) {
	var container = $('<div>').attr({
		"id" : "lp-step" + step,
		"class" : "lp-t2-item lp-t2-agent-item"
	});

	var img = $('<div>').attr({
		"class" : "lp-t2-img lp-t2-img" + step
	});

	var txt = $('<div>').attr({
		"class" : "lp-t2-txt"
	}).html(text);

	return container.append(img).append(txt);
}

var imageBaseUrl = "resources/images/";

var custData = {
	"num_found" : "",
	"customers" : [
			{
				"name" : "Jessica Cockrell",
				"prof_image" : imageBaseUrl + "photos1.png",
				"time" : "01/09/2015 11:58AM",
				"phone_no" : "8645547862",
				"purpose" : "Purchase TBD",
				"processor" : "Johny Tester",
				"credit_score" : "731",
				"alert_count" : 3,
				"alerts" : [],
				"notes" : []
			},
			{
				"name" : "Chad Mcintosh",
				"prof_image" : imageBaseUrl + "photos2.png",
				"time" : "01/08/2015 12:48AM",
				"phone_no" : "3865618993",
				"purpose" : "Purchase",
				"processor" : "Jennifer Standifer",
				"credit_score" : "842",
				"alert_count" : 1,
				"alerts" : [],
				"notes" : []
			},
			{
				"name" : "Kimberly Burkeen",
				"prof_image" : imageBaseUrl + "photos3.png",
				"time" : "01/09/2015 11:18AM",
				"phone_no" : "9043309807",
				"purpose" : "Purchase",
				"processor" : "Johny Tester",
				"credit_score" : "731",
				"alert_count" : 0,
				"alerts" : [],
				"notes" : []
			},
			{
				"name" : "Sherry Andreu",
				"prof_image" : imageBaseUrl + "photos1.png",
				"time" : "01/09/2015 11:18AM",
				"phone_no" : "9043309807",
				"purpose" : "Purchase",
				"processor" : "Jennifer Standifer",
				"credit_score" : "699",
				"alert_count" : 3,
				"alerts" : [
						"Salaried-W-2 forms - Pending",
						"Payroll stubs for the past 30 days (showing YTD earings) - Pending",
						"Payroll stub for the past 30 days," ],
				"notes" : [
						{
							"name" : "Jane Doe",
							"time" : "Yesterday at 3:30pm",
							"message" : "I have attached the files requested\n\n"
									+ "* Salaried-W-2 for the most recent 2 years\n"
									+ "* Payroll stubs for the past 30 days(showing YTD earnings)\n"
						},
						{
							"name" : "Jane Doe",
							"time" : "Yesterday at 3:30pm",
							"message" : "I have attached the files requested\n\n"
									+ "* Salaried-W-2 for the most recent 2 years\n"
									+ "* Payroll stubs for the past 30 days(showing YTD earnings)\n"
						},
						{
							"name" : "Jane Doe",
							"time" : "Yesterday at 3:30pm",
							"message" : "I have attached the files requested\n\n"
									+ "* Salaried-W-2 for the most recent 2 years\n"
									+ "* Payroll stubs for the past 30 days(showing YTD earnings)\n"
						} ]
			}, {
				"name" : "Jessica Cockrell",
				"prof_image" : imageBaseUrl + "photos1.png",
				"time" : "01/09/2015 11:18AM",
				"phone_no" : "8645547862",
				"purpose" : "Purchase TBD",
				"processor" : "Johny Tester",
				"credit_score" : "731",
				"alert_count" : 2,
				"alerts" : [],
				"notes" : []
			}, {
				"name" : "Jessica Cockrell",
				"prof_image" : imageBaseUrl + "photos1.png",
				"time" : "01/09/2015 11:18AM",
				"phone_no" : "8645547862",
				"purpose" : "Purchase TBD",
				"processor" : "Johny Tester",
				"credit_score" : "731",
				"alert_count" : 0,
				"alerts" : [],
				"notes" : []
			}, {
				"name" : "Jessica Cockrell",
				"prof_image" : imageBaseUrl + "photos1.png",
				"time" : "01/09/2015 11:18AM",
				"phone_no" : "8645547862",
				"purpose" : "Purchase TBD",
				"processor" : "Johny Tester",
				"credit_score" : "731",
				"alert_count" : 1,
				"alerts" : [],
				"notes" : []
			}, {
				"name" : "Jessica Cockrell",
				"prof_image" : imageBaseUrl + "photos1.png",
				"time" : "01/09/2015 11:18AM",
				"phone_no" : "8645547862",
				"purpose" : "Purchase TBD",
				"processor" : "Johny Tester",
				"credit_score" : "731",
				"alert_count" : 2,
				"alerts" : [],
				"notes" : []
			} ]
};

function paintAgentDashboard() {
	$('.lp-right-arrow').remove();
	$('#right-panel').html('');
	var agentDashboardMainContainer = $('<div>').attr({
		"id" : "agent-dashboard-container",
		"class" : "rp-agent-dashboard float-left"
	});
	$('#right-panel').append(agentDashboardMainContainer);
	getDashboardRightPanel();
	adjustAgentDashboardOnResize();
	var contxt = getNotificationContext(0, newfiObject.user.id);
	contxt.getLoanNotificationByType(function(ob) {
		ob.populateLoanNotification();
	});
	contxt.getNotificationForUser();
	addContext("notification", contxt);
}

function paintAgentDashboardCallBack(data) {
	$('#main-body-wrapper').html(data);

	adjustAgentDashboardOnResize();
}

function getDashboardRightPanel() {
	var userID = newfiObject.user.id;
	ajaxRequest("rest/loan/retrieveDashboard/" + userID, "GET", "json", {},
			paintAgentDashboardRightPanel);
}

function paintAgentDashboardRightPanel(data) {
	var customerData = data.resultObject;
	var header = $('<div>').attr({
		"class" : "agent-customer-list-header clearfix"
	});
	var leftCon = $('<div>').attr({
		"class" : "agent-customer-list-header-txt float-left uppercase"
	}).html("customer list");

	var rightCon = $('<div>').attr({
		"class" : "agent-customer-list-header-rc float-right clearfix"
	});

	var searchCon = $('<div>').attr({
		"class" : "clearfix float-left"
	});

	var searchIcon = $('<div>').attr({
		"class" : "search-icn float-left"
	}).on('click', function() {
		$(this).hide();
		$(this).parent().find('.search-input').show().focus();
	});

	var searchInputBox = $('<input>').attr({
		"class" : "search-input float-left hide"
	}).on('keyup', function(e) {
		if (e.which == 13) {
			$(this).hide();
			$(this).parent().find('.search-icn').show();
		}
	}).on('blur', function() {
		$(this).hide();
		$(this).parent().find('.search-icn').show();
	});

	searchCon.append(searchIcon).append(searchInputBox);

	var filterText = $('<div>').attr({
		"class" : "filter-text float-left"
	}).html("View :");

	var filter = $('<div>').attr({
		"class" : "filer-dropdown float-left"
	}).html("New");

	rightCon.append(searchCon).append(filterText).append(filter);

	header.append(leftCon).append(rightCon);
	$('#agent-dashboard-container').append(header);
	appendAgentDashboardContainer();
	appendCustomers("leads-container", customerData.customers);
}

function appendAgentDashboardContainer() {
	var container = $('<div>').attr({
		"class" : "customer-list-contianer"
	});

	var leadsWrapper = $('<div>').attr({
		"class" : "cutomer-leads-wrapper"
	});

	var leadsHeader = $('<div>').attr({
		"class" : "agent-wrapper-header agent-wrapper-header-active"
	}).html("Leads");

	var leadsContainer = $('<div>').attr({
		"id" : "leads-container",
		"class" : "agent-wrapper-container"
	});

	leadsWrapper.append(leadsHeader).append(leadsContainer);

	var inactiveWrapper = $('<div>').attr({
		"class" : "cutomer-inactive-wrapper"
	});

	var inactiveHeader = $('<div>').attr({
		"class" : "agent-wrapper-header"
	}).html("Inactive");

	var inactiveContainer = $('<div>').attr({
		"id" : "inactive-container",
		"class" : "agent-wrapper-container"
	});

	inactiveWrapper.append(inactiveHeader).append(inactiveContainer);

	container.append(leadsWrapper).append(inactiveWrapper);
	$('#agent-dashboard-container').append(container);
}

/**
 * 
 * @param elementId
 *            of container to which customer list is to appended
 * @param customers
 */
function appendCustomers(elementId, customers) {

	$('#' + elementId).html("");
	appendCustomerTableHeader(elementId);

	for (var i = 0; i < customers.length; i++) {

		var customer = customers[i];

		var row = $('<div>').attr({
			"class" : "leads-container-tr leads-container-row clearfix"
		});

		if (i % 2 == 0) {
			row.addClass('leads-container-row-odd');
		}

		if (i == customers.length - 1) {
			row.addClass('leads-container-row-last');
		}

		var col1 = $('<div>').attr({
			"class" : "leads-container-tc1 float-left clearfix"
		});

		var onlineStatus = $('<div>').attr({
			"class" : "onl-status-icn float-left"
		});
		// TODO customer prof default pic to be set correctly
		if (customer.prof_image == undefined || customer.prof_image == ""
				|| customer.prof_image == null) {
			customer.prof_image = "resources/images/cus-icn.png";
		}
		var profImage = $('<div>').attr({
			"class" : "cus-img-icn float-left",
			"style" : "background-image:url(" + customer.prof_image + ")"

		});
		// code will execute if user is logged in
		var loanNotificationCntxt = getNotificationContext(customer.loanID, 0);
		addContext(customer.loanID + "-notification", loanNotificationCntxt)
		var cusName = $('<div>').attr({
			"class" : "cus-name float-left",
			"loanid" : customer.loanID,
			"userid" : customer.userID
		}).bind('click', {
			"customer" : customer
		}, function(event) {
			event.stopImmediatePropagation();

			resetSelectedUserDetailObject(event.data.customer);
			saveState('loan', selectedUserDetail.loanID, "detail");
			entryPointForAgentView(selectedUserDetail.loanID, '2')
			// getLoanDetails(loanID);
		}).html(customer.name);

		// loan details page to be displayed on click of the customer name
		/*
		 * cusName.click(function(){ console.log("Customer clicked"); var
		 * userID=$(this).attr('userid'); var loanID=$(this).attr('loanid');
		 * paintMyLoansView(); changeAgentSecondaryLeftPanel("lp-step2");
		 * getLoanDetails(loanID); });
		 */

		col1.append(onlineStatus).append(profImage).append(cusName);

		var phone_num = formatPhoneNumberToUsFormat(customer.phone_no);

		var col2 = $('<div>').attr({
			"class" : "leads-container-tc2 float-left"
		}).html(phone_num);

		var col3 = $('<div>').attr({
			"class" : "leads-container-tc3 float-left"
		}).html(customer.purpose);

		var col4 = $('<div>').attr({
			"class" : "leads-container-tc4 float-left"
		}).html(customer.processor);

		var col5 = $('<div>').attr({
			"class" : "leads-container-tc5 float-left"
		}).html(customer.credit_score);

		var col6 = $('<div>').attr({
			"class" : "leads-container-tc6 float-left"
		}).html(customer.time);

		var col7 = $('<div>').attr({
			"class" : "leads-container-tc7 alert-col float-left"
		}).bind(
				'click',
				{
					"customer" : customer
				},
				function(event) {
					event.stopImmediatePropagation();
					appendCustomerDetailContianer($(this).parent(),
							event.data.customer);
				});
		loanNotificationCntxt.loanLstCntElement = col7;
		loanNotificationCntxt.getNotificationForLoan(function(ob) {
			if (parseInt(ob.loanNotificationList.length) > 0) {
				var alerts = $('<div>').attr({
					"class" : "alerts-count"
				}).html(ob.loanNotificationList.length);
				col7.append(alerts);
			}
		});

		row.append(col1).append(col2).append(col3).append(col4).append(col5)
				.append(col6).append(col7);

		$('#' + elementId).append(row);
	}

}

// Function to append customer table header in agent dashboard
function appendCustomerTableHeader(elementId) {
	var tableHeader = $('<div>').attr({
		"class" : "leads-container-th leads-container-row clearfix"
	});

	var thCol1 = $('<div>').attr({
		"class" : "leads-container-tc1 float-left"
	}).html("Customer Name");

	var thCol2 = $('<div>').attr({
		"class" : "leads-container-tc2 float-left"
	}).html("Phone<br/>No.");

	var thCol3 = $('<div>').attr({
		"class" : "leads-container-tc3 float-left"
	}).html("Purpose");

	var thCol4 = $('<div>').attr({
		"class" : "leads-container-tc4 float-left"
	}).html("Processor");

	var thCol5 = $('<div>').attr({
		"class" : "leads-container-tc5 float-left"
	}).html("Credit<br/>Score");

	var thCol6 = $('<div>').attr({
		"class" : "leads-container-tc6 float-left"
	}).html("Date/<br/>Time");

	var thCol7 = $('<div>').attr({
		"class" : "leads-container-tc7 float-left"
	}).html("Alert");

	tableHeader.append(thCol1).append(thCol2).append(thCol3).append(thCol4)
			.append(thCol4).append(thCol5).append(thCol6).append(thCol7);

	$('#' + elementId).append(tableHeader);
}

/**
 * function to append details related to customer in agent dashboard
 * 
 * @param element
 *            container to which the it is to be appended
 */
function appendCustomerDetailContianer(element, customer) {
	var contxt = getContext(customer.loanID + "-notification");
	if ($(element).next().hasClass("cust-detail-wrapper")) {
		$('#cust-detail-wrapper').remove();
		$('.leads-container-tr').removeClass('leads-container-tr-sel');
		contxt.existingWrapper = undefined;
		return;
	}
	$('#cust-detail-wrapper').remove();
	$('.leads-container-tr').removeClass('leads-container-tr-sel');
	$(element).addClass('leads-container-tr-sel');
	var wrapper = $('<div>').attr({
		"id" : "cust-detail-wrapper",
		"class" : "cust-detail-wrapper clearfix"
	});
	$(element).after(wrapper);
	appendRecentAlertContainer(contxt.loanNotificationList, contxt);
	appendSchedulerContainer(contxt);
	appendRecentNotesContainer(customer.notes);
	appendTakeNoteContainer();
}

function appendRecentAlertContainer(alerts, contxt, existingWrapper) {
	var wrapper = {};
	if (!existingWrapper) {
		wrapper = $('<div>').attr({
			"class" : "cust-detail-lw float-left"
		});
	} else {
		wrapper = existingWrapper;
		wrapper.empty();
	}
	contxt.existingWrapper = wrapper;
	var container = $('<div>').attr({
		"class" : "cust-detail-container"
	});
	var header = $('<div id="alertHeader">').attr({
		"class" : "cust-detail-header"
	}).html("recent alerts");

	if (alerts != undefined) {
		header.append(" - " + alerts.length + " NEW ALERTS");
	} else {
		header.append(" - " + 0 + " NEW ALERTS");
	}

	container.append(header);

	var recentAlertWrapper = $('<div>').attr({
		"class" : "recent-alerts-wrapper clearfix"
	});

	if (alerts != undefined) {
		var count = 0;
		for (var i = 0; i < alerts.length; i++) {
			var alertData = alerts[i].content;
			var alertContainer = $('<div>').attr({
				"class" : "alert-conatiner clearfix"
			});
			var alertLeftCol = $('<div>').attr({
				"class" : "alert-container-lc float-left"
			});
			var alertTxt = $('<div>').attr({
				"class" : "alert-txt"
			}).html(alertData);
			var alertBtnRow = $('<div>').attr({
				"class" : "alert-btn-row clearfix"
			});

			var dismissBtn = $('<div>').attr({
				"class" : "alert-btn float-left"
			}).html("Dismiss").bind("click", {
				notificationid : alerts[i].id,
				contxt : contxt,
				container : alertContainer
			}, function(e) {
				var notificationid = e.data.notificationid;
				var contxt = e.data.contxt;
				var container = e.data.container;
				contxt.removeLoanNotification(notificationid, function() {
					container.remove();
					contxt.updateLoanListNotificationCount();
				});

			});

			var snoozeBtn = $('<div>').attr({
				"class" : "alert-btn float-left"
			}).html("Snooze").bind("click", {
				notificationid : alerts[i].id,
				contxt : contxt,
				container : alertContainer
			}, function(e) {
				var notificationid = e.data.notificationid;
				var contxt = e.data.contxt;
				var container = e.data.container;
				contxt.snoozeLoanNotification(notificationid, 5, function() {
					container.remove();
					contxt.updateLoanListNotificationCount();
				});
			});

			alertBtnRow.append(dismissBtn).append(snoozeBtn);

			alertLeftCol.append(alertTxt);
			if (alerts[i].dismissable == true)
				alertLeftCol.append(alertBtnRow);

			alertContainer.append(alertLeftCol);
			if (alerts[i].remindOn) {
				var dat = new Date(alerts[i].remindOn);
				var amPm = dat.getHours() > 12 ? "PM" : "AM";
				var hr = dat.getHours() % 12 < 10 ? ("0" + dat.getHours() % 12)
						: dat.getHours() % 12;
				var min = dat.getMinutes() < 10 ? ("0" + dat.getMinutes())
						: dat.getMinutes();
				var editBtn = $('<div>').attr({
					"class" : "float-right"
				}).html(
						$.datepicker.formatDate('M-dd-yy', dat) + " " + hr
								+ ":" + min + " " + amPm);
				alertContainer.append(editBtn);
			}
			recentAlertWrapper.append(alertContainer);
			count++;
			if (count == 3)
				break;
		}
	}

	container.append(recentAlertWrapper);

	wrapper.append(container);
	if (!existingWrapper)
		$('#cust-detail-wrapper').append(wrapper);
}

function appendSchedulerContainer(contxt) {
	var wrapper = getSchedulerContainer(contxt);
	$('#cust-detail-wrapper').append(wrapper);

	$('#sch-msg-time-picker').datetimepicker({
		pickDate : false
	});
}

function getSchedulerContainer(contxt,tempData){
	var wrapper = $('<div>').attr({
		"class" : "cust-detail-rw float-left"
	});
	var container = $('<div>').attr({
		"class" : "cust-detail-container"
	});
	var header = $('<div>').attr({
		"class" : "cust-detail-header"
	}).html("scheduler");
	var dtPickerRow = $('<div>').attr({
		"class" : "dt-picker-row clearfix"
	});
	var dtText = $('<div>').attr({
		"class" : "dt-picker-text float-left"
	}).html("Date/Time");
	var datePicker = $('<div>').attr({
		"class" : "date-picker-cont float-left"
	});
	var datePickerBox = $('<input>').attr({
		"class" : "date-picker-input",
		"placeholder" : "MM/DD/YYYY",
		"id" : "sch-msg-date-picker"
	}).datepicker({
		orientation : "top auto",
		autoclose : true
	});
	datePicker.append(datePickerBox);
	var timerPicker = $('<div>').attr({
		"id" : "sch-msg-time-picker",
		"class" : "time-picker-cont float-left"
	});
	var timerPickerBox = $('<input>').attr({
		"class" : "time-picker-input",
		"placeholder" : "11:58AM"
	});
	timerPicker.append(timerPickerBox);
	dtPickerRow.append(dtText).append(datePicker).append(timerPicker);
	var messageBox = $('<textarea>').attr({
		"class" : "scheduled-msg-textbox",
		"placeholder" : "Type your message here. When done click submit",
		"id" : "sch-msg-message"
	});
	var buttonRow = $('<div>').attr({
		"class" : "msg-btn-row clearfix"
	});
	var col1 = $('<div>').attr({
		"class" : "msg-btn-col1 float-left clearfix"
	});
	var col1Btn = $('<div>').attr({
		"class" : "msg-btn-submit float-right"
	}).html("Submit").bind("click",{contxt:contxt,tempData:tempData},function(e){
		var tempData=e.data.tempData;
		var contxt=e.data.contxt;
		var dat=$('#sch-msg-time-picker ').data('DateTimePicker').getDate()._d
		var snoozeTime=$('#sch-msg-date-picker').data('datepicker').getDate();
		snoozeTime.setHours(dat.getHours());
		snoozeTime.setMinutes(dat.getMinutes())
		var message=$("#sch-msg-message").val();
		if(message==""){
			showToastMessage("Invalid Message");
		}else if(snoozeTime=="Invalid Date"){
			showToastMessage("Invalid Date");
		}else{
			var data={};
			data.content=message;
			data.createdDate=new Date().getTime();
			data.remindOn=snoozeTime.getTime();
			data.createdByID=newfiObject.user.id;
			data.createdForID=newfiObject.user.id;
			data.loanID=contxt.loanId;
			data.notificationType="NOTIFICATION";
			if(tempData){
				var wrapperData={};
				for(key in tempData){
					wrapperData[key]=tempData[key];
				}
				wrapperData.notificationVo=data;
				data=wrapperData;
			}
			contxt.scheduleAEvent(data,function(){
				contxt.updateWrapper();
				contxt.updateLoanListNotificationCount();
				$("#sch-msg-message").val("");
				if(tempData){
					removeNotificationPopup();
				}
			});
		}
	});
	col1.append(col1Btn);
	var col2 = $('<div>').attr({
		"class" : "msg-btn-col2 float-left"
	}).html("or");
	var col3 = $('<div>').attr({
		"class" : "msg-btn-col3 float-left clearfix"
	});
	var col3Btn = $('<div>').attr({
		"class" : "msg-btn-clear float-left"
	}).html("Clear");
	col3.append(col3Btn);
	buttonRow.append(col1).append(col2).append(col3);
	container.append(header).append(dtPickerRow).append(messageBox).append(buttonRow);
	wrapper.append(container);
	return wrapper;
}

function appendRecentNotesContainer(notes) {
	var wrapper = $('<div>').attr({
		"class" : "cust-detail-lw float-left"
	});
	var container = $('<div>').attr({
		"class" : "cust-detail-container"
	});
	var header = $('<div>').attr({
		"class" : "cust-detail-header"
	}).html("recent notes");

	if (notes != undefined) {
		header.append(" - " + notes.length + " NEW NOTES");
	} else {
		header.append(" - " + 0 + " NEW NOTES");
	}
	container.append(header);

	var recentNoteWrapper = $('<div>').attr({
		"class" : "recent-notes-wrapper clearfix"
	});

	if (notes != undefined) {
		for (var i = 0; i < notes.length; i++) {
			var noteData = notes[i];
			var noteContainer = $('<div>').attr({
				"class" : "note-conatiner"
			});

			var cusName = $('<div>').attr({
				"class" : "note-cus-name"
			}).html(noteData.name);

			var time = $('<div>').attr({
				"class" : "note-time"
			}).html(noteData.time);

			var message = $('<div>').attr({
				"class" : "note-message"
			}).html(noteData.message);

			noteContainer.append(cusName).append(time).append(message);

			recentNoteWrapper.append(noteContainer);
		}
	}
	container.append(recentNoteWrapper);
	wrapper.append(container);
	$('#cust-detail-wrapper').append(wrapper);
}

function appendTakeNoteContainer() {
	var wrapper = $('<div>').attr({
		"class" : "cust-detail-rw float-left"
	});
	var container = $('<div>').attr({
		"class" : "cust-detail-container"
	});
	var header = $('<div>').attr({
		"class" : "cust-detail-header"
	}).html("take note");
	container.append(header);

	var messageBox = $('<textarea>').attr({
		"class" : "note-msg-textbox",
		"placeholder" : "Type your message here. When done click save."
	});

	container.append(messageBox);

	var buttonRow = $('<div>').attr({
		"class" : "msg-btn-row clearfix"
	});

	var col1 = $('<div>').attr({
		"class" : "msg-btn-col1 float-left clearfix"
	});

	var col1Btn = $('<div>').attr({
		"class" : "msg-btn-submit float-right"
	}).html("Save");
	col1.append(col1Btn);

	var col2 = $('<div>').attr({
		"class" : "msg-btn-col2 float-left"
	}).html("or");

	var col3 = $('<div>').attr({
		"class" : "msg-btn-col3 float-left clearfix"
	});

	var col3Btn = $('<div>').attr({
		"class" : "msg-btn-clear float-left"
	}).html("Clear");
	col3.append(col3Btn);

	buttonRow.append(col1).append(col2).append(col3);
	container.append(buttonRow);

	wrapper.append(container);
	$('#cust-detail-wrapper').append(wrapper);
}

/*
 * Functions for agent loan page views
 */

$(document).on('click', '.lp-t2-agent-item', function() {
	changeAgentSecondaryLeftPanel(this.id);
});

function paintMyLoansView() {
	$('.lp-right-arrow').remove();
	$('#right-panel').html('');
	$('.lp-item').removeClass('lp-item-active');
	$('#lp-talk-wrapper').addClass('lp-item-active');
	var rightPanelCont = $('<div>').attr({
		"class" : "right-panel float-left"
	});
	var secondaryNav = getAgentSecondaryLeftNav();
	var agentCenetrPanel = $('<div>').attr({
		"id" : "center-panel-cont",
		"class" : "center-panel float-left"
	});
	rightPanelCont.append(secondaryNav).append(agentCenetrPanel);
	$('#right-panel').append(rightPanelCont);
	// For backbutton support
	bindDataToSN();

}

function paintMyLoansViewCallBack(data) {
	$('#main-body-wrapper').html(data);
	changeAgentSecondaryLeftPanel('lp-step1');
	adjustCenterPanelWidth();

}

// function to reset slected UserdetailObject
var selectedUserDetail;
function resetSelectedUserDetailObject(userObject) {

	// userObject this is a "LoanCustomerVO" object

	selectedUserDetail = new Object();
	selectedUserDetail.userID = userObject.userID;
	selectedUserDetail.loanID = userObject.loanID;
	selectedUserDetail.role = userObject.role;
	selectedUserDetail.phoneNo = userObject.phone_no;

	selectedUserDetail.name = userObject.name;
	selectedUserDetail.createdDate = userObject.loanInitiatedOn;
	selectedUserDetail.modifiedDate = userObject.lastActedOn;

	selectedUserDetail.firstName = userObject.firstName;
	selectedUserDetail.lastName = userObject.lastName;
	selectedUserDetail.emailId = userObject.emailId;

	selectedUserDetail.customerId = userObject.customerDetail.id;
	selectedUserDetail.city = userObject.customerDetail.addressCity;
	selectedUserDetail.state = userObject.customerDetail.addressState;
	selectedUserDetail.zipCode = userObject.customerDetail.addressZipCode;
	selectedUserDetail.dob = $.datepicker.formatDate('mm/dd/yy', new Date(
			userObject.customerDetail.dateOfBirth));

	// TODO-add a default image url
	if (userObject.prof_image)
		selectedUserDetail.photoUrl = userObject.prof_image;
	else
		selectedUserDetail.photoUrl = "./resources/images/cus-icn.png";
}

// This method is called on click of the view loan details secondary nav
function paintAgentLoanPage(data) {

	var loanDetails = data.resultObject;
	appendCustomerDetailHeader(selectedUserDetail);
	appendCustomerLoanDetails(loanDetails);
	appendAddTeamMemberWrapper('center-panel-cont');
	appendNewfiTeamWrapper(loanDetails);
	var contxt = getContext(loanDetails.id + "-notification");
	if (contxt) {
		contxt.populateLoanNotification();
	} else {
		contxt = getNotificationContext(loanDetails.id, 0);
		contxt.getNotificationForLoan(function(ob) {
			contxt.populateLoanNotification();
		});
	}

}
// function called when secondary left panel is changed in agent view loan
// progress pages
function changeAgentSecondaryLeftPanel(elementId) {
	$('.lp-t2-item').removeClass('t2-active');
	$('.lp-t2-item .arrow-right').remove();
	$('#' + elementId).addClass('t2-active');
	var rightArrow = $('<div>').attr({
		"class" : "arrow-right"
	});
	$('#' + elementId).append(rightArrow);
	$('#center-panel-cont').html('');

	// Check the id and paint the corresponding right panel
	if (elementId == "lp-step0") {
		console.log("talk to your team");
	} else if (elementId == "lp-step1") {
	} else if (elementId == "lp-step2") {
		// TODO-pass the right id
		getLoanDetails(selectedUserDetail.loanID);
	} else if (elementId == "lp-step3") {
	} else if (elementId == "lp-step4") {
		paintAgentNeedsListPage();
	} else if (elementId == "lp-step5") {
		paintAgentLoanProgressPage();
	}

}

// Function to append customer's detail in loan manager view
function appendCustomerDetailHeader(custHeaderDetails) {
	var container = $('<div>').attr({
		"class" : "cus-prof-detail-wrapper clearfix"
	});

	var cusProfLeftContainer = $('<div>').attr({
		"class" : "cus-prof-detail-lc float-left clearfix"
	});

	var cusProfPic = $('<div>').attr({
		"class" : "cus-img-icn float-left",
		"style" : "background-image:url(" + custHeaderDetails.photoUrl + ")",
		"id" : "cusProfPicID"

	});

	var cusProfText = $('<div>').attr({
		"class" : "cus-prof-pic-txt float-left"
	});

	var cusName = $('<div>').attr({
		"class" : "cus-prof-name-txt",
		"id" : "cusProfNameTxtID"
	});

	cusName.html(custHeaderDetails.name);

	var cusRole = $('<div>').attr({
		"class" : "cus-prof-role-txt"
	});

	if (custHeaderDetails.role)
		cusRole.html(custHeaderDetails.role);

	var cusContact = $('<div>').attr({
		"class" : "cus-prof-role-txt"
	});

	if (custHeaderDetails.phoneNo)
		cusContact.html(custHeaderDetails.phoneNo);

	cusProfText.append(cusName).append(cusRole).append(cusContact);
	cusProfLeftContainer.append(cusProfPic).append(cusProfText);

	var cusProfRightContainer = $('<div>').attr({
		"class" : "cus-prof-detail-rc float-right"
	});

	var rowNewfiId = $('<div>').attr({
		"class" : "cus-detail-rc-row clearfix"
	});
	var rowNewfiIdTitle = $('<div>').attr({
		"class" : "cus-detail-rc-title float-left"
	}).html("Newfi ID");

	var rowNewfiIdValue = $('<div>').attr({
		"class" : "cus-detail-rc-value float-left"
	}).html(custHeaderDetails.loanID);

	rowNewfiId.append(rowNewfiIdTitle).append(rowNewfiIdValue);
	cusProfRightContainer.append(rowNewfiId);

	var rowInitiatedOn = $('<div>').attr({
		"class" : "cus-detail-rc-row clearfix"
	});
	var rowInitiatedOnTitle = $('<div>').attr({
		"class" : "cus-detail-rc-title float-left"
	}).html("Inititated On");
	var createdDateStr;
	var modifiedDateStr;
	createdDateStr = $.datepicker.formatDate('dd/mm/yy', new Date(
			custHeaderDetails.createdDate));
	modifiedDateStr = $.datepicker.formatDate('dd/mm/yy', new Date(
			custHeaderDetails.modifiedDate));

	var rowInitiatedOnValue = $('<div>').attr({
		"class" : "cus-detail-rc-value float-left"
	}).html(createdDateStr);
	rowInitiatedOn.append(rowInitiatedOnTitle).append(rowInitiatedOnValue);
	cusProfRightContainer.append(rowInitiatedOn);

	var rowLastActiveOn = $('<div>').attr({
		"class" : "cus-detail-rc-row clearfix"
	});
	var rowLastActiveOnTitle = $('<div>').attr({
		"class" : "cus-detail-rc-title float-left"
	}).html("Last Acted On");

	var rowLastActiveOnValue = $('<div>').attr({
		"class" : "cus-detail-rc-value float-left"
	}).html(modifiedDateStr);
	rowLastActiveOn.append(rowLastActiveOnTitle).append(rowLastActiveOnValue);
	cusProfRightContainer.append(rowLastActiveOn);

	container.append(cusProfLeftContainer).append(cusProfRightContainer);
	$('#center-panel-cont').html("");
	$('#center-panel-cont').append(container);
}

// Function to append loan details of customer
function appendCustomerLoanDetails(loanDetails) {
	var wrapper = $('<div>').attr({
		"class" : "av-loan-details-wrapper"
	});

	var header = $('<div>').attr({
		"class" : "av-loan-details-header"
	}).html("Loan Details");

	var container = $('<div>').attr({
		"id" : "av-loan-details-container",
		"class" : "av-loan-details-container"
	});

	wrapper.append(header).append(container);

	$('#center-panel-cont').append(wrapper);

	// Append loan detail rows
	appendLoanDetailsRow("File Email", loanDetails.loanEmailId);
	// appendLoanDetailsRow("Single Sign On", "6872604", true);
	appendLoanDetailsRow("Customer", "Edit", true);
	if (loanDetails.loanDetail && loanDetails.loanDetail.loanAmount)
		appendLoanDetailsRow("Loan Amount", "$ "
				+ loanDetails.loanDetail.loanAmount);
	appendLoanDetailsRow("Lock Rate Details", "4.75 %");
	appendLoanDetailsRow("Lock Expiration Date", "02/21/2015");
	appendLoanDetailsRow("Loan Progress", loanDetails.status);
	appendLoanDetailsRow("Credit", "TU-646/EQ-686/EX-685", true);
	appendLoanDetailsRow("Credit Decision", "Pass");
	appendLoanDetailsRow("Loan Purpose", "Purchase TBD");

	// append cust info popup
	appendCustomerEditProfilePopUp();

	$("#uploadFile").change(
			function() {

				photoUpload(this.form, 'uploadCommonImageToS3.do',
						'cusImgIcnID', '', '1', selectedUserDetail.userID);

			});

}

// Function to append loan details row
function appendLoanDetailsRow(label, value, isLink) {
	var row = $('<div>').attr({
		"id" : "ld-" + convertStringToId(label),
		"class" : "av-loan-details-row clearfix"
	});

	var leftCol = $('<div>').attr({
		"class" : "av-loan-details-row-lc float-left"
	}).html(label);
	var rightCol = $('<div>').attr({
		"class" : "av-loan-details-row-rc float-left"
	}).html(value);

	if (isLink) {
		rightCol.addClass('loan-detail-link');
	}

	row.append(leftCol).append(rightCol);

	$('#av-loan-details-container').append(row);
}

// Function to append add team member wrapper in loan managaer view
function appendAddTeamMemberWrapper(parentElement,clearParent,data) {
	var wrapper = $('<div>').attr({
		"class" : "add-team-mem-wrapper"
	}).data("additionalData",data);

	var header = $('<div>').attr({
		"class" : "add-team-mem-header clearfix"
	}).html("Add Team Member");

	var rightHeaderIcon = $('<div>').attr({
		"class" : "header-down-icn float-right"
	});

	header.append(rightHeaderIcon);

	var container = $('<div>').attr({
		"class" : "add-team-mem-container clearfix"
	});

	var userTypeCont = $('<div>').attr({
		"class" : "add-member-input-cont float-left clearfix"
	}).html("User Type");

	var userTypeSel = $('<div>').attr({
		"id" : "add-memeber-user-type",
		"class" : "add-member-sel float-right"
	}).on('click',userTypeClicked);;

	userTypeCont.append(userTypeSel);

	var userNameCont = $('<div>').attr({
		"class" : "add-member-input-cont float-left clearfix"
	}).html("User Name");

	var userNameSel = $('<div>').attr({
		"id" : "add-member-sel",
		"class" : "add-member-sel-search float-right clearfix"
	});

	var userNameInput = $('<input>').attr({
		"id" : "add-member-input",
		"class" : "add-member-input float-left"
	}).on(
			'input',
			function() {
				var name = $('#add-member-input').val();
				console.log("Name entered : " + name);
				// TODO search and display name
				var roleID = $('#add-memeber-user-type').attr("roleID");
				var internalRoleID = $('#add-memeber-user-type').attr(
						"internalRoleID");
				searchUsersBasedOnNameAndRole(name, roleID, internalRoleID);
			});

	var downArrow = $('<div>').attr({
		"class" : "add-member-down-arrow float-right"
	}).on('click', function() {
		if ($('#add-username-dropdown-cont').css("display") == "block") {
			hideUserNameDropDown();
		} else {
			showUserNameDropDown();
		}
	});

	userNameSel.append(userNameInput).append(downArrow);
	userNameCont.append(userNameSel);

	container.append(userTypeCont).append(userNameCont);

	wrapper.append(header).append(container);
	if(clearParent){
		$('#'+parentElement).html("");
	}
	$('#'+parentElement).append(wrapper);

	// function to append create user popup
	appendCreateUserPopup();
	appendUserTypeDropDown();
	appendUserNameDropDown();
}

function appendUserNameDropDown() {
	var dropdownCont = $('<div>').attr({
		"id" : "add-username-dropdown-cont",
		"class" : "add-member-dropdown-cont hide"
	});
	$('#add-member-sel').parent().append(dropdownCont);
}

function showUserNameDropDown(namesList) {
	$('#add-username-dropdown-cont').css({
		"left" : $('#add-member-sel').offset().left
	});
	$('#add-username-dropdown-cont').show();
	paintUserNameDropDown(namesList);
}

function hideUserNameDropDown() {
	$('#add-username-dropdown-cont').hide();
}

function paintUserNameDropDown(values) {
	var dropdownCont = $('#add-username-dropdown-cont');
	dropdownCont.html('');

	if (values != undefined && values.length > 0) {
		for (var i = 0; i < values.length; i++) {
			var value = values[i];
			var dropDownRow = $('<div>').attr({
				"class" : "add-member-dropdown-row",
				"userID" : value.id,
				"role" : value.userRole.label,
				"roleDescription" : value.userRole.roleDescription
			}).html(value.firstName + " " + value.lastName).on('click',
					function(event) {
						event.stopImmediatePropagation();
						var userID = $(this).attr("userID");
						console.log("User id : " + userID);
						hideUserNameDropDown();
						hideMilestoneAddTeamMemberPopup();	//For milestone view
						$('#add-member-input').val("");
						addUserToLoanTeam(userID, selectedUserDetail.loanID);
					});
			dropdownCont.append(dropDownRow);
		}
	}
	var addUserdropDownRow = $('<div>').attr({
		"id" : "add-member-user",
		"class" : "add-member-dropdown-row"
	}).html("Add New User").on('click',showAddUserPopUp);
	dropdownCont.append(addUserdropDownRow);
}

$(document).click(function() {
	if ($('#add-username-dropdown-cont').css("display") == "block") {
		$('#add-member-input').val("");
		hideUserNameDropDown();
	}
});

function userTypeClicked(event){
	event.stopImmediatePropagation();
	if ($('#add-usertype-dropdown-cont').css("display") == "block") {
		hideUserTypeDropDown();
	} else {
		showUserTypeDropDown();
	}
}


/*$(document).on('click', '#add-memeber-user-type', function(event) {
	event.stopImmediatePropagation();
	if ($('#add-usertype-dropdown-cont').css("display") == "block") {
		hideUserTypeDropDown();
	} else {
		showUserTypeDropDown();
	}
});*/

// Click function to create a user

function showAddUserPopUp(){
	event.stopImmediatePropagation();
	hideUserNameDropDown();
	showCreateUserPopup();
}

function showUserTypeDropDown() {
	$('#add-usertype-dropdown-cont').css({
		"left" : $('#add-memeber-user-type').offset().left
	});
	$('#add-usertype-dropdown-cont').show();
}

function hideUserTypeDropDown() {
	$('#add-usertype-dropdown-cont').hide();
}

function appendUserTypeDropDown() {
	var dropdownCont = $('<div>').attr({
		"id" : "add-usertype-dropdown-cont",
		"class" : "add-member-dropdown-cont hide"
	});

	var userRoles = [ {
		"id" : 2,
		"internalRoleID" : 0,
		"roleCd" : "Realtor",
		"label" : "Realtor",
		"roleDescription" : "Realtor"
	} ];

	for (i in newfiObject.internalUserRoleMasters) {
		var internalRole = newfiObject.internalUserRoleMasters[i];
		userRoles.push({
			"id" : 3,
			"internalRoleID" : internalRole.id,
			"label" : internalRole.roleDescription,
		});
	}

	for (var i = 0; i < userRoles.length; i++) {
		var userRole = userRoles[i];
		var dropDownRow = $('<div>').attr({
			"class" : "add-member-dropdown-row",
			"roleID" : userRole.id,
			"internalRoleID" : userRole.internalRoleID,
			"roleCD" : userRole.roleCD
		}).html(userRole.label)
				.on(
						'click',
						function(event) {
							event.stopImmediatePropagation();
							var roleIDCurr = $(this).attr("roleID");
							var roleIDPrev = $('#add-memeber-user-type').attr(
									"roleID");
							$('#add-memeber-user-type').attr("roleID",
									roleIDCurr);
							$('#add-memeber-user-type').attr("internalRoleID",
									$(this).attr("internalRoleID"));
							$('#add-memeber-user-type').html($(this).html());
							hideUserTypeDropDown();
						});
		dropdownCont.append(dropDownRow);
	}

	$('#add-memeber-user-type').parent().append(dropdownCont);
}

$(document).click(function() {
	if ($('#add-usertype-dropdown-cont').css("display") == "block") {
		hideUserTypeDropDown();
	}
});

var users = [ {
	"firstName" : "Jessica",
	"lastName" : "Cockrell",
	"emailId" : "Jessica@domain.com",
	"userRole" : {
		"visibleOnLoanTeam" : true,
		"label" : "Loan Manager"
	}
}, {
	"firstName" : "Regina",
	"lastName" : "Fleming",
	"emailId" : "Regina@domain.com",
	"userRole" : {
		"visibleOnLoanTeam" : true,
		"label" : "Processor"
	}
}, {
	"firstName" : "Scott",
	"lastName" : "Harris",
	"emailId" : "Scott.Harris@domain.com",
	"userRole" : {
		"visibleOnLoanTeam" : true,
		"label" : "Loan Agent"
	}
}, {
	"firstName" : "Brenda",
	"lastName" : "Allen",
	"emailId" : "Brenda@domain.com",
	"userRole" : {
		"visibleOnLoanTeam" : true,
		"label" : "Sales Manager"
	}
}, {
	"firstName" : "Annalisa",
	"lastName" : "Detrick",
	"emailId" : "Annalisa.Detrick@domain.com",
	"userRole" : {
		"visibleOnLoanTeam" : true,
		"label" : "Setup"
	}
} ];

function appendNewfiTeamWrapper(loanDetails) {
	var team = loanDetails.loanTeam;
	var loanID = loanDetails.id;
	var wrapper = $('<div>').attr({
		"class" : "newfi-team-wrapper"
	});

	var header = $('<div>').attr({
		"class" : "newfi-team-header"
	}).html("Newfi Team");

	var container = $('<div>').attr({
		"class" : "newfi-team-container"
	});

	var tableHeader = getTeamListTableHeader();
	container.append(tableHeader);

	for (var i = 0; i < team.length; i++) {
		var tableRow = getTeamListTableRow(team[i], loanID);
		container.append(tableRow);
	}

	wrapper.append(header).append(container);
	$('#center-panel-cont').append(wrapper);
}

function getTeamListTableHeader() {
	var tableHeaderRow = $('<div>').attr({
		"class" : "newfi-team-list-th clearfix"
	});

	var thCol1 = $('<div>').attr({
		"class" : "newfi-team-list-th-col1 newfi-team-list-tr-col1 float-left"
	}).html("User Name");

	var thCol2 = $('<div>').attr({
		"class" : "newfi-team-list-th-col2 newfi-team-list-tr-col2 float-left"
	}).html("User Type");

	var thCol3 = $('<div>').attr({
		"class" : "newfi-team-list-th-col3 newfi-team-list-tr-col3 float-left"
	}).html("Email");

	return tableHeaderRow.append(thCol1).append(thCol2).append(thCol3);
}

function getTeamListTableRow(user, loanID) {
	var tableRow = $('<div>').attr({
		"class" : "newfi-team-list-tr clearfix",
		"userid" : user.id
	});

	var trCol1 = $('<div>').attr({
		"class" : "newfi-team-list-tr-col1 float-left"
	}).html(user.firstName + " " + user.lastName);

	var trCol2 = $('<div>').attr({
		"class" : "newfi-team-list-tr-col2 float-left"
	});

	var userRoleStr = user.userRole.label;
	// TODO -- remove hard coding for internal user
	if (user.userRole.id == 3) {
		// userRoleStr =
		// user.internalUserDetail.internalUserRoleMasterVO.roleDescription;
		var intRoleID = user.internalUserDetail.internalUserRoleMasterVO.id;
		for (j in newfiObject.internalUserRoleMasters) {
			var intMaster = newfiObject.internalUserRoleMasters[j];
			if (intMaster.id == intRoleID)
				userRoleStr = intMaster.roleDescription;
		}
	}

	trCol2.html(userRoleStr);

	var trCol3 = $('<div>').attr({
		"class" : "newfi-team-list-tr-col3 float-left"
	}).html(user.emailId);

	var trCol4 = $('<div>').attr({
		"class" : "newfi-team-list-tr-col4 float-left"
	});

	var trCol5 = $('<div>').attr({
		"class" : "newfi-team-list-tr-col5 float-left"
	});

	var userDelIcn = $('<div>').attr({
		"class" : "user-del-icn",
		"userid" : user.id,
		"loanID" : loanID
	});
	userDelIcn.click(function() {
		var userID = $(this).attr("userid");
		var loanID = $(this).attr("loanid");
		removeUserFromLoanTeam(userID, loanID);
	});
	trCol5.append(userDelIcn);
	return tableRow.append(trCol1).append(trCol2).append(trCol3).append(trCol4)
			.append(trCol5);
}

$(document).on('click', '#ld-customer .loan-detail-link', function(event) {
	event.stopImmediatePropagation();
	if ($('#cus-prof-popup').css("display") == "block") {
		hideCustomerEditProfilePopUp();
	} else {
		showCustomerEditProfilePopUp();
	}
});

$(document).on('click', '#cus-prof-popup', function(event) {
	event.stopImmediatePropagation();
});

$(document).on('keyup', function(e) {
	if (e.which == 27) {
		hideCustomerEditProfilePopUp();
	}
});

/*
 * $(document).click(function() { if ($('#cus-prof-popup').css("display") ==
 * "block") { hideCustomerEditProfilePopUp(); } });
 */

function appendCustomerEditProfilePopUp() {
	var popUpWrapper = $('<div>').attr({
		"id" : "cus-prof-popup",
		"class" : "pop-up-wrapper cus-prof-popup hide"
	});

	var header = $('<div>').attr({
		"class" : "pop-up-header"
	}).html("User Profile - 654321");

	var container = $('<div>').attr({
		"id" : "cus-prof-container",
		"class" : "pop-up-container"
	});

	popUpWrapper.append(header).append(container);

	$('#ld-customer .loan-detail-link').append(popUpWrapper);

	appendCustomerProfEditRow("First Name", selectedUserDetail.firstName,
			"firstNameID");
	appendCustomerProfEditRow("Last Name", selectedUserDetail.lastName,
			"lastNameID");

	// Upload photo row
	appendCustomerProfUploadPhotoRow();

	appendCustomerProfEditRow("City", selectedUserDetail.city, "cityID");
	appendCustomerProfEditRow("State", selectedUserDetail.state, "stateID");
	appendCustomerProfEditRow("Zip", selectedUserDetail.zipCode, "zipCodeID");
	appendCustomerProfEditRow("Email", selectedUserDetail.emailId, "emailIdID");

	// appendCustomerProfEditRow("DOB", selectedUserDetail.dob, "dobID");

	var row = $('<div>').attr({
		"class" : "cust-prof-edit-row clearfix"
	});

	var label = $('<div>').attr({
		"class" : "cust-prof-edit-label float-left"
	}).html("DOB");

	var dob = selectedUserDetail.dob;
	if (dob == null || dob == "" || dob == 'NaN/NaN/NaN') {
		dob = "";
	}
	var dobInput = $('<input>').attr({
		"class" : "prof-form-input date-picker",
		"placeholder" : "MM/DD/YYYY",
		"value" : dob,
		"id" : "dobID"
	}).datepicker({
		orientation : "top auto",
		autoclose : true
	});

	row.append(label).append(dobInput);
	$('#cus-prof-container').append(row);

	$("#dobID").addClass('prof-form-input date-picker').datepicker({
		orientation : "top auto",
		autoclose : true
	});

	// append save button
	var saveBtn = $('<div>').attr({
		"class" : "prof-cust-save-btn",
		"onclick" : "updateUserProfile()"
	}).html("save");

	$('#cus-prof-container').append(saveBtn);

}

function updateUserProfile() {

	var userProfileJson = new Object();

	userProfileJson.id = selectedUserDetail.userID;
	userProfileJson.firstName = $("#firstNameID").val();
	userProfileJson.lastName = $("#lastNameID").val();
	userProfileJson.emailId = $("#emailIdID").val();

	var customerDetails = new Object();

	customerDetails.id = selectedUserDetail.customerId;
	customerDetails.addressCity = $("#cityID").val();
	customerDetails.addressState = $("#stateID").val();
	customerDetails.addressZipCode = $("#zipCodeID").val();
	customerDetails.dateOfBirth = new Date($("#dobID").val()).getTime();

	userProfileJson.customerDetail = customerDetails;

	// ajaxRequest("rest/userprofile/updateprofile", "POST", "json",
	// JSON.stringify(userProfileJson),function(response){});

	$
			.ajax({
				url : "rest/userprofile/managerupdateprofile",
				type : "POST",
				data : {
					"updateUserInfo" : JSON.stringify(userProfileJson)
				},
				dataType : "json",
				success : function(data) {

					$("#cusProfNameTxtID").text(
							userProfileJson.firstName + " "
									+ userProfileJson.lastName);
				},
				error : function(error) {
					alert("error" + error);
				}
			});

	showToastMessage("Succesfully updated");

}

function showCustomerEditProfilePopUp() {
	var offset = $('#ld-customer .loan-detail-link').offset();

	var left = offset.left;
	var top = offset.top;
	$('#cus-prof-popup').css({
		"left" : left + 50,
		"top" : top - 50
	});
	$('#cus-prof-popup').show();
}

function hideCustomerEditProfilePopUp() {
	$('#cus-prof-popup').hide();
}

function appendCustomerProfEditRow(labelTxt, value, id) {
	var row = $('<div>').attr({
		"class" : "cust-prof-edit-row clearfix"
	});

	var label = $('<div>').attr({
		"class" : "cust-prof-edit-label float-left"
	}).html(labelTxt);

	var inputTag = $('<input>').attr({
		"class" : "cust-prof-edit-input float-left",
		"id" : id
	}).val(value);

	row.append(label).append(inputTag);
	$('#cus-prof-container').append(row);
}

function appendCustomerProfUploadPhotoRow() {
	var row = $('<div>').attr({
		"class" : "cust-prof-edit-row clearfix"
	});

	var label = $('<div>').attr({
		"class" : "cust-prof-edit-label float-left"
	}).html("Upload Photo");

	var uploadPhotoCont = $('<div>').attr({
		"class" : "cust-prof-upload-cont float-left clearfix"
	});

	var uploadIcn = $('<div>').attr({
		"class" : "cust-prof-upload-icn float-left",
		"style" : "background-image:url(" + selectedUserDetail.photoUrl + ")",
		"id" : "custprofuploadicnID"
	});

	var uploadPhotoRc = $('<div>').attr({
		"class" : "cust-prof-upload-rc float-left"
	});

	var uploadPhotoFileName = $('<div>').attr({
		"class" : "cust-prof-upload-filename"
	}).html("Jane-Profile.png");

	var imageForm = $('<form>').attr({

	});

	var inputHiddenFile = $('<input>').attr({
		"type" : "file",
		"id" : "uploadFile",
		"name" : "fileName"

	});

	var UserId = $('<input>').attr({
		"type" : "hidden",
		"id" : "userIdId",
		"name" : "userId",
		"value" : selectedUserDetail.userID
	});

	var uploadImage = $('<div>').attr({
		"class" : "uploadImage"

	}).hide();

	imageForm.append(inputHiddenFile);
	imageForm.append(UserId);
	uploadImage.append(imageForm);

	var uploadBtn = $('<div>').attr({
		"class" : "cust-prof-upload-btn",

	}).click(uploadeImage).html("upload");

	uploadPhotoRc.append(uploadPhotoFileName).append(uploadBtn).append(
			uploadImage);
	uploadPhotoCont.append(uploadIcn).append(uploadPhotoRc);
	row.append(label).append(uploadPhotoCont);
	$('#cus-prof-container').append(row);
}

function uploadeImage() {

	$("#uploadFile").trigger('click');

}

// Function to append create user popup
function appendCreateUserPopup() {
	var popUpWrapper = $('<div>').attr({
		"id" : "create-user-popup",
		"class" : "pop-up-wrapper create-user-popup hide"
	});

	var header = $('<div>').attr({
		"class" : "pop-up-header"
	}).html("Create User");

	var container = $('<div>').attr({
		"id" : "create-user-container",
		"class" : "pop-up-container clearfix"
	});
	popUpWrapper.append(header).append(container);
	$('#add-member-sel').append(popUpWrapper);

	appendCreateUserPopupFirstName();
	appendCreateUserPopupLastName();
	// TODO-decide what needs to be saved for internal users and realtors
	// appendCreateUserPopupStreetAddr();
	// appendCreateUserPopupCity();
	// appendCreateUserPopupState();
	// appendCreateUserPopupZip();
	// appendCreateUserPopupDOB();
	appendCreateUserPopupEmail();

	// save button
	var saveBtn = $('<div>').attr({
		"class" : "prof-cust-save-btn"
	}).html("save").on(
			'click',
			function(event) {
				event.stopImmediatePropagation();

				var user = new Object();
				user.emailId = $('#create-user-emailId').val();
				user.firstName = $('#create-user-first-name').val();
				user.lastName = $('#create-user-last-name').val();
				console.log("Create user button clicked. User : "
						+ JSON.stringify(user));

				if (user.firstName == "") {
					showToastMessage("First name cannot be empty");
					return;
				} else if (user.lastName == "") {
					showToastMessage("Last name cannot be empty");
					return;
				} else if (user.emailId == "") {
					showToastMessage("Email ID cannot be empty");
					return;
				}
				user.userRole = {
					id : $("#add-memeber-user-type").attr("roleid")
				};
				if ($("#add-memeber-user-type").attr("roleid") == "3") {
					user.internalUserDetail = {
						internalUserRoleMasterVO : {
							id : $("#add-memeber-user-type").attr(
									"internalroleid")
						}
					}
				}
				;
				createUserAndAddToLoanTeam(user);

			});

	$('#create-user-popup').append(saveBtn);
}

$(document).on('click', '#create-user-popup', function(event) {
	event.stopImmediatePropagation();
});

$(document).click(function() {
	if ($('#create-user-popup').css("display") == "block") {
		hideCreateUserPopup();
	}
});

function showCreateUserPopup() {
	var left = $('#center-panel-cont').offset().left;
	var top = $('#add-member-sel').offset().top;
	$('#create-user-popup').css({
		"left" : left + 20,
		"top" : top + 50
	});
	$('#create-user-first-name').val("");
	$('#create-user-last-name').val("");
	$('#create-user-emailId').val("");
	$('#create-user-popup').show();
}

function hideCreateUserPopup() {
	$('#create-user-popup').hide();
}

function appendCreateUserPopupFirstName() {
	var row = $('<div>').attr({
		"class" : "create-user-popup-cont clearfix float-left"
	});
	var label = $('<div>').attr({
		"class" : "create-user-popup-label float-left"
	}).html("First Name");
	var inputBox = $('<input>').attr({
		"class" : "create-user-popup-input",
		"id" : "create-user-first-name"
	}).val("");
	row.append(label).append(inputBox);
	$('#create-user-container').append(row);
}

function appendCreateUserPopupLastName() {
	var row = $('<div>').attr({
		"class" : "create-user-popup-cont clearfix float-left"
	});
	var label = $('<div>').attr({
		"class" : "create-user-popup-label float-left"
	}).html("Last Name");
	var inputBox = $('<input>').attr({
		"class" : "create-user-popup-input",
		"id" : "create-user-last-name"
	}).val("");
	row.append(label).append(inputBox);
	$('#create-user-container').append(row);
}

function appendCreateUserPopupStreetAddr() {
	var row = $('<div>')
			.attr(
					{
						"class" : "create-user-popup-cont create-user-popup-addr clearfix float-left"
					});
	var label = $('<div>').attr({
		"class" : "create-user-popup-label  float-left"
	}).html("Street Address");
	var inputBox = $('<input>').attr({
		"class" : "create-user-popup-input create-user-popup-input-lg"
	}).val("30650 W Ball rd Lot 203");
	row.append(label).append(inputBox);
	$('#create-user-container').append(row);
}

function appendCreateUserPopupCity() {
	var row = $('<div>')
			.attr(
					{
						"class" : "create-user-popup-cont create-user-popup-city clearfix float-left"
					});
	var label = $('<div>').attr({
		"class" : "create-user-popup-label float-left"
	}).html("City");
	var inputBox = $('<input>').attr({
		"class" : "create-user-popup-input create-user-popup-input-sm"
	}).val("Sedalia");
	row.append(label).append(inputBox);
	$('#create-user-container').append(row);
}

function appendCreateUserPopupState() {
	var row = $('<div>')
			.attr(
					{
						"class" : "create-user-popup-cont create-user-popup-state clearfix float-left"
					});
	var label = $('<div>').attr({
		"class" : "create-user-popup-label float-left"
	}).html("State");
	var inputBox = $('<input>').attr({
		"class" : "create-user-popup-input create-user-popup-input-vsm"
	}).val("MO");
	row.append(label).append(inputBox);
	$('#create-user-container').append(row);
}

function appendCreateUserPopupZip() {
	var row = $('<div>')
			.attr(
					{
						"class" : "create-user-popup-cont create-user-popup-zip clearfix float-left"
					});
	var label = $('<div>').attr({
		"class" : "create-user-popup-label float-left"
	}).html("Zip");
	var inputBox = $('<input>').attr({
		"class" : "create-user-popup-input create-user-popup-input-sm"
	}).val("65301");
	row.append(label).append(inputBox);
	$('#create-user-container').append(row);
}

function appendCreateUserPopupEmail() {
	var row = $('<div>').attr({
		"class" : "create-user-popup-cont clearfix float-left"
	});
	var label = $('<div>').attr({
		"class" : "create-user-popup-label float-left"
	}).html("Email");
	var inputBox = $('<input>').attr({
		"class" : "create-user-popup-input",
		"id" : "create-user-emailId"
	}).val("");
	row.append(label).append(inputBox);
	$('#create-user-container').append(row);
}

function appendCreateUserPopupDOB() {
	var row = $('<div>').attr({
		"class" : "create-user-popup-cont clearfix float-left"
	});
	var label = $('<div>').attr({
		"class" : "create-user-popup-label float-left"
	}).html("DOB");
	var inputBox = $('<input>').attr({
		"class" : "create-user-popup-input"
	}).val("04/01/1984");
	row.append(label).append(inputBox);
	$('#create-user-container').append(row);
}

/*
 * Functions for agent view needs list page
 */

var docData = {
	"liability" : [ {
		"isChecked" : "true",
		"title" : "Salaried-W-2 form",
		"desc" : "Salaried-W-2 form"
	}, {
		"isChecked" : "true",
		"title" : "Other income",
		"desc" : "Other income"
	}, {
		"isChecked" : "true",
		"title" : "Interest/Dividend",
		"desc" : "Interest/Dividend"
	}, {
		"isChecked" : "true",
		"title" : "Alimony/Child Support",
		"desc" : "Alimony/Child Support"
	}, {
		"isChecked" : "false",
		"title" : "Alimony/Child Support",
		"desc" : "Alimony/Child Support"
	}, {
		"isChecked" : "false",
		"title" : "Rental Income",
		"desc" : "Rental Income"
	}, {
		"isChecked" : "false",
		"title" : "Social security or disability income",
		"desc" : "Social security or disability income"
	}, {
		"isChecked" : "false",
		"title" : "Award letter",
		"desc" : "Award letter"
	}, {
		"isChecked" : "false",
		"title" : "YTD P/L statement",
		"desc" : "YTD P/L statement"
	}, {
		"isChecked" : "false",
		"title" : "Federal Tax returns",
		"desc" : "Federal Tax returns"
	}, {
		"isChecked" : "false",
		"title" : "Payroll Stubs",
		"desc" : "Payroll Stubs"
	} ],
	"property" : [ {
		"isChecked" : "true",
		"title" : "Condos and PDU's",
		"desc" : "Condos and PDU's"
	}, {
		"isChecked" : "true",
		"title" : "Purchase contract from home",
		"desc" : "Purchase contract from home"
	}, {
		"isChecked" : "true",
		"title" : "Home Owner's insurance",
		"desc" : "Home Owner's insurance"
	}, {
		"isChecked" : "true",
		"title" : "Property tax bill",
		"desc" : "Property tax bill"
	}, {
		"isChecked" : "false",
		"title" : "Home Owner's hazard insurance policy",
		"desc" : "Home Owner's hazard insurance policy"
	}, {
		"isChecked" : "false",
		"title" : "Cancelled check rents",
		"desc" : "Cancelled check rents"
	} ],
	"asset" : [ {
		"isChecked" : "true",
		"title" : "Cancelled statement from close of home",
		"desc" : "Cancelled statement from close of home"
	}, {
		"isChecked" : "true",
		"title" : "Purchase agreement",
		"desc" : "Purchase agreement"
	}, {
		"isChecked" : "false",
		"title" : "Letter from provider of home",
		"desc" : "Letter from provider of home"
	}, {
		"isChecked" : "false",
		"title" : "Retirement fund or stock portfolio",
		"desc" : "Retirement fund or stock portfolio"
	}, {
		"isChecked" : "false",
		"title" : "Bank statement",
		"desc" : "Bank statement"
	} ],
	"other" : [ {
		"isChecked" : "true",
		"title" : "Cancelled statement from close of home",
		"desc" : "Cancelled statement from close of home"
	}, {
		"isChecked" : "true",
		"title" : "Purchase agreement",
		"desc" : ""
	}, {
		"isChecked" : "false",
		"title" : "Letter from provider of home",
		"desc" : "Letter from provider of home"
	}, {
		"isChecked" : "false",
		"title" : "Retirement fund or stock portfolio",
		"desc" : "Retirement fund or stock portfolio"
	}, {
		"isChecked" : "false",
		"title" : "Bank statement",
		"desc" : "Bank statement"
	} ]
};

function paintAgentNeedsListPage() {
	appendDocumentToolTip();
	appendCustomerDetailHeader();
	appendInitialNeedsListWrapper();
	paintUploadNeededItemsPage();
}

function appendInitialNeedsListWrapper() {
	var wrapper = $('<div>').attr({
		"id" : "initial-needs-wrapper",
		"class" : "initial-needs-wrapper"
	});

	var header = $('<div>').attr({
		"class" : "initial-needs-header"
	}).html("initial need list");

	var container = $('<div>').attr({
		"class" : "initial-needs-container clearfix"
	});

	var incomeDocContainer = getNeedsListDocumentContainer("income",
			docData.income).addClass('float-left');

	var propertyDocContainer = getNeedsListDocumentContainer("property",
			docData.property).addClass('float-right');

	var assetDocContainer = getNeedsListDocumentContainer("liabilities",
			docData.asset).addClass('float-right');

	var otherDocContainer = getNeedsListDocumentContainer("other",
			docData.other).addClass('float-left');

	container.append(incomeDocContainer).append(propertyDocContainer).append(
			assetDocContainer).append(otherDocContainer);

	wrapper.append(header).append(container);
	$('#center-panel-cont').append(wrapper);

	appendAddNeedsContainer();

	// append save button
	var savebtnWrapper = $('<div>').attr({
		"class" : "need-list-save-btn-wrapper"
	});

	var savebtn = $('<div>').attr({
		"class" : "need-list-save-btn"
	}).html("Save Needs");

	savebtnWrapper.append(savebtn);

	$('#center-panel-cont').append(savebtnWrapper);
}

function getNeedsListDocumentContainer(docType, documents) {
	var docWrapper = $('<div>').attr({
		"class" : "initial-list-doc-wrapper",
		"data-doc-type" : docType
	});

	var header = $('<div>').attr({
		"class" : "initial-list-doc-header"
	}).html(docType + " Documents");

	var container = $('<div>').attr({
		"class" : "initial-list-doc-container"
	});

	for (var i = 0; i < documents.length; i++) {
		var row = getNeededDocumentRow(documents[i]);
		container.append(row);
	}

	return docWrapper.append(header).append(container);
}

function getNeededDocumentRow(document) {
	var row = $('<div>').attr({
		"class" : "initial-list-doc-row clearfix"
	});

	var checkBox = $('<div>').attr({
		"class" : "doc-checkbox float-left"
	});
	if (document.isChecked == "true") {
		checkBox.addClass('doc-checked');
	} else {
		checkBox.addClass('doc-unchecked');
	}

	var docTitle = $('<div>').attr({
		"class" : "doc-title float-left",
		"title" : document.desc
	}).html(document.title);

	/*
	 * docTitle.bind('mouseenter',{"desc" : document.desc},function(event){ var
	 * leftOffset = $(this).offset().left; var topOffset = $(this).offset().top;
	 * var desc = event.data.desc; showDocumentToolTip(desc, topOffset,
	 * leftOffset); });
	 * 
	 * docTitle.bind('mouseleave',function(event){ hideDocumentToolTip(); });
	 */

	return row.append(checkBox).append(docTitle);
}

// Click event for document checkbox
$(document).on('click', '.doc-checkbox', function() {
	if ($(this).hasClass('doc-checked')) {
		$(this).removeClass('doc-checked');
		$(this).addClass('doc-unchecked');
	} else {
		$(this).removeClass('doc-unchecked');
		$(this).addClass('doc-checked');
	}
});

var docTypes = [ "income", "property", "liability", "other" ];

function appendAddNeedsContainer() {
	var wrapper = $('<div>').attr({
		"class" : "add-needs-wrapper"
	});

	var header = $('<div>').attr({
		"class" : "initial-list-doc-header"
	}).html("Add New Needs");

	var container = $('<div>').attr({
		"class" : "add-needs-container"
	});

	var row1 = $('<div>').attr({
		"class" : "add-needs-input-row clearfix float-left"
	});
	var row1Label = $('<div>').attr({
		"class" : "add-needs-input-label float-left"
	}).html("Document Type");
	var row1Select = $('<select>').attr({
		"id" : "need_doc_type",
		"class" : "add-needs-input-edit float-left capitalize"
	});

	// Append options
	for (var i = 0; i < docTypes.length; i++) {
		var option = $('<option>').attr({
			"class" : "add-needs-input-edit"
		}).html(docTypes[i]);
		row1Select.append(option);
	}

	row1.append(row1Label).append(row1Select);

	var row2 = $('<div>').attr({
		"class" : "add-needs-input-row clearfix float-left"
	});
	var row2Label = $('<div>').attr({
		"class" : "add-needs-input-label float-left"
	}).html("Document Title");
	var row2Input = $('<input>').attr({
		"id" : "need_doc_title",
		"class" : "add-needs-input-edit float-left"
	});

	row2.append(row2Label).append(row2Input);

	var row3 = $('<div>').attr({
		"class" : "add-needs-input-row add-needs-input-last-row  clearfix"
	});
	var row3Label = $('<div>').attr({
		"class" : "add-needs-input-label float-left"
	}).html("Document Desc");
	var row3Input = $('<input>').attr({
		"id" : "need_doc_desc",
		"class" : "add-needs-input-edit float-left"
	});

	row3.append(row3Label).append(row3Input);
	container.append(row1).append(row2).append(row3);

	var addNeedsBtn = $('<div>').attr({
		"class" : "add-needs-btn",
		"onclick" : "saveCustomNeed()"
	}).html("Add Needs");

	container.append(addNeedsBtn);

	wrapper.append(header).append(container);
	$('#initial-needs-wrapper').append(wrapper);
}

$(document).on('keyup', '#need_doc_title', function() {

	var data = contxt.customList[$("#need_doc_type").val()];
	var searchData = [];
	for (var i = 0; i < data.length; i++) {
		searchData[i] = data[i];
		searchData[i].label = data[i].title;
	}
	initializeDocTitleAutoComplete(searchData);
});

function initializeDocTitleAutoComplete(searchData) {
	$('#need_doc_title').autocomplete({
		minLength : 0,
		source : searchData,
		focus : function(event, ui) {
			$("#need_doc_title").val(ui.item.title);
			return false;
		},
		select : function(event, ui) {
			$("#need_doc_title").val(ui.item.title);
			$('#need_doc_desc').val(ui.item.desc);
			return false;
		},
		open : function() {
			$('.ui-autocomplete').width($('#need_doc_title').width() + 15);
		}
	}).autocomplete("instance")._renderItem = function(ul, item) {
		return $("<li>").append(item.title).appendTo(ul);
	};
	// $('.ui-autocomplete>li').width($('#need_doc_title').width());
}

// Click event for add needs button
/*
 * $(document).on( 'click', '.add-needs-btn', function() { var docType =
 * $('#need_doc_type :selected').text(); var docTitle =
 * $('#need_doc_title').val(); var docDesc = $('#need_doc_desc').val();
 * 
 * if (docTitle == "") return; if (docDesc === "") return;
 * 
 * var document = { "isChecked" : "true", "title" : docTitle, "desc" : docDesc };
 * var newNeedRow = getNeededDocumentRow(document);
 * 
 * $('.initial-list-doc-wrapper[data-doc-type="' + docType + '"]')
 * .find('.initial-list-doc-container').append(newNeedRow); clearAddNeedForm();
 * });
 */

function clearAddNeedForm() {
	$('#need_doc_title').val('');
	$('#need_doc_desc').val('');
}

function appendDocumentToolTip() {
	var toolTipContainer = $('<div>').attr({
		"id" : "doc-tool-tip",
		"class" : "tool-tip-container hide"
	});
	$('#center-panel-cont').append(toolTipContainer);
}

function showDocumentToolTip(desc, topOffset, leftOffset) {
	$('#doc-tool-tip').html(desc);
	$('#doc-tool-tip').css({
		"left" : leftOffset + 20,
		"top" : topOffset
	});
	$('#doc-tool-tip').show();
}

function hideDocumentToolTip() {
	$('#doc-tool-tip').hide();
}

// TODO - fetches loan details for a loan id
function getLoanDetails(loanID) {
	ajaxRequest("rest/loan/" + loanID, "GET", "json", {}, paintAgentLoanPage);
}

function removeUserFromLoanTeam(userID, loanID) {
	ajaxRequest("rest/loan/" + loanID + "/team?userID=" + userID, "DELETE",
			"json", {}, onReturnOfRemoveUserFromLoanTeam);
}

function onReturnOfRemoveUserFromLoanTeam(data) {

	var editLoanTeamVO = data.resultObject;
	var result = editLoanTeamVO.operationResult;
	if (!result) {
		alert("An error occurred, kindly contact admin.");
		return;
	}

	var loanID = editLoanTeamVO.loanID;
	var userID = editLoanTeamVO.userID;

	var teamMemberRow = $(".user-del-icn[userid=" + userID + "][loanid="
			+ loanID + "]");
	teamMemberRow.parent().parent().remove();
}

function addUserToLoanTeam(userID, loanID) {
	
	var addData=$('.add-team-mem-wrapper').data('additionalData');
	
	if(addData && addData.OTHURL){
		
		addData.userID=userID;
		ajaxRequest(addData.OTHURL, "POST",
				"json", JSON.stringify(addData)  , onReturnOfAddUserToLoanTeam);
		return;
	}
	
	
	ajaxRequest("rest/loan/" + loanID + "/team?userID=" + userID, "POST",
			"json", {}, onReturnOfAddUserToLoanTeam);
}

function onReturnOfAddUserToLoanTeam(data) {

	var editLoanTeamVO = data.resultObject;
	var result = editLoanTeamVO.operationResult;
	if (!result) {
		showToastMessage("An error occurred, kindly contact admin.");
		return;
	}

	var loanID = editLoanTeamVO.loanID;
	var userID = editLoanTeamVO.userID;

	var existingDiv = $('.newfi-team-container').find(
			'.newfi-team-list-tr[userid=' + userID + ']');
	if (existingDiv != undefined && existingDiv.length > 0) {
		showToastMessage("User already exists on the loan team.");
		return;
	}

	var teamMemberRow = getTeamListTableRow(editLoanTeamVO.user, loanID);
	var teamContainer = $(".newfi-team-container").append(teamMemberRow);
	showToastMessage("User added to loan team.");
}

function searchUsersBasedOnNameAndRole(name, roleID, internalRoleID) {

	var restURL = "rest/userprofile/search?name=" + name;
	if (roleID != undefined && roleID > 0)
		restURL += "&roleID=" + roleID;
	if (internalRoleID != undefined && internalRoleID > 0)
		restURL += "&internalRoleID=" + internalRoleID;

	ajaxRequest(restURL, "GET", "json", {}, onReturnOfUserSearchToAddToLoanTeam);

}

function onReturnOfUserSearchToAddToLoanTeam(data) {
	showUserNameDropDown(data.resultObject)
}

function createUserAndAddToLoanTeam(user) {

	ajaxRequest("rest/userprofile/", "POST", "json", JSON.stringify(user),
			onReturnOfCreateUserAndAddToLoanTeam);

}

function onReturnOfCreateUserAndAddToLoanTeam(data) {
	console.log("Return : " + JSON.stringify(data));
	var result = data.resultObject;
	hideCreateUserPopup();
	hideMilestoneAddTeamMemberPopup();
	$('#add-member-input').val("");

	addUserToLoanTeam(result.id, selectedUserDetail.loanID);

}

function entryPointForAgentView(loanID, viewName) {
	if (selectedUserDetail === undefined || selectedUserDetail.loanID != loanID)
		ajaxRequest("rest/loan/" + loanID + "/retrieveDashboard", "GET",
				"json", undefined, function(response) {
					resetSelectedUserDetailObject(response.resultObject);
					entryPointAgentViewChangeNav(viewName);

				});
	else
		entryPointAgentViewChangeNav(viewName)

}

function entryPointAgentViewChangeNav(viewName) {

	paintMyLoansView();
	changeAgentSecondaryLeftPanel('lp-step' + viewName);
}