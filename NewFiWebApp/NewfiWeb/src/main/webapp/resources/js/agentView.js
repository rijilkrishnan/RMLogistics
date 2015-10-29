
/*
 *Contains JavaScript functions for agent dashboard pages
 */
var isAgentTypeDashboard;
var docData = [];
var currentLoanType = null;
var mobileCarrierNames = [];
var stateLists = [];
var customerFetchCount=15;
var currentElement="";
var isSalesManager="";
var isLoanManager="";
var isRealtor="";
var isArchivedLoans = "";
var fetchedCount;


LOAN_ENUM = {
	ALL : "ALL",
	NEW_PROSPECT : "NEW PROSPECT",
	LEAD : "LEAD",
	NEW_LOAN : "NEW LOAN",
	IN_PROGRESS : "IN PROGRESS",
	CLOSED : "CLOSED",
	WITHDRAWN : "WITHDRAWN",
	DECLINED : "DECLINED",
	DELETE : "DELETE"
};

var trackingID  = "${initParam.trackingID}";
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', trackingID, 'auto');
$(document).on('click',"#cus-prof-popup",function(){

	if($('#state-dropdown-wrapper').css("display") == "block"){
		toggleStateDropDown();
	}
	if($('#carrier-dropdown-wrapper').css("display")=="block"){
		toggleCarrierDropDown();
	}

});

function getAgentSecondaryLeftNav() {
	var leftTab2Wrapper = $('<div>').attr({
		"class" : "lp-t2-wrapper",
		"id" : "agent-sec-nav"
	});
	newfiObject.applicationNavTab=undefined;
	var step0 = getAgentSecondaryLeftNavStep(0, "talk to<br/>your team");
	var step1 ="";
	if(!userIsRealtor()){
		step1 = getAgentSecondaryLeftNavStep(1, "loan<br/>application");
		newfiObject.applicationNavTab=step1;
	}
	var step2 = '';
	if (!userIsRealtor()) {
		step2 = getAgentSecondaryLeftNavStep(2, "summary");
	}

	//NEXNF-661
	var step3 ="";
	if(newfiObject.user.userRole.id!=2){
		step3=getAgentSecondaryLeftNavStep(3, "programs<br />and rates");
	}
	
	//NEXNF-661
	var text="";
	if(newfiObject.user.userRole.id==2){
		text="upload<br />contract items";
	}else{
		text="manage<br />documents";//jira-711
	}
	var step4 = getAgentSecondaryLeftNavStep(4, text);
	//NEXNF-661
	var text1="";
	if(newfiObject.user.userRole.id==2){
		text1="transaction<br />progress";
	}else{
		text1="loan<br />progress";
	}
	var step5 = getAgentSecondaryLeftNavStep(5, text1);

	if (userIsRealtor()) {
		return leftTab2Wrapper.append(step0).append(step1).append(step3)
				.append(step4).append(step5);
	}

	//NEXNF-744 Change of position of loan summary in sec nav
	return leftTab2Wrapper.append(step0).append(step2).append(step1).append(
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

function paintAgentDashboard(loanType) {
	ga('set', 'page', '/agent-dashboard');
	ga('send', 'pageview');
	scrollToTop();
	selectedUserDetail = undefined;
	$('.lp-right-arrow').remove();
	$('#right-panel').html('');
	$('.lp-item').removeClass('lp-item-active');
	var agentDashboardMainContainer = $('<div>').attr({
		"id" : "agent-dashboard-container",
		"class" : "rp-agent-dashboard float-left"
	});
	$('#right-panel').append(agentDashboardMainContainer);
	currentLoanType = loanType;
	reInitializeGlobalvariables();
	$(window).scrollTop(0);
	if (loanType == "workloans") {
		$('#lp-work-on-loan').addClass('lp-item-active');
		getDashboardRightPanelForWorkLoans();
	} else if (loanType == "myloans") {
		$('#lp-my-loans').addClass('lp-item-active');
		getDashboardRightPanelForMyLoans();
	} else if (loanType == "archivesloans") {
		$('#lp-my-archives').addClass('lp-item-active');
		getDashboardRightPanelForArchivesLoans();
	}else if (loanType == "myLeads"){
		$('#lp-my-lead').addClass('lp-item-active');		
		getDashboardPanelMyLeads();
	}
	adjustAgentDashboardOnResize();
	var contxt = getNotificationContext(0, newfiObject.user.id);
	contxt.getLoanNotificationByType(function(ob) {
		ob.populateLoanNotification();
	});
	contxt.getNotificationForUser();
	addContext("notification", contxt);
}
/*Resetting gloal variables used for sorting loan list in dashboard*/
function reInitializeGlobalvariables(){
 	 fetchedCount=undefined;
}

function getDashboardPanelMyLeads(loanType){
	
	var startLimit=0;
	if(fetchedCount)
		startLimit=fetchedCount;
	newfiObject.fetchLock=true;
	var userID = newfiObject.user.id;
	ajaxRequest("rest/loan/retrieveDashboardForMyLeads/" + userID, "GET",
			"json", {"startlimit":startLimit,"count":customerFetchCount}, function(response){
				newfiObject.fetchLock=undefined;
				isArchivedLoans = false;
				if(startLimit==0){
					paintLeadsAgentDashboardRightPanel(response.resultObject);
				}else{
					if(response.resultObject&&response.resultObject.leads){
						appendLeads("leads-container", response.resultObject, true);
					}
				}	
				startLimit=startLimit+customerFetchCount;
				fetchedCount=startLimit;		
			});
	
}
function paintAgentDashboardCallBack(data) {
	$('#main-body-wrapper').html(data);

	adjustAgentDashboardOnResize();
}

function getMoreCustomers(){
	if (currentLoanType == "workloans") {
		getDashboardRightPanelForWorkLoans();
	} else if (currentLoanType == "myloans") {
		getDashboardRightPanelForMyLoans();
	} else if (currentLoanType == "archivesloans") {		
		getDashboardRightPanelForArchivesLoans();		
	}
	// Added for leads lazy loading
	else if (currentLoanType == "myLeads") {		
		getDashboardPanelMyLeads();
	}
}
// ajax call to get dashboard for work loans
function getDashboardRightPanelForWorkLoans(loanType) {
	var userID = newfiObject.user.id;
	ajaxRequest("rest/loan/retrieveDashboardForWorkLoans/" + userID, "GET",
			"json", {}, paintAgentDashboardRightPanel);
}

// ajax call to get dashboard for my loans
function getDashboardRightPanelForMyLoans(loanType) {
	var startLimit=0;
	if(fetchedCount)
		startLimit=fetchedCount;
	newfiObject.fetchLock=true;
	var userID = newfiObject.user.id;
	ajaxRequest("rest/loan/retrieveDashboardForMyLoans/" + userID, "GET",
			"json", {"startlimit":startLimit,"count":customerFetchCount}, function(response){
				newfiObject.fetchLock=undefined;
				if(startLimit==0){
					isArchivedLoans = false;
					paintAgentDashboardRightPanel(response.resultObject.customers);
				}else{
					if(response.resultObject&&response.resultObject.customers){
						customers=response.resultObject.customers
						appendCustomers("leads-container", customers,true);
					}
				}	
				startLimit=startLimit+customerFetchCount;
				fetchedCount=startLimit;		
			});
}

// ajax call to get dashboard for archive loans
function getDashboardRightPanelForArchivesLoans(loanType) {
	var userID = newfiObject.user.id;
	isArchivedLoans = true;
	ajaxRequest("rest/loan/retrieveDashboardForArchiveLoans/" + userID, "GET",
			"json", {}, paintAgentDashboardForArchiveLoans);
}
function paintAgentDashboardForArchiveLoans(data){
	if(data.error == null){
		paintAgentDashboardRightPanel(data.resultObject.customers);
	}
	
}
function paintAgentDashboardRightPanel(data) {
	   /* data = data.resultObject.customers;*/

		$('#agent-dashboard-container').html("");
		var header = $('<div>').attr({
			"class" : "agent-customer-list-header clearfix"
		});
		var leftCon = $('<div>').attr({
			"class" : "agent-customer-list-header-txt page-header-loan-dashboard  float-left"
		});
	
		//NEXNF-877
		if(isArchivedLoans){
			leftCon.html("Archives");			
		}else {
			leftCon.html("Pipeline");
		}
	
		var rightCon = $('<div>').attr({
			"class" : "agent-customer-list-header-rc float-right clearfix"
		});
		
		var searchCon = $('<div>').attr({
			"class" : "clearfix float-left"
		});
		
		var searchIcon = $('<div>').attr({
			"class" : "search-icn float-left",
		
		}).on('click', function(e) {
			
			$(this).parent().find('.search-input').show().focus();
		    if($('#customerSearch').val()!="" && $('#customerSearch').val()!=undefined){
		    	searchByTermAndLoanType(data);
				$(this).show();
		    }
		
		});
	
		var searchInputBox = $('<input>').attr({
			"class" : "search-input float-left hide",
			"id" : "customerSearch"
		}).on('keyup', function(e) {
			if (e.which == 13) {
				if ($(this).val() == "") {
					$(this).hide();
				}
				searchByTermAndLoanType(data);
				$(this).parent().find('.search-icn').show();
		
			}
		}).on('blur', function() {
			if ($(this).val() == "") {
				$(this).hide();
			}
		
			$(this).parent().find('.search-icn').show();
		});
	
	
	    searchCon.append(searchInputBox).append(searchIcon);
	    rightCon.append(searchCon);
	
		header.append(leftCon).append(rightCon);
		$('#agent-dashboard-container').append(header);
		appendAgentDashboardContainer();
		appendCustomers("leads-container",data,false);	

}
function paintLeadsAgentDashboardRightPanel(data){

	var header = $('<div>').attr({
		"class" : "agent-customer-list-header clearfix"
	});
	var leftCon = $('<div>').attr({
		"class" : "agent-customer-list-header-txt page-header-loan-dashboard  float-left"
	});

	leftCon.html("Leads");

	var rightCon = $('<div>').attr({
		"class" : "agent-customer-list-header-rc float-right clearfix"
	});
	
	var searchCon = $('<div>').attr({
		"class" : "clearfix float-left"
	});
	
	var searchIcon = $('<div>').attr({
		"class" : "search-icn float-left",
	
	}).on('click', function(e) {
		
		$(this).parent().find('.search-input').show().focus();
	    if($('#customerSearch').val()!="" && $('#customerSearch').val()!=undefined){
	    	searchLeadsPageByName(data.leads);
			$(this).show();
	    }
	
	});

	var searchInputBox = $('<input>').attr({
		"class" : "search-input float-left hide",
		"id" : "customerSearch"
	}).on('keyup', function(e) {
		if (e.which == 13) {
			if ($(this).val() == "") {
				$(this).hide();
			}
			searchLeadsPageByName(data.leads);
			$(this).parent().find('.search-icn').show();
	
		}
	}).on('blur', function() {
		if ($(this).val() == "") {
			$(this).hide();
		}
	
		$(this).parent().find('.search-icn').show();
	});


    searchCon.append(searchInputBox).append(searchIcon);
    rightCon.append(searchCon);

	header.append(leftCon).append(rightCon);
	$('#agent-dashboard-container').empty();
	$('#agent-dashboard-container').append(header);
	appendAgentDashboardContainer();
	appendLeads("leads-container",data, false);	

}
function searchByTermAndLoanType(customers) {
	var searchTerm = $("#customerSearch").val();
	var loanType = $(".filter-selected").attr('id');

	var filteredResult = searchCustomerLoanByLoanStatus(customers, loanType);
	var finalResults = filterCustomerName(filteredResult, searchTerm);
	appendCustomers("leads-container", finalResults);

}


function searchLeadsPageByName(customers) {
	var searchTerm = $("#customerSearch").val();
	var loanType = $(".filter-selected").attr('id');

	
	//var filteredResult = searchCustomerLoanByLoanStatus(customers, loanType);
	var finalResults = filterCustomerName(customers, searchTerm);
	
	var customersObject = {
			"leads" : finalResults
	}
	//appendLeads("leads-container", finalResults);
	appendLeads("leads-container",customersObject, false);

}

function searchCustomerLoanByLoanStatus(customers, loanStatus) {
	var searchObject = new Array();

	if (loanStatus != undefined && loanStatus != LOAN_ENUM.ALL ) {
		for (i in customers) {
			if (customers[i].loanStatus == loanStatus) {
				searchObject.push(customers[i]);
			}
		}
	} else {
		searchObject = customers;
	}
	return searchObject;
}

function filterCustomerName(customer, searchVal) {
	var searchObject = new Array();
	for (i in customer) {
		if ((customer[i].name.toLowerCase().indexOf($.trim(searchVal)
				.toLowerCase())) > -1) {
			searchObject.push(customer[i]);
		}
	}
	return searchObject;
}

function showFilterDropDown() {
	$('#filter-drop-down').slideDown();
}

function hideFilterDropDown() {
	$('#filter-drop-down').slideUp();
}

function appendAgentDashboardContainer() {
	var container = $('<div>').attr({
		"class" : "customer-list-contianer"
	});

	var leadsWrapper = $('<div>').attr({
		"class" : "cutomer-leads-wrapper"
	});

	var text=$('<div>').attr({
		"class" : " cust-profile-url cust-profile-url-dash float-right"
	}).html("Add customer : ");	
	
		var emailInput = $('<input>').attr({
			"class" : "cust-personal-info-header-url loan-detail-link",
			"id" : "profileUrlId",
			"readonly":"readonly",
			"title":"Double click to copy",
			"value":newfiObject.baseUrl+"us/"+newfiObject.user.username
		}).on('click',function(){
		window.open(newfiObject.baseUrl+"us/"+newfiObject.user.username)	;
	});
	
	
	if(newfiObject.user.userRole.roleDescription=="Realtor"){
		 text.append(emailInput);   
	}

	var leadsContainer = $('<div>').attr({
		"id" : "leads-container",
		"class" : "agent-wrapper-container"
	});

	leadsWrapper.append(leadsContainer);

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
	container.append(leadsWrapper);
	$('#agent-dashboard-container').append(container);
}

/**
 * 
 * @param elementId
 *            of container to which customer list is to appended
 * @param customers
 */
function checkCreditScore(creditScore){
	if(creditScore && creditScore.indexOf("800")>-1){
    	
		creditScore="NA";
    	
    }
	return creditScore;
}

/** method to append leads in leads page for internal users
 * @param elementId of container to which lead list to be appended
 * @param customers is the leads
 */
	
	function appendLeads(elementId, list, skipDataClearing){
	
		var loanList = list.leads;
		
		loanList.sort(function(a, b) {
		    a = new Date(a.lastActedOn);
		    b = new Date(b.lastActedOn);
		    return a>b ? -1 : a<b ? 1 : 0;
		});
		$('#agent-dashboard-container').addClass('leads-dashboard');
		
		if(!skipDataClearing){
			$('#' + elementId).html("");
			appendTableHeader(elementId);
		}
		
		
		for(var i = 0; i < loanList.length; i++) {
			var customer = loanList[i];
			if(customer.quote){
				//Only Quotes are here
				
				var row = $('<div>').attr({
					"class" : "leads-container-tr leads-container-row clearfix"
				});
			
				
				if (i % 2 == 0) {
					row.addClass('leads-container-row-odd');
				}
			
				if (i == loanList.length - 1) {
						row.addClass('leads-container-row-last');
				}
			
				
				var action = $('<div>').attr({
					"class": "float-left"
				});
				var pdfIcon = $('<div>').attr({
					"class" : "leads-row-9",
					"name" : customer.pdfUrl,
					"title": "View PDF"
				}).bind("click",function(){
					window.open($(this).attr("name"));
				
				});
				
				action.append(pdfIcon);
				
				var col1 = $('<div>').attr({
					"class" : "leads-container-tc1 leads-col-1 lead-custmr-name float-left clearfix",
						"id" : "leads-container-tc1-id"
					});		 
				 
		
				var cusName = $('<div>').attr({
					"class" : "cus-name float-left",
					"userName" : customer.prospectUsername,
					"InternalUserID" :customer.internalUserId,
					"id":customer.internalUserId+"_"+i
				}).html(customer.name);
			 
				//TO add a condition to check for user created
					
						// binding click  event when loan is not created.
				cusName.bind("click",function(){	
					getUserFromLeads($(this).attr("userName"),$(this).attr("InternalUserID"));
				});
							
			
				col1.append(action).append(cusName);				
				
				var col2="";
				var email;
				if(customer.emailId == null){
					email = "-";
				}else {
					email = customer.emailId;
				}
			
				//write a rest call					
				col2 = $('<div>').attr({
					"class" : "leads-col-2 lead-email float-left"
				}).html(email);
				
				
				var col3="";
					
				col3 = $('<div>').attr({
					"class" : "leads-col-3 float-left"
				}).html("Quote");
				if(customer.isCreated){
					$(col3).html("Lead");
				}
				//TO add check for loan
				var loanStatus = "";
				var obj = JSON.parse(customer.inputDetailsJson.toString());
				if(obj.loanType == PURCHASE){
					loanStatus = "Purchase";
				}else if(obj.loanType == REFINANACE_LOWER_MORTGAGE_PAYMENT || obj.loanType == REFINANACE_CASH_OUT){
					loanStatus = "Refinance";
				}else{
					loanStatus = "-";
				}
				var col4 = $('<div>').attr({
					"class" : "leads-col-4 lead-purp float-left"
				}).html(loanStatus);
				
				var	createdDateStr = $.datepicker.formatDate('mm-dd-yy', new Date(
						customer.createdDate));
				createdDateStr=formatYearInDate(createdDateStr);
				if(createdDateStr==""){
					createdDateStr="-";
				}
		
				var col7 = $('<div>').attr({
					"class" : "leads-col-7 lead-last-login float-left"
				}).html("-");
		
				var col8 = "";
				
					col8 = $('<div>').attr({
						"class" : "leads-row-8 float-left"
					});
					
				var createIcon = $('<div>').attr({
					"class" : "leads-row-11 float-right",
					"userName" : customer.prospectUsername,
					"InternalUserID" :customer.internalUserId,
					"id":customer.internalUserId+""+i,
					"title" : "Create Account"
				}).bind("click",function(){
					if($(this).hasClass('leads-row-11')){
						createUserFromLeads($(this).attr("userName"),$(this).attr("InternalUserID"),$(this).attr("id"));
					}
				});	
					
				//TO add a condition to check for user created
				if(customer.isCreated){
					$(createIcon).removeClass('leads-row-11');
					$(createIcon).attr("title", "");
					$(createIcon).css("pointer-events","none");
					$(createIcon).addClass('leads-user-created');
				}
					
					
				
				var col12 = "";
		
				 col12 = $('<div>').attr({
					"class" : "leaddelCustClas margin-right-10 leads-col-12 clearfix",
					"userName" : customer.prospectUsername,
					"InternalUserID" :customer.internalUserId,
					"id":customer.internalUserId+"_0"+i,
					"title" : "Delete"
				}).bind("click",function(){
					deleteUserFromLeads($(this).attr("userName"),$(this).attr("InternalUserID"),$(this).attr("id"));
				
				});
				 
				 
				var processorCol="";
				if(isSalesManager){
					
					var name = customer.internalUserName;
					if(name == null){
						name = "-";
					}
					processorCol = $('<div>').attr({
						"class" : "leads-row-processor float-left"
					}).html(name);
				}  else {
					$(col1).addClass('big-lead-custmr-name');
				 	$(col4).addClass('big-lead-purp');
				 	$(col7).addClass('big-lead-last-login');
				}
			
			 	$(col1).addClass('sm-leads-row-1');
			 	$(col2).addClass('sm-leads-row-2');
			 	$(col4).addClass('sm-leads-row-4');
			 	$(col7).addClass('sm-leads-row-7');
			 					 	
				row.append(col1).append(col2).append(col3).append(col4).append(processorCol)
					.append(col7).append(col8).append(createIcon).append(col12);
			
			
	}else {
			customer.credit_score = checkCreditScore(customer.credit_score);

			var row = $('<div>').attr({
				"class" : "leads-container-tr leads-container-row clearfix"
			});

			
			if (i % 2 == 0) {
				row.addClass('leads-container-row-odd');
			}

			if (i == loanList.length - 1) {
					row.addClass('leads-container-row-last');
			}

			var loanIconDiv = $('<div>').attr({
				"class" : "float-left",
			});
			if (customer.isQuoteAndLoan)
			{
				var loanIcon = $('<div>').attr({
					"class" : "loan-row float-left link-pointer",
					"name" : customer.pdfUrl,
					"title": "View Quote PDF"
				});
				loanIcon.bind("click",function(){
					window.open($(this).attr("name"));
				
				});				
				loanIconDiv.append(loanIcon);				
			}
			else{
				var loanIcon = $('<div>').attr({
					"class" : "loan-row float-left",
				});
				
				loanIconDiv.append(loanIcon);
			}
			var col1 = $('<div>').attr({
				"class" : "leads-container-tc1 leads-col-1 lead-custmr-name float-left clearfix",
					"id" : "leads-container-tc1-id"
				});				

		var onlineStatus = $('<div>').attr({
			"class" : "onl-status-icn float-left"
		});
		
		// code will execute if user is logged in

		var loanNotificationCntxt = getNotificationContext(customer.loanID, 0);
		loanNotificationCntxt.customerName = customer.name;
		addContext(customer.loanID + "-notification", loanNotificationCntxt)

		
		var cusName = "";
		
			 cusName = $('<div>').attr({
				"class" : "cus-name float-left",
				"loanid" : customer.loanID,
				"userid" : customer.userID
			}).bind('click', {
				"customer" : customer
			}, function(event) {
				event.stopImmediatePropagation();
	            removeToastMessage();
				resetSelectedUserDetailObject(event.data.customer);
				if (userIsRealtor()) {
					saveState('loan', selectedUserDetail.loanID, "team");
					entryPointForAgentView(selectedUserDetail.loanID, '0');
				} else {
					saveState('loan', selectedUserDetail.loanID, "detail");
					entryPointForAgentView(selectedUserDetail.loanID, '2');
				}

			}).html(customer.name);
			
			col1.append(loanIconDiv).append(cusName);
	
			
			var loan_status=customer.lqbLoanStatus;
			if(loan_status==""||loan_status==null||loan_status==undefined){
				loan_status="-";
			}

			var emailID = customer.emailId;
			if(emailID == ""){
				emailID = "-"
			}
			var col2="";

				//write a rest call					
				col2 = $('<div>').attr({
					"class" : "leads-col-2 lead-email float-left"
				}).html(emailID);
		
			var col3 = $('<div>').attr({
				"class" : "leads-col-3 float-left",
				"loanid" : customer.loanID,
				"userid" : customer.userID,
				"InternalUserID" :customer.internalUserId,
				"userName" : customer.prospectUsername,
			}).html(loan_status);
			//Bind only if it is a Quote and a Lead
			if(customer.isQuoteAndLoan)
			{
				col3.attr("title","Edit Quote");
				col3.addClass("link-pointer");
				col3.bind("click",function(){	
					getUserFromLeads($(this).attr("userName"),$(this).attr("InternalUserID"));
				});
			}
			var col4 = $('<div>').attr({
				"class" : "leads-col-4 lead-purp float-left",
				"userName": "",
				"InternalUserID": ""
			}).html(customer.purpose).bind('click',function(e){
				
			});
			
			/*if(customer.loanCreatedInLQB){
				$(col4).addClass("edit-quote-details-for-loan");
				
			}*/
			
			
			var userLastLogin = customer.userLastLoginTime;				
			
			if(userLastLogin == null){
				userLastLogin = "-";
			}else {
				userLastLogin = formateDateAndTime(new Date(customer.userLastLoginTime),true);
			}

			var col7 = $('<div>').attr({
				"class" : "leads-col-7 lead-last-login float-left"
			}).html(userLastLogin);

			var col8 = $('<div>').attr({
				"class" : "leads-container-tc7 alert-col float-left",
				"title" : "Schedule Alert"
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
			loanNotificationCntxt.loanLstCntElement = col8;
			loanNotificationCntxt.getNotificationForLoan(function(ob) {
				if (parseInt(ob.loanNotificationList.length) > 0) {
					var alerts = $('<div>').attr({
						"class" : "alerts-count"
					}).html(ob.loanNotificationList.length);
					ob.loanLstCntElement.html("");
					ob.loanLstCntElement.append(alerts);
				}
			});
			
			var processorCol="";
			if(isSalesManager){
			
				processorCol = $('<div>').attr({
					"class" : "leads-row-processor float-left"
				}).html(customer.processor);
			} else {
				$(col1).addClass('big-lead-custmr-name');
			 	$(col4).addClass('big-lead-purp');
			 	$(col7).addClass('big-lead-last-login');
			}
			
			$(col7).addClass('sm-lead-loan-tc7');
			$(col4).addClass('sm-leads-row-4');

			row.append(col1).append(col2).append(col3).append(col4).append(processorCol)
		   .append(col7).append(col8);
			
			$('#' + elementId).append(row);
			if((newfiObject.user&&newfiObject.user.internalUserDetail&&
					newfiObject.user.internalUserDetail.internalUserRoleMasterVO&&
					newfiObject.user.internalUserDetail.internalUserRoleMasterVO.roleName=="SM")||
					newfiObject.user.userRole.id==4){
					var userDelIcn = $('<div>').attr({
						"class" : "delCustClas lead-loan-del clearfix",
						"loanID" : customer.loanID,
						"customer_name":customer.name
					});
					row.append(userDelIcn);
				}else{
					$('.leads-container-tr').css("padding","15px 10px 10px");
				}
			//If it is Quote and a Loan - add a Edit Quote Icon
			
		}
			
		// TODO Its not required. Row already added.  - Manish
		$('#' + elementId).append(row);		
	}
		
	updateHandler.initiateRequest();

}

/**
 * @param userName is the name of the user in lead
 * @param internalUserID
 */
function createUserFromLeads(userName,internalUserID,id){
	ajaxRequest("rest/shopper/record/lead/" + userName +"/"+internalUserID, "POST",
			"json",{}, function(response){
				if(response.error == null){
					$('#'+id).removeClass('leads-row-11');
					$('#'+id).addClass('leads-user-created');
					location.reload();
					showToastMessage("User created successfully.");
				}else {
					showErrorToastMessage(response.error.message);
				}	
			});
}

/**
 * @param userName is the name of the user in lead 
 * @param internalUserID
 */
function getUserFromLeads(userName,internalUserID){
	ajaxRequest("rest/shopper/record/getQuoteUser/"+ userName+"/"+internalUserID, "GET",
			"json",{}, function(response){
				if(response.error == null){
					// TODO @Manish do the next task.
					//showToastMessage(response.resultObject);
				
					editQuoteUserDetails = response;
					editQuoteUser();
				}else {
					showErrorToastMessage(leadEditErrorMessage);
				}	
			});
}

function paintLeadsQuotePage(leadId){
	ajaxRequest("rest/loan/retrieveQuoteDetailsOfUser/"+ leadId, "GET",
			"json",{}, function(response){
				if(response.error == null){
					// TODO @Manish do the next task.
					//showToastMessage(response.resultObject);
				
					editQuoteUserDetails = response;
					editQuoteUser();
				}
			});
}

/**
 * @param userName is the name of the user in lead 
 * @param internalUserID
 */
function deleteUserFromLeads(userName,internalUserID,id){
	ajaxRequest("rest/shopper/record/deleteLeadFromQuote/" + userName +"/"+internalUserID, "POST",
			"json",{}, function(response){
				if(response.error == null){
					$('#'+id).parent().remove()
					showToastMessage(response.resultObject)
				}else {
					showErrorToastmessage(response.error.message);
				}	
			});
}

/**
 * @param elementId of container to which customer list to be appended
 * @param customers
 * @param skipDataClearing to clear the rowcontainer
 */
function appendCustomers(elementId, customers,skipDataClearing) {
	
		var list = customers;
		if(newfiObject.user.userRole.id==2){
			isRealtor=true;
		}else if(newfiObject.user.userRole.roleCd=="INTERNAL"){
			//jira-811,810
			if(newfiObject.user.internalUserDetail.internalUserRoleMasterVO.id==2){
				isSalesManager=true;
			}else if(newfiObject.user.internalUserDetail.internalUserRoleMasterVO.id==1){
				isLoanManager=true;
			}
		
		}else {
			isSalesManager=true;
		}
		if(!skipDataClearing){
			$('#' + elementId).html("");
			
			appendCustomerTableHeader(elementId);
		}
		$('#agent-dashboard-container').addClass('sm-dashboard');
	

		for (var i = 0; i < list.length; i++) {
		var customer = list[i];
		customer.credit_score = checkCreditScore(customer.credit_score);

		var row = $('<div>').attr({
			"class" : "leads-container-tr leads-container-row clearfix"
		});

		
		if (i % 2 == 0) {
			row.addClass('leads-container-row-odd');
		}

		if (i == list.length - 1) {
				row.addClass('leads-container-row-last');
		}

		
		var col1 = $('<div>').attr({
			"class" : "leads-container-tc1 float-left clearfix",
				"id" : "leads-container-tc1-id"
			});
			
			if(!isRealtor){
				$(col1).addClass('sm-leads-container-tr1');
			}else {
				$(col1).addClass('leads-container-tc1-realtor');
				
			}

			var onlineStatus = $('<div>').attr({
				"class" : "onl-status-icn float-left"
			});
			
			// code will execute if user is logged in

			var loanNotificationCntxt = getNotificationContext(customer.loanID, 0);
			loanNotificationCntxt.customerName = customer.name;
			addContext(customer.loanID + "-notification", loanNotificationCntxt)

			
			var cusName = "";
			var profImage = $('<div>').attr({
					
					
			});

				 cusName = $('<div>').attr({
					"class" : "cus-name float-left",
					"loanid" : customer.loanID,
					"userid" : customer.userID
				}).bind('click', {
					"customer" : customer
				}, function(event) {
					event.stopImmediatePropagation();
		            removeToastMessage();
					resetSelectedUserDetailObject(event.data.customer);
					if (userIsRealtor()) {
						saveState('loan', selectedUserDetail.loanID, "team");
						entryPointForAgentView(selectedUserDetail.loanID, '0');
					} else {
						saveState('loan', selectedUserDetail.loanID, "detail");
						entryPointForAgentView(selectedUserDetail.loanID, '2');
					}

				}).html(customer.name);
				
					// TODO customer prof default pic to be set correctly
				if (customer.prof_image == undefined || customer.prof_image == ""
					|| customer.prof_image == null) {
					profImage.addClass("lp-initial-pic float-left");				
					profImage.text(getInitialsFromFullName(customer.name));		
				}
				else
				{
					profImage.addClass("cus-img-icn float-left");
					profImage.css("background-image", "url('" + customer.prof_image + "')");
					
				}	

				col1.append(profImage).append(cusName);
		//jira-661
		if(isRealtor){
          var textCol2="";
          
			if(customer.customerDetail.addressCity==""||customer.customerDetail.addressCity==null){
				textCol2="-";
			}else{
				textCol2=customer.customerDetail.addressCity;
			}
			var col2 = $('<div>').attr({
				"class" : "leads-container-tc2 leads-container-tc2-realtor float-left"
			}).html(textCol2);
			var lockedClosingCost="-";
			if(customer.lockedRateData){
				try{
					var lockedData=JSON.parse(customer.lockedRateData);
					lockedClosingCost=lockedData.closingCost;
				}catch(e){
					lockedClosingCost="-";
				}
			}
			var col3 = $('<div>').attr({
				"class" : "leads-container-tc3 leads-container-tc3-realtor float-left"
			}).html(lockedClosingCost);//to be asked

			var loan_status=customer.lqbLoanStatus;
			if(loan_status==""||loan_status==null||loan_status==undefined){
				
				loan_status="-";
			}
			
			var col4 = $('<div>').attr({
				"class" : "leads-container-tc4 leads-container-tc4-realtor float-left"
			}).html(loan_status);
			
			var textCol4="";
			if(customer.processor==""||customer.processor==null){
				textCol4="-";
			}else{
				textCol4=customer.processor;
			}
			
			var col5 = $('<div>').attr({
				"class" : "leads-container-tc5  leads-container-tc5-realtor float-left"
			}).html(textCol4);
			
			var userLastLogin = customer.userLastLoginTime;
			
			
			
			if(userLastLogin == null){
				userLastLogin = "-";
			}else {
				userLastLogin = formateDateAndTime(new Date(customer.userLastLoginTime),true);
			}
			
			var col6 = $('<div>').attr({
				"class" : "leads-container-tc4  leads-container-tc5-realtor float-left"
			}).html(userLastLogin);
			
			var col7 = $('<div>').attr({
				"class" : "leads-container-tc5 alert-col leads-container-tc6-realtor float-left"
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
					ob.loanLstCntElement.html("");
					ob.loanLstCntElement.append(alerts);
				}
			});
			
			row.append(col1).append(col2).append(col3).append(col4).append(col5).append(col6).append(col7);
			
			$('#' + elementId).append(row);
			
		}else{	
				var phone_num = "NA";
				if (customer.phone_no != null && customer.phone_no.trim() != "") {
					phone_num = formatPhoneNumberToUsFormat(customer.phone_no);
				}
				var loan_status=customer.lqbLoanStatus;
				if(loan_status==""||loan_status==null||loan_status==undefined){
					loan_status="-";
				}

				var col2="";
				if(isSalesManager){
					//write a rest call					
					col2 = $('<div>').attr({
						"class" : "leads-container-tc2 float-left"
					}).html(loan_status);
				}else {
					col2 = $('<div>').attr({
						"class" : "leads-container-tc2 float-left"
					}).html(loan_status);
				}
	
				var col3 = $('<div>').attr({
					"class" : "leads-container-tc3 sm-leads-container-tr3 float-left"
				}).html(customer.purpose);
	
				var col4="";
				if(isLoanManager){
				
					col4 = $('<div>').attr({
						"class" : "leads-container-tc4 float-left"
					}).html(phone_num);
				}else{
					col4 = $('<div>').attr({
						"class" : "leads-container-tc4 float-left"
					}).html(customer.processor);
				}

				var	createdDateStr = $.datepicker.formatDate('mm-dd-yy', new Date(
						customer.loanInitiatedOn));
				createdDateStr=formatYearInDate(createdDateStr);
				if(createdDateStr==""){
					createdDateStr="-";
				}
				/*var col5 = $('<div>').attr({
					"class" : "leads-container-tc5 float-left"
				}).html(createdDateStr);

				var date=customer.time.slice(0,10);
			    var time=customer.time.slice(11);
			    var modifiedDateStr=formatYearInDate(date);
			    
			    if(modifiedDateStr==""){
			     modifiedDateStr="-";
			    }else {
			     //  added Extra space for Data format,  Don't delete space
			     modifiedDateStr = modifiedDateStr+"<br/> "+time;
			    }
			    var col6 = $('<div>').attr({
			     "class" : "leads-container-tc6 float-left last-action-cell"
			    }).html(modifiedDateStr);
*/				
				var userLastLogin = customer.userLastLoginTime;				
				
				if(userLastLogin == null){
					userLastLogin = "-";
				}else {
					userLastLogin = formateDateAndTime(new Date(customer.userLastLoginTime),true);
				}
	
				var col7 = $('<div>').attr({
					"class" : "leads-container-tc6 float-left"
				}).html(userLastLogin);

				var col8 = $('<div>').attr({
					"class" : "leads-container-tc7 alert-col float-left",
					"title" : "Schedule Alert"
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
				loanNotificationCntxt.loanLstCntElement = col8;
				loanNotificationCntxt.getNotificationForLoan(function(ob) {
					if (parseInt(ob.loanNotificationList.length) > 0) {
						var alerts = $('<div>').attr({
							"class" : "alerts-count"
						}).html(ob.loanNotificationList.length);
						ob.loanLstCntElement.html("");
						ob.loanLstCntElement.append(alerts);
					}
				});
				
				row.append(col1).append(col2).append(col3).append(col4).append(col7).append(col8);
				
				$('#' + elementId).append(row);
				if((newfiObject.user&&newfiObject.user.internalUserDetail&&
						newfiObject.user.internalUserDetail.internalUserRoleMasterVO&&
						newfiObject.user.internalUserDetail.internalUserRoleMasterVO.roleName=="SM")||
						newfiObject.user.userRole.id==4){
						var userDelIcn = $('<div>').attr({
							"class" : "delCustClas clearfix",
							"loanID" : customer.loanID,
							"customer_name":customer.name,
							"title" : "Delete"
						});
						row.append(userDelIcn);
					}else{
						$('.leads-container-tr').css("padding","15px 15px 10px");
					}
				}
			}
		
			updateHandler.initiateRequest();
	
}

function checkCreditScoreAval(creditScore){
	var o=creditScore.split("|");
	var sA=false;
	if(o.length>=3){
		for(var i=0;i<o.length;i++){
			if(o[i].indexOf("span")<0&&o[i]!=""){ 
				sA=true;
			}
		}
	}
	return(sA);
}

// Function to append customer table header in agent dashboard
function appendCustomerTableHeader(elementId) {
	
	var tableHeader = $('<div>').attr({
		"class" : "leads-container-th leads-container-row leads-container-row-th clearfix"
	});
	if(isLoanManager){
		tableHeader.addClass('leads-container-row-adj');
	}
	//jira-661
	if(isRealtor){
		var thCol1 = $('<div>').attr({
			"class" : "leads-container-tc1 leads-container-tc1-realtor float-left"
		}).html("Customer");
		
		//tableHeader.addClass('leads-container-row-realtor');
		var thCol2 = $('<div>').attr({
			"class" : "leads-container-tc2 leads-container-tc2-realtor float-left"
		}).html("Address");

		var thCol3 = $('<div>').attr({
			"class" : "leads-container-tc3 leads-container-tc3-realtor float-left"
		}).html("COE");
		
		var thCol4 = $('<div>').attr({
			"class" : "leads-container-tc4 leads-container-tc4-realtor float-left"
		}).html("Loan Status");

		var thCol5 = $('<div>').attr({
			"class" : "leads-container-tc5 leads-container-tc5-realtor  float-left"
		}).html("Loan Advisor");

		var thCol6 = $('<div>').attr({
			"class" : "leads-container-tc4 leads-container-tc5-realtor  float-left"
		}).html("Last Login");
		
		var thCol7 = $('<div>').attr({
			"class" : "leads-container-tc5 leads-container-tc6-realtor-header float-left"
		}).html("Alerts");

		tableHeader.append(thCol1).append(thCol2).append(thCol3).append(thCol4).append(thCol5).append(thCol6).append(thCol7);
	}else if(isSalesManager || isLoanManager){
		//jira-811,810
	var thCol1 = $('<div>').attr({
		"class" : "leads-container-tc1 sm-leads-container-tc1 float-left sort-list-asc",
		"id" : "leads-container-tc1-id"
	}).html("Customer");

	var thCol2;
    if(isLoanManager){
    	 thCol2 = $('<div>').attr({
			"class" : "leads-container-tc2 sm-leads-container-tc2 loan-status-sort-list-asc float-left"
		}).html("Loan Status");
    }else{
    	 thCol2 = $('<div>').attr({
    		"class" : "leads-container-tc2 sm-leads-container-tc2  float-left loan-status-sort-list-asc"
    	}).html("Loan Status");
    }
    
	var thCol3 = $('<div>').attr({
		"class" : "leads-container-tc3 sm-leads-container-tc3 float-left",
		
	}).html("Purpose");

	var thCol4="";
	if(isLoanManager){
		 thCol4 = $('<div>').attr({
			"class" : "leads-container-tc4 float-left"
		}).html("Phone");
	}else{
		thCol4 = $('<div>').attr({
			"class" : "leads-container-tc4 float-left loan-advisor-sort-list-asc"
		}).html("Loan Advisor");
	}
	
	/*var thCol5 = $('<div>').attr({
		"class" : "leads-container-tc5 sm-leads-container-tc5  float-left opened-sort-list-asc"
	}).html("Opened");*/
	 
	/*var thCol6 = $('<div>').attr({
		"class" : "leads-container-tc6 sm-leads-container-tc6  float-left last-action-sort-list-asc"
	}).html("Last Action");
	*/
	var thCol7 = $('<div>').attr({
		"class" : "leads-container-tc6 float-left"
	}).html("Last Login");
	
	var thCol8 = $('<div>').attr({
		"class" : "leads-container-tc7 float-left"
	}).html("Alerts");

	tableHeader.append(thCol1).append(thCol2).append(thCol3).append(thCol4)
			.append(thCol4).append(thCol7).append(thCol8);
	}

	$('#' + elementId).append(tableHeader);
}
/*function appendTableHeader(elementId){
		var tableHeader = $('<div>').attr({
			"class" : "leads-container-th leads-container-row leads-container-row-th clearfix"
		});
		
		var thCol1 = $('<div>').attr({
			"class" : "leads-container-tc1 leads-col-1 float-left"
		}).html("Customer");
		
		var thCol2;
	    thCol2 = $('<div>').attr({
	    	"class" : "leads-container-tc2 leads-col-2 float-left"
	    }).html("Email");
	    
		var thCol3 = $('<div>').attr({
			"class" : "leads-container-tc3 leads-col-3 float-left"
		}).html("Phone");
		var thCol4="";
			 thCol4 = $('<div>').attr({
				"class" : "leads-container-tc4 leads-col-4 float-left"
			}).html("Created");
		
		var thCol5 = $('<div>').attr({
			"class" : "leads-container-tc5 leads-col-5 float-left"
		}).html("Summary");
		
		var thCol6_1 = $('<div>').attr({
			"class" : "leads-container-tc6 leads-col-6 float-left"
		}).html("Edit");
		
		
		var thCol6 = $('<div>').attr({
			"class" : "leads-container-tc6 leads-col-6 float-left"
		}).html("Account");
		
		var thCol7 = $('<div>').attr({
			"class" : "leads-container-tc7 leads-col-7 float-left"
		}).html("Delete");
		
		
		tableHeader.append(thCol1).append(thCol2).append(thCol3).append(thCol4)
				.append(thCol4).append(thCol5).append(thCol6_1).append(thCol6).append(thCol7);
	    $('#' + elementId).append(tableHeader);
}*/

function appendTableHeader(elementId){
	var tableHeader = $('<div>').attr({
		"class" : "leads-container-th leads-container-row leads-container-row-th clearfix"
	});
	
	var thCol1 = $('<div>').attr({
		"class" : "leads-col-1 lead-custmr-name float-left sort-list-asc"
	}).html("Customer");
	
	var thCol2;
    thCol2 = $('<div>').attr({
    	"class" : "leads-col-2  lead-email float-left sort-up-arrow-45"
    }).html("Email");
    
	var thCol3 = $('<div>').attr({
		"class" : "leads-col-3 float-left loan-status-sort-list-asc"
	}).html("Loan Status");

	var thCol4="";
		 thCol4 = $('<div>').attr({
			"class" : "leads-col-4 lead-purp float-left"
		}).html("Purpose");
	var processorCol = "";
	if(isSalesManager){
		processorCol = $('<div>').attr({
			"class" : "leads-col-processor float-left loan-advisor-sort-list-asc"
		}).html("Loan Advisor");
	}
	/*var thCol5 = $('<div>').attr({
		"class" : "leads-col-5 float-left"
	}).html("Opened");*/
	
	/*var thCol6 = $('<div>').attr({
		"class" : "leads-col-6 float-left"
	}).html("Last Action");*/
	
	
	var thCol7 = $('<div>').attr({
		"class" : "leads-col-7 lead-last-login float-left"
	}).html("Last Login");
	
	var thCol8 = $('<div>').attr({
		"class" : "leads-col-8 float-left"
	}).html("Alerts");
	

	if(isSalesManager){
		$(thCol1).addClass('sm-leads-col-tc1');
		$(thCol2).addClass('sm-leads-col-tc2');
		$(thCol4).addClass('sm-leads-col-tc4');
		//$(thCol5).addClass('sm-leads-col-tc5');
		//$(thCol6).addClass('sm-leads-col-tc6');
		$(thCol7).addClass('sm-leads-col-tc7');
	} else {
		$(thCol1).addClass('big-lead-custmr-name');
	 	$(thCol4).addClass('big-lead-purp');
	 	$(thCol7).addClass('big-lead-last-login');
	}
	tableHeader.append(thCol1).append(thCol2).append(thCol3)
			.append(thCol4).append(processorCol).append(thCol7).append(thCol8);


    $('#' + elementId).append(tableHeader);
}
/**
 * function to append details related to customer in agent dashboard
 * 
 * @param element
 *            container to which the it is to be appended
 */
function appendCustomerDetailContianer(element, customer) {
	resetSelectedUserDetailObject(customer);
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
	repaintNotes(true);
	appendTakeNoteContainer(customer);
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
				"class" : "alert-txt",
				"title" : alertData
			}).html(alertData);
			addClickHandlerToNotification(alertTxt,alerts[i]);
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
				e.stopPropagation();
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

function getSchedulerContainer(contxt, tempData) {
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
	var dateToday = new Date();
	var datePickerBox = $('<input>').attr({
		"class" : "date-picker-input",
		"placeholder" : "MM/DD/YYYY",
		"id" : "sch-msg-date-picker"
	}).datepicker({
		orientation : "top auto",
		autoclose : true,
		startDate : dateToday
	}).on('show', function(e) {
		var $popup = $('.datepicker');
		$popup.click(function() {
			return false;
		});
	}).mask('00/00/0000');
	
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
	}).html("Submit").bind(
			"click",
			{
				contxt : contxt,
				tempData : tempData
			},
			function(e) {
				var tempData = e.data.tempData;
				var contxt = e.data.contxt;
				var dat = $('#sch-msg-time-picker ').data('DateTimePicker')
						.getDate()._d
				var snoozeTime = $('#sch-msg-date-picker').data('datepicker')
						.getDate();
				snoozeTime.setHours(dat.getHours());
				snoozeTime.setMinutes(dat.getMinutes())
				var message = $("#sch-msg-message").val();
				//jira-699
				 var regex = /^[a-zA-Z0-9-,]+([a-zA-Z-0-9-, ])*$/;
				if (message == "") {
					showErrorToastMessage(invalidMessage);
				} else if(!message.match(regex)){
					//jira-699
					showErrorToastMessage(invalidMessage);
				}else if (snoozeTime == "Invalid Date") {
					showErrorToastMessage(invalidDate);
				} else {
					var data = {};
					data.content = message;
					data.createdDate = new Date().getTime();
					data.remindOn = snoozeTime.getTime();
					data.createdByID = newfiObject.user.id;
					data.createdForID = newfiObject.user.id;
					data.loanID = contxt.loanId;
					data.customerName = contxt.customerName;
					data.notificationType = "NOTIFICATION";
					data.dismissable = true;
					if (tempData) {
						var wrapperData = {};
						for (key in tempData) {
							wrapperData[key] = tempData[key];
						}
						wrapperData.notificationVo = data;
						data = wrapperData;
					}
					contxt.scheduleAEvent(data, function() {
						contxt.updateWrapper();
						contxt.updateLoanListNotificationCount();
						$("#sch-msg-message").val("");
						if (tempData) {
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
	}).html("Clear")
	.click(function(){
		$('#sch-msg-message').val('');
	});
	col3.append(col3Btn);
	buttonRow.append(col1).append(col2).append(col3);
	container.append(header).append(dtPickerRow).append(messageBox).append(
			buttonRow);
	wrapper.append(container);
	return wrapper;
}

function appendRecentNotesContainer(loanId, notes) {
	var existingWrapper = $("#" + loanId + "recentNotesContainer");
	var wrapper;
	if (existingWrapper.size() > 0) {
		wrapper = existingWrapper;
		existingWrapper.empty();
	} else {
		wrapper = $('<div>').attr({
			"class" : "cust-detail-lw float-left",
			"id" : loanId + "recentNotesContainer",
		});
	}

	var container = $('<div>').attr({
		"class" : "cust-detail-container"
	});
	var header = $('<div>').attr({
		"class" : "cust-detail-header"
	}).html("recent notes");

	 
	container.append(header);

	var recentNoteWrapper = $('<div>').attr({
		"class" : "recent-notes-wrapper clearfix"
	});

	if (notes != undefined) {
		for (var i = 0; i < notes.length; i++) {
			var noteData = notes[i];
			var noteContainer = $('<div>').attr({
				"class":"main-container"
			});
			var newCls=""
			if(noteData.imgUrl!=""){
				noteContainer = $('<div>').attr({
					"class" : "note-conatiner",
					"style" : "background-image:url(" + noteData.imgUrl + ") "
					});
			}else{
				var initialTxt = getInitialsByName(noteData.name);
				var imgContainer = $('<div>').attr({
					"class" : "lp-initial-pic float-left clearfix"
					}).html(initialTxt);
				noteContainer.append(imgContainer);
				newCls="new-class";
			}
			var cusName = $('<div>').attr({
				"class" : "note-cus-name "+newCls
			}).html(noteData.name);

			var time = $('<div>').attr({
				"class" : "note-time "+newCls
			}).html(noteData.time);

			var message = $('<div>').attr({
				"class" : "note-message "+newCls
			}).html(noteData.message);

			noteContainer.append(cusName).append(time).append(message);

			recentNoteWrapper.append(noteContainer);
		}
	}
	container.append(recentNoteWrapper);
	wrapper.append(container);
	if (existingWrapper.size() <= 0) {

		$('#cust-detail-wrapper').append(wrapper);
	}
	recentNoteWrapper.perfectScrollbar({
		suppressScrollX : true
	})
	recentNoteWrapper.perfectScrollbar('update');

}

function appendTakeNoteContainer(customer) {

	wrapper = $('<div>').attr({
		"class" : "cust-detail-rw float-left",
		"id" : customer.loanID + "takeNotesContainer"
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
		"id" : customer.loanID + "_msgBody",
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
	col1Btn.bind("click", {
		customer : customer

	}, function(e) {
		var text = $("#" + customer.loanID + "_msgBody").val();
		$("#" + customer.loanID + "_msgBody").val('');
		resetSelectedUserDetailObject(e.data.customer);
		if (text == null || text.trim() == "") {
			showToastMessage(enterMessage);
			return;
		}

		doSavemessageAjaxCall(text, repaintNotes);

	});

	var col2 = $('<div>').attr({
		"class" : "msg-btn-col2 float-left"
	}).html("or");

	var col3 = $('<div>').attr({
		"class" : "msg-btn-col3 float-left clearfix"
	});

	var col3Btn = $('<div>').attr({
		"class" : "msg-btn-clear float-left"
	}).html("Clear")
	.click(function() {
		$('.note-msg-textbox').val('');
	});
	col3.append(col3Btn);
	col3.click(function(e) {
		$("#" + customer.loanID + "_msgBody").val('');
	});

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

function repaintNotes(hideToast) {
	if (hideToast == undefined || hideToast == false) {
		showToastMessage(messageSaved);
	}

	synchronousAjaxRequest("rest/commlog/" + newfiObject.user.id + "/"
			+ selectedUserDetail.loanID + "/0", "GET", "json", "",
			paintRecentNotes, true);

}
function getInitialsByName(name){
	var nameParts=name.split(" ");
	var fName="";
	var lName="";
	if(nameParts){
		fName=nameParts[0];
		if(nameParts.length>1){
			lName=nameParts[nameParts.length-1];
		}
	}
	var initialText = getInitials(fName,lName);
	return initialText;
}
function paintRecentNotes(response) {
	var messages = response.resultObject.messageVOs;
	var notes = new Array();
	var loanId;
	for (var i = 0; i < messages.length; i++) {
		var obj = messages[i];
		notes[i] = new Object();
		notes[i].name = obj[0].createdUser.userName;

		if (obj[0].createdUser.imgUrl == undefined
				|| obj[0].createdUser.imgUrl == null) {
			notes[i].imgUrl = "";
		} else {
			notes[i].imgUrl = obj[0].createdUser.imgUrl;
		}

		notes[i].message = obj[0].message;
		notes[i].time = obj[0].createdDate;
		loanId = obj[0].loanId;
	}
	if(loanId==undefined){
		loanId = selectedUserDetail.loanID;
	}
	appendRecentNotesContainer(loanId, notes);
}

function paintMyLoansView() {
	scrollToTop();
	$('.lp-right-arrow').remove();
	$('#right-panel').html('');
	// $('.lp-item').removeClass('lp-item-active');
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
    //console.log(userObject);
	// userObject this is a "LoanCustomerVO" object

	selectedUserDetail = new Object();
	selectedUserDetail.userID = userObject.userID;
	selectedUserDetail.loanID = userObject.loanID;
	selectedUserDetail.role = userObject.role;
	selectedUserDetail.phoneNo = userObject.phone_no;
	selectedUserDetail.lqbFileId = userObject.lqbFileId;
	
	selectedUserDetail.name = userObject.name;
	selectedUserDetail.createdDate = userObject.loanInitiatedOn;
	selectedUserDetail.modifiedDate = userObject.lastActedOn;

	selectedUserDetail.firstName = userObject.firstName;
	selectedUserDetail.lastName = userObject.lastName;
	selectedUserDetail.emailId = userObject.emailId;

	selectedUserDetail.customerId = userObject.customerDetail.id;
	selectedUserDetail.carrierName = userObject.carrierInfo;
	selectedUserDetail.city = userObject.customerDetail.addressCity;
	selectedUserDetail.state = userObject.customerDetail.addressState;
	selectedUserDetail.zipCode = userObject.customerDetail.addressZipCode;
	selectedUserDetail.dob = $.datepicker.formatDate('mm/dd/yy', new Date(
			userObject.customerDetail.dateOfBirth));
	selectedUserDetail.setSenderDomain = userObject.setSenderDomain;
	selectedUserDetail.setMobileAlertPreference=userObject.mobileAlertsPreference;
	// TODO-add a default image url
	if (userObject.prof_image)
		selectedUserDetail.photoUrl = userObject.prof_image;
	else
		selectedUserDetail.photoUrl = "";

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

function getAppDetailsForUser(userId, callback , overleyText) {
	ajaxRequest("rest/loan/appform/" + userId, "GET", "json", undefined,
			function(response) {
				if (response.error) {
					showToastMessage(response.error.message)
				} else {
					var appFormDetails = response.resultObject;
					appUserDetails=JSON.parse(appFormDetails);
					newfi.appUserDetails = appFormDetails;
					
					if (callback) {
						callback(JSON.parse(appFormDetails));
					}
				}
				
			} , undefined ,  undefined ,  undefined , overleyText);
}
// function called when secondary left panel is changed in agent view loan
// progress pages
function changeAgentSecondaryLeftPanel(elementId) {
	scrollToTop();
	$('.lp-t2-item').removeClass('t2-active');
	$('.lp-t2-item .arrow-right').remove();
	$('#' + elementId).addClass('t2-active');
	var rightArrow = $('<div>').attr({
		"class" : "arrow-right"
	});
	$('#' + elementId).append(rightArrow);
	$('#center-panel-cont').html('');
	doPagination = false;
	// Check the id and paint the corresponding right panel
	if (elementId == "lp-step0") {
		doPagination = true;
		ga('set', 'page', '/messages');
		ga('send', 'pageview');
		showAgentMessageDashboard();
	} else if (elementId == "lp-step1") {
		ga('set', 'page', '/application-page');
		ga('send', 'pageview');
		var userId = selectedUserDetail.userID;
		getAppDetailsForUser(userId, function() {
			paintCustomerApplicationPage();
		});
	} else if (elementId == "lp-step2") {
		// TODO-pass the right id
		if (userIsRealtor()) {
			return false;
		}
		ga('set', 'page', '/loan-detail');
		ga('send', 'pageview');
		getLoanDetails(selectedUserDetail.loanID);
	} else if (elementId == "lp-step3") {
		var userId=selectedUserDetail.userID;
        getAppDetailsForUser(userId,function(appUserDetailsTemp){
        	  $('#overlay-loader').show();
            var LQBFileId=appUserDetailsTemp.loan.lqbFileId;
            ga('set', 'page', '/rates-page');
			ga('send', 'pageview');
            if(LQBFileId){            	
                paintFixYourRatePage();
            }else{
                //code to Paint teaser rate page            	
                paintTeaserRatePageBasedOnLoanType(appUserDetailsTemp);
            }
        });
	} else if (elementId == "lp-step4") {
		ga('set', 'page', '/needs-page');
		ga('send', 'pageview');
		paintAgentNeedsListPage();
	} else if (elementId == "lp-step5") {
		if (userIsRealtor()) {
			ga('set', 'page', '/realtor-loan-progress');
			ga('send', 'pageview');
			paintCustomerLoanProgressPage();
		} else {
			ga('set', 'page', '/loan-progress');
			ga('send', 'pageview');
			paintAgentLoanProgressPage();
		}

	}

}
function userIsRealtor() {
	if (newfiObject.user.userRole.roleCd == "REALTOR") {
		return true;
	}
	return false;
}

function userIsInternal() {
	if (newfiObject.user.userRole.roleCd == "INTERNAL") {
		return true;
	}
	return false;
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
		
		"id" : "cusProfPicID"

	});
	if (custHeaderDetails.photoUrl == undefined || custHeaderDetails.photoUrl=="") {
		cusProfPic.addClass("cus-img-icn-default float-left");		
		cusProfPic.text(getInitialsFromFullName(custHeaderDetails.name));
	}
	else
	{
		cusProfPic.addClass("cus-img-icn float-left");
		cusProfPic.css("background-image", "url('" + custHeaderDetails.photoUrl + "')");
		
	}
	

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
		"class" : "cus-prof-role-txt",
			"id":"cusProfPhoneNumber"
	});

	if (custHeaderDetails.phoneNo)

		cusContact.html(formatPhoneNumberToUsFormat(custHeaderDetails.phoneNo));

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
	//NEXNF-744 changed from Initiated On
	var text="";
	//text="Lead Submitted";
	//jira-813
	text="Opened";
	var rowInitiatedOnTitle = $('<div>').attr({
		"class" : "cus-detail-rc-title float-left"
	}).html(text);
	var createdDateStr;
	var modifiedDateStr;
	//NEXNF-744 Changed date format from dd/mm/yy to mm/dd/yy

	createdDateStr = $.datepicker.formatDate('mm-dd-yy', new Date(
			custHeaderDetails.createdDate));
	modifiedDateStr = $.datepicker.formatDate('mm-dd-yy', new Date(
			custHeaderDetails.modifiedDate));
	createdDateStr=formatYearInDate(createdDateStr);
	modifiedDateStr=formatYearInDate(modifiedDateStr);
	var rowInitiatedOnValue = $('<div>').attr({
		"class" : "cus-detail-rc-value float-left"
	}).html(createdDateStr);
	rowInitiatedOn.append(rowInitiatedOnTitle).append(rowInitiatedOnValue);
	cusProfRightContainer.append(rowInitiatedOn);

	var rowLastActiveOn = $('<div>').attr({
		"class" : "cus-detail-rc-row clearfix"
	});
	
	//NEXNF-744 Changed from last acted on
	var text2="";
	text2="Last Action";
	var rowLastActiveOnTitle = $('<div>').attr({
		"class" : "cus-detail-rc-title float-left"
	}).html(text2);

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

	//NEXNF-744 Changed from loan details to summary
	var text="";
	text="Summary";
	var header = $('<div>').attr({
		"class" : "av-loan-details-header"
	}).html(text);

	var container = $('<div>').attr({
		"id" : "av-loan-details-container",
		"class" : "av-loan-details-container"
	});

	wrapper.append(header).append(container);
	$('#center-panel-cont').append(wrapper);
	appendLoanDetailsRow("Customer Profile", "Edit", true);
	appendLoanDetailsRow("Loan Status", loanDetails.lqbLoanStatus);	
	var ltvData = "-";
	if(loanDetails.ltv){
		ltvData = loanDetails.ltv+"%";
	}
	appendLoanDetailsRow("LTV",ltvData);
	appendLoanDetailsRow("Loan Purpose", loanDetails.userLoanStatus.loanPurpose);
	
	var text="Loan Number";
	if (loanDetails.lqbInformationAvailable) {
		appendLoanDetailsRow(text, loanDetails.lqbFileId,  true,
				loanDetails.lqbUrl);
	} else {
		if(loanDetails.lqbUrl=="-"){
			appendLoanDetailsRow(text,"-");
		}else{
			appendLoanDetailsRow(text,
					"Click here to set your LQB credentials", true,
					"#lp-loan-manager-profile");	
		}
		
	}
	appendLoanDetailsRow("File Email", loanDetails.loanEmailId);
	appendLoanDetailsRow("Note Rate",
			loanDetails.userLoanStatus.lockRate);
	appendLoanDetailsRow("Lock Expiration", loanDetails.userLoanStatus);
	if (loanDetails.creditReportUrl == undefined
			|| loanDetails.creditReportUrl == "") {
		loanDetails.userLoanStatus.creditInformation=checkCreditScore(loanDetails.userLoanStatus.creditInformation);
		appendLoanDetailsRow("Credit",
				loanDetails.userLoanStatus.creditInformation);
	} else {
		appendLoanDetailsRow("Credit Report",
				loanDetails.userLoanStatus.creditInformation, true,
				loanDetails.creditReportUrl);
	}
	appendCustomerEditProfilePopUp();
}

function updatePurchaseDocumentExpiryDate() {
	var date = new Date($("#purchaseDocumentExpiryDate").val()).getTime();
	var currentTime = new Date().getTime();
	if (currentTime > date) {
		showToastMessage(cannotSelectOldMessage);
		return;
	}
	var data = {};
	data.loanId = selectedUserDetail.loanID;
	data.date = date;
	var url = "rest/loan/purchaseDocument/expiryDate";

	$.ajax({
		url : url,
		type : "POST",
		data : data,
		cache:false,
		contentType : "application/x-www-form-urlencoded",
		success : function(response) {
			showExpiryDateResponse(response);
		},
		complete : function(response) {
		},
		error : function() {

		}
	});

}

function showExpiryDateResponse(response) {
//	console.info(response);
	if (response.error == null) {
		showToastMessage(expiryDateExpected);
	} else {
		showToastMessage(problemSavingExpiryDate);
	}
}

// Function to append loan details row
function appendLoanDetailsRow(label, value, isLink, linkUrl) {
	var row = $('<div>').attr({
		"id" : "ld-" + convertStringToId(label),
		"class" : "av-loan-details-row clearfix"
	});

	var leftCol = $('<div>').attr({
		"class" : "av-loan-details-row-lc float-left"
	}).html(label);
	var rightCol = $('<div>').attr({
		"class" : "av-loan-details-row-rc float-left"
	});

	//jira-813
	if(label=="Lock Expiration"){
		value=value.lockExpiryDate;
		if(value!=null){
			value=$.datepicker.formatDate('mm-dd-YY', new Date(
					value));
			value=formatYearInDate(value);
		}		
	}
	rightCol.html(value);
	if (isLink) {
		rightCol.addClass('loan-detail-link');
		if (linkUrl) {
			rightCol.click(function(e) {
				if($(e.target).hasClass('creditScoreClickableClass'))
					return;
				e.stopPropagation();
				if (linkUrl.substring(0, 1) == "#") {
					$(linkUrl).click();
				} else {
					window.open(linkUrl, '_blank');
				}

			});
		}
	}

	row.append(leftCol).append(rightCol);

	$('#av-loan-details-container').append(row);
}

// Function to append add team member wrapper in loan managaer view
function appendAddTeamMemberWrapper(parentElement, clearParent, data) {
	var wrapper = $('<div>').attr({
		"class" : "add-team-mem-wrapper"
	}).data("additionalData", data);

	var header = $('<div>').attr({
		"class" : "add-team-mem-header clearfix"
	}).html("Add Team Member");

	var rightHeaderIcon = $('<div>').attr({
		"class" : "float-right"
	});

	header.append(rightHeaderIcon);

	var container = $('<div>').attr({
		"class" : "add-team-mem-container clearfix"
	});

	var userTypeCont = $('<div>').attr({
		"class" : "add-member-input-cont float-left clearfix"
	});

	var userTypeLabel = $('<div>').attr({
		"class" : "add-member-label float-left"
	}).html("User Type");

	var userTypeSel = $('<div>').attr({
		"id" : "add-memeber-user-type",
		"class" : "add-member-sel float-left"
	}).on('click', userTypeClicked);
	;

	userTypeCont.append(userTypeLabel).append(userTypeSel);

	var userNameCont = $('<div>').attr({
		"class" : "add-member-input-cont float-left clearfix"
	});

	var userNameLabel = $('<div>').attr({
		"class" : "add-member-label float-left"
	}).html("User Name");

	var userNameSel = $('<div>').attr({
		"id" : "add-member-sel",
		"class" : "add-member-sel-search float-left clearfix"
	});

	var userNameInput = $('<input>')
			.attr({
				"id" : "add-member-input",
				"class" : "add-member-input float-left"
			})
			.on(
					'input',
					function() {
						var name = $('#add-member-input').val();
						//console.log("Name entered : " + name);
						var code = $('#add-memeber-user-type').attr("code");
						var roleID = $('#add-memeber-user-type').attr("roleID");
						if (roleID == undefined
								&& (code != "TITLE_COMPANY" && code != "HOME_OWN_INS")) {
							showErrorToastMessage(selectUserType);
							return false;
						}else{
							removeToastMessage();
						}
						var internalRoleID = $('#add-memeber-user-type').attr(
								"internalRoleID");
						var isSearchUserRoleBased = $('#add-memeber-user-type')
								.attr("userRoleBased");
						if (isSearchUserRoleBased == "true")
							searchUsersBasedOnNameAndRole(name, roleID,
									internalRoleID);
						else if (isSearchUserRoleBased == "false")
							searchUsersBasedOnCode(name, code);
					});

	var downArrow = $('<div>')
			.attr({
				"class" : "add-member-down-arrow float-right"
			})
			.on(
					'click',
					function(e) {
						e.stopPropagation();
						if ($('#add-usertype-dropdown-cont').css("display") == "block") {
							hideUserTypeDropDown();
						}
						if ($('#add-username-dropdown-cont').css("display") == "block") {
							hideUserNameDropDown();
						} else {
							var name = "";
							//console.log("Name entered : " + name);
							var code = $('#add-memeber-user-type').attr("code");
							var roleID = $('#add-memeber-user-type').attr(
									"roleID");
							if ($('#add-memeber-user-type').html()=="") {
								showErrorToastMessage(selectUserType);
								return false;
							}else{
								removeToastMessage();
							}
							var internalRoleID = $('#add-memeber-user-type')
									.attr("internalRoleID");
							var isSearchUserRoleBased = $(
									'#add-memeber-user-type').attr(
									"userRoleBased");
							if (isSearchUserRoleBased == "true")
								searchUsersBasedOnNameAndRole(name, roleID,
										internalRoleID);
							else if (isSearchUserRoleBased == "false")
								searchUsersBasedOnCode(name, code);
						}
					});

	userNameSel.append(userNameInput).append(downArrow);
	userNameCont.append(userNameLabel).append(userNameSel);

	container.append(userTypeCont).append(userNameCont);

	wrapper.append(header).append(container);
	if (clearParent) {
		$('#' + parentElement).html("");
	}
	$('#' + parentElement).append(wrapper);

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
	$('#add-member-sel').append(dropdownCont);
}

function showUserNameDropDown(namesList,hideAddUser) {
	var hideAddUserOption = false;
	$('#add-username-dropdown-cont').show();
	var internalRole = $('#add-memeber-user-type').attr("internalroleid");
	if (internalRole && internalRole == "1")
		hideAddUserOption = true;
	if(hideAddUser&&hideAddUser===true)
		hideAddUserOption = true;
	paintUserNameDropDown(namesList, hideAddUserOption);
}

function hideUserNameDropDown() {
	$('#add-username-dropdown-cont').hide();
}

function paintUserNameDropDown(values, hideAddUser) {
	var dropdownCont = $('#add-username-dropdown-cont');
	dropdownCont.html('');
	if(!hideAddUser){
		var showinEditProfile = $('#add-memeber-user-type').attr("showinEditProfile");
		if(showinEditProfile && showinEditProfile=="1"){
			hideAddUser = true;
		}
		
	}
	var addUserdropDownRow = $('<div>')
	.attr({
		"id" : "add-member-user",
		"class" : "add-member-dropdown-row"
	})
	.html("Add New User")
	.on(
			'click',
			function(event) {

				event.stopPropagation();
				if ($('#add-username-dropdown-cont').css("display") == "block") {
					hideUserNameDropDown();
				}
				var callback = showAddUserPopUp;

				var memberType = $('#add-memeber-user-type');
				var userRoleBased = memberType.attr("userRoleBased")
				var code = memberType.attr("code")
				if (userRoleBased == "false") {
					if (code == "TITLE_COMPANY")
						callback = function() {
							var context;
							if (newfiObject.user.userRole.roleCd == "CUSTOMER")
								context = getCreateTitleCompanyContext(newfiObject.user.defaultLoanId);
							else
								context = getCreateTitleCompanyContext(selectedUserDetail.loanID);

							context.showCreateTitleCompanyPopup();

						}
					else if (code == "HOME_OWN_INS")
						callback = function() {
							var context;
							if (newfiObject.user.userRole.roleCd == "CUSTOMER")
								context = getCreateHomeOwnInsCompanyContext(newfiObject.user.defaultLoanId)
							else
								context = getCreateHomeOwnInsCompanyContext(selectedUserDetail.loanID);

							context.showCreateCompanyPopup();
						}

				}
				callback(event);

			});
		if (!hideAddUser)
				dropdownCont.append(addUserdropDownRow);

	if (values != undefined && values.length > 0) {
		for (var i = 0; i < values.length; i++) {

			var value = values[i];
			var dropDownRow = $('<div>')
					.attr({
						"class" : "add-member-dropdown-row",
						"userID" : value.id,
						"homeOwnInsID" : value.homeOwnInsID,
						"titleCompanyID" : value.titleCompanyID
					})
					.html(
							value.firstName
									+ " "
									+ (value.lastName == undefined ? ""
											: value.lastName))
					.bind(
							'click',{"userOb":value},
							function(event) {
								event.stopImmediatePropagation();
								var managerElement=$("#managerID");
								if(managerElement.length>0){
									var userOb=event.data.userOb;
									managerElement.attr("roleid",userOb.userRole.id);
									managerElement.val(event.data.userOb.emailId);
									managerElement.attr("userid",userOb.id);
									hideUserNameDropDown();
									return;
								}
								var userID = $(this).attr("userID");
								var homeOwnInsID = $(this).attr("homeOwnInsID");
								var titleCompanyID = $(this).attr(
										"titleCompanyID");
								var input = {
									"userID" : userID,
									"homeOwnInsID" : homeOwnInsID,
									"titleCompanyID" : titleCompanyID
								};
								//console.log("User id : " + userID);
								hideUserNameDropDown();
								hideMilestoneAddTeamMemberPopup(); // For
								// milestone
								// view
								$('#add-member-input').val("");
								if (newfiObject.user.userRole.roleCd == "CUSTOMER")
									addUserToLoanTeam(input,
											newfiObject.user.defaultLoanId);
								else
									addUserToLoanTeam(input,
											selectedUserDetail.loanID);
							});
			dropdownCont.append(dropDownRow);
		}
	} else if (hideAddUser) {
		var dropDownRow = $('<div>').attr({
			"class" : "add-member-dropdown-row"
		}).html("No results found.");
		dropdownCont.append(dropDownRow);
	}	
}

$(document).click(function() {
	if ($('#add-username-dropdown-cont').css("display") == "block") {
		$('#add-member-input').val("");
		hideUserNameDropDown();
	}
	
	if($('.overlay-popup-wrapper').css("display") == "block"){
		var parentElement=$('.delCustClas').parent();
		$(parentElement).removeClass('leads-container-tr-sel');
		$('.overlay-popup-wrapper').hide();
	}
	
});

function userTypeClicked(event) {
	event.stopImmediatePropagation();
	if ($('#add-usertype-dropdown-cont').css("display") == "block") {
		hideUserTypeDropDown();
	} else {
		showUserTypeDropDown();
	}
	if($("#add-username-dropdown-cont").css("display") == "block"){
		$("#add-username-dropdown-cont").hide();
	}
}

// Click function to create a user
function showAddUserPopUp(event) {
	event.stopImmediatePropagation();
	hideUserNameDropDown();
	showCreateUserPopup();
}

function showUserTypeDropDown() {
	appendUserTypeDropDown();
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
		"roleDescription" : "Realtor",
		"userRoleBased" : "true"
	} ];

	if (newfiObject.user.userRole.roleCd == "INTERNAL")
		for (i in newfiObject.internalUserRoleMasters) {
			var internalRole = newfiObject.internalUserRoleMasters[i];
			userRoles.push({
				"id" : 3,
				"internalRoleID" : internalRole.id,
				"label" : internalRole.roleDescription,
				"userRoleBased" : "true"
			});
		}

	// Allow to add a title company as well as home
	// insurance option

	var custOptions = [ {
		"label" : "Title Company",
		"roleDescription" : "TITLE COMPANY",
		"code" : "TITLE_COMPANY",
		"userRoleBased" : "false"
	}, {
		"label" : "Insurance Agent",
		"roleDescription" : "Home own ins",
		"code" : "HOME_OWN_INS",
		"userRoleBased" : "false"
	} ];
	for (j in custOptions)
		userRoles.push(custOptions[j]);

	for (var i = 0; i < userRoles.length; i++) {
		var userRole = userRoles[i];
		var dropDownRow = $('<div>').attr({
			"class" : "add-member-dropdown-row",
			"roleID" : userRole.id,
			"internalRoleID" : userRole.internalRoleID,
			"roleCD" : userRole.roleCD,
			"code" : userRole.code,
			"userRoleBased" : userRole.userRoleBased
		}).html(userRole.label)
				.on(
						'click',
						function(event) {
							event.stopImmediatePropagation();
							var roleIDCurr = $(this).attr("roleID");
							var code = $(this).attr("code");
							var roleIDPrev = $('#add-memeber-user-type').attr(
									"roleID");
							$('#add-memeber-user-type').attr("code", code);
							$('#add-memeber-user-type').attr("roleID",
									roleIDCurr);
							$('#add-memeber-user-type').attr("internalRoleID",
									$(this).attr("internalRoleID"));
							$('#add-memeber-user-type').attr("userRoleBased",
									$(this).attr("userRoleBased"));
							$('#add-memeber-user-type').html($(this).html());
							hideUserTypeDropDown();
						});
		dropdownCont.append(dropDownRow);
	}

	$('#add-memeber-user-type').append(dropdownCont);
}

$(document).click(function() {
	if ($('#add-usertype-dropdown-cont').css("display") == "block") {
		hideUserTypeDropDown();
	}
});

function appendNewfiTeamWrapper(loanDetails) {
	var team = loanDetails.extendedLoanTeam;
	var teamMembers = team.users;
	var loanID = loanDetails.id;
	var wrapper = $('<div>').attr({
		"class" : "newfi-team-wrapper"
	});
	var container = $('<div>').attr({
		"class" : "newfi-team-container"
	});

	var tableHeader = getTeamListTableHeader();
	container.append(tableHeader);

	for (var i = 0; i < teamMembers.length; i++) {
		var tableRow = getTeamListTableRow(teamMembers[i], loanID);
		container.append(tableRow);
	}

	var homwOwnInsurance = team.homeOwnInsCompany;
	var titleCompany = team.titleCompany;
	if (homwOwnInsurance != null) {
		homwOwnInsurance.homeOwnInsID = homwOwnInsurance.id;
		homwOwnInsurance.firstName = homwOwnInsurance.name;
		homwOwnInsurance.emailId = homwOwnInsurance.emailID;
		homwOwnInsurance.userRole = {
			label : "Insurance Agent"
		};
		var tableRow = getTeamListTableRow(homwOwnInsurance, loanID);
		container.append(tableRow);
	}

	if (titleCompany != null) {
		titleCompany.titleCompanyID = titleCompany.id;
		titleCompany.firstName = titleCompany.name;
		titleCompany.emailId = titleCompany.emailID;
		titleCompany.userRole = {
			label : "Title Company"
		};
		var tableRow = getTeamListTableRow(titleCompany, loanID);
		container.append(tableRow);
	}
	wrapper.append(container);
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
		"userid" : user.id,
		"homeOwnInsID" : user.homeOwnInsID,
		"titleCompanyID" : user.titleCompanyID

	});
	if (user.lastName == undefined)
		user.lastName = "";

	var trCol1 = $('<div>').attr({
		"class" : "newfi-team-list-tr-col1 float-left"
	}).html(user.firstName + " " + user.lastName);

	var trCol2 = $('<div>').attr({
		"class" : "newfi-team-list-tr-col2 float-left"
	});

	var userRoleStr = user.userRole.label;
	// TODO -- remove hard coding for internal user
	if (user.userRole.id == 3) {
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

	if ((user.homeOwnInsID && user.homeOwnInsID > 0)
			|| (user.titleCompanyID && user.titleCompanyID > 0))
		user.id = null;

	var userDelIcn = $('<div>').attr({
		"class" : "user-del-icn",
		"userid" : user.id,
		"loanID" : loanID,
		"homeOwnInsID" : user.homeOwnInsID,
		"titleCompanyID" : user.titleCompanyID
	});
	userDelIcn.click(function(e) {
		var userID = $(this).attr("userid");
		var loanID = $(this).attr("loanid");
		var homeOwnInsID = $(this).attr("homeOwnInsID");
		var titleCompanyID = $(this).attr("titleCompanyID");
		if (userID == undefined)
			userID = 0;
		if (homeOwnInsID == undefined)
			homeOwnInsID = 0;
		if (titleCompanyID == undefined)
			titleCompanyID = 0;

		var input = {
			"userID" : userID,
			"homeOwnInsID" : homeOwnInsID,
			"titleCompanyID" : titleCompanyID
		};
		e.stopImmediatePropagation();
		confirmRemoveUser(messageToDeleteUser, input,
				loanID);
	});
	trCol5.append(userDelIcn);
	return tableRow.append(trCol1).append(trCol2).append(trCol3).append(trCol4)
			.append(trCol5);
}

function confirmRemoveUser(textMessage, input, loanID,callback) {

	$('#overlay-confirm').off();
	$('#overlay-cancel').off();

	$('#overlay-popup-txt').html(textMessage);
	$('#overlay-confirm').on('click', function() {
		removeUserFromLoanTeam(input, loanID,callback);
		$('#overlay-popup').hide();
	});

	$('#overlay-cancel').on('click', function() {
		$('#overlay-popup').hide();
	});

	$('#overlay-popup').show();
}

$(document).on('click', '#ld-customer-profile .loan-detail-link', function(event) {

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
$("#overlay-popup").on("click",function(e){e.stopImmediatePropagation();})
$(document).on('keyup', function(e) {
	if (e.which == 27) {
		hideCustomerEditProfilePopUp();
	}
});

$(document).click(function() {
	if ($('#cus-prof-popup').css("display") == "block") {
		hideCustomerEditProfilePopUp();
	}
	if($('#overlay-popup').css("display")== "block")
		$('#overlay-popup').hide();
});

function appendCustomerEditProfilePopUp() {
	var popUpWrapper = $('<div>').attr({
		"id" : "cus-prof-popup",
		"class" : "pop-up-wrapper cus-prof-popup hide"
	});

	var header = $('<div>').attr({
		"class" : "pop-up-header"
	}).html(selectedUserDetail.firstName + "  " + selectedUserDetail.lastName);

	var container = $('<div>').attr({
		"id" : "cus-prof-container",
		"class" : "pop-up-container"
	});

	popUpWrapper.append(header).append(container);

	$('#ld-customer-profile .loan-detail-link').append(popUpWrapper);

	appendCustomerProfEditRow("First Name", selectedUserDetail.firstName,
			"firstNameID");

	appendCustomerProfEditRow("Last Name", selectedUserDetail.lastName,
			"lastNameID");

	// Upload photo row
	appendCustomerProfUploadPhotoRow();
	appendCustomerProfEditRow("Email", selectedUserDetail.emailId, "emailIdID");
	appendStateEditRow();		
	appendCityEditRow();
	appendZipEditRow();
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
		autoclose : true,
		endDate : new Date()
	}).on('show', function(e) {
		var $popup = $('.datepicker');
		$popup.click(function() {
			return false;
		});
	}).mask('00/00/0000');

	row.append(label).append(dobInput).append(appendErrorMessage());
	$('#cus-prof-container').append(row);
	appendCustomerProfEditRow("Primary Phone", selectedUserDetail.phoneNo,
			"primaryPhoneID");
	$('#emailIdID').attr("readonly", true)
	// To append carrier info
	appendCarrierNameDropDown();
	//TO append mobile preference
	appendCustomerProfEditRow("Receive SMS Alert", selectedUserDetail.setMobileAlertPreference,
	"");
	var saveBtn = $('<div>').attr({
		"class" : "prof-cust-save-btn",
		"onclick" : "updateUserProfile()"
	}).html("save");

	$('#cus-prof-container').append(saveBtn);
	addStateCityZipLookUp();

}

function appendCityEditRow() {
	var row = $('<div>').attr({
		"class" : "cust-prof-edit-row clearfix"
	});
	var rowCol1 = $('<div>').attr({
		"class" : "cust-prof-edit-label float-left"
	}).html("City");
	var rowCol2 = $('<div>').attr({
		"class" : "prof-form-rc float-left"
	});

	var inputCont = $('<div>').attr({
		"class" : "prof-form-input-cont"
	});

	var cityInput = $('<input>').attr({
		"class" : "prof-form-input",
		"value" : selectedUserDetail.city,
		"id" : "cityId"
	}).bind('keydown', function(e) {
		e.stopPropagation();
		var searchData = [];
		for (var i = 0; i < currentZipcodeLookUp.length; i++) {
			searchData[i] = currentZipcodeLookUp[i].cityName;
		}

		var uniqueSearchData = searchData.filter(function(itm, i, a) {
			return i == a.indexOf(itm);
		});

		initializeCityLookup(uniqueSearchData);
	}).bind('focus', function() {

		$(this).trigger('keydown');
		$(this).autocomplete("search");
	});

	var errMessage = $('<div>').attr({
		"class" : "err-msg hide"
	});

	inputCont.append(cityInput).append(errMessage);

	rowCol2.append(inputCont);
	row.append(rowCol1).append(rowCol2);
	$('#cus-prof-container').append(row);
}

function appendStateEditRow() {
	var row = $('<div>').attr({
		"class" : "cust-prof-edit-row clearfix"
	});
	var rowCol1 = $('<div>').attr({
		"class" : "cust-prof-edit-label float-left"
	}).html("State");
	var rowCol2 = $('<div>').attr({
		"class" : "prof-form-rc float-left"
	});
	var stateInput = $('<input>')
			.attr(
					{
						"class" : "prof-form-input prof-form-input-sm prof-form-input-select uppercase",
						"id" : "stateId",
						"value" : selectedUserDetail.state
					}).bind('click', function(e) {
				e.stopPropagation();
				if ($('#state-dropdown-wrapper').css("display") == "none") {
					appendStateDropDown('state-dropdown-wrapper', stateLists);
					toggleStateDropDown();
				} else {
					toggleStateDropDown();
				}
			}).bind('keyup', function(e) {
				e.stopPropagation();
				var searchTerm = "";
				if (!$(this).val()) {
					return false;
				}
				searchTerm = $(this).val().trim();
				var searchList = searchInStateArray(searchTerm);
				appendStateDropDown('state-dropdown-wrapper', searchList);
			});

	if (user.customerDetail.addressState) {
		stateInput.val(user.customerDetail.addressState);
		var stateCode = user.customerDetail.addressState.toUpperCase();

		var stateId = findStateIdForStateCode(stateCode);
		ajaxRequest("rest/states/" + stateId + "/zipCode", "GET", "json", "",
				zipCodeLookUpListCallBack);
	}

	var dropDownWrapper = $('<div>').attr({
		"id" : "state-dropdown-wrapper",
		"class" : "state-dropdown-wrapper hide"
	});

	rowCol2.append(stateInput).append(dropDownWrapper);
	row.append(rowCol1).append(rowCol2);
	$('#cus-prof-container').append(row);
}

function appendZipEditRow() {
	var row = $('<div>').attr({
		"class" : "cust-prof-edit-row clearfix"
	});
	var rowCol1 = $('<div>').attr({
		"class" : "cust-prof-edit-label float-left"
	}).html("Zip");
	var rowCol2 = $('<div>').attr({
		"class" : "prof-form-rc float-left"
	});

	var inputCont = $('<div>').attr({
		"class" : "prof-form-input-cont"
	});

	var zipInput = $('<input>').attr({
		"class" : "prof-form-input prof-form-input-sm",
		"value" : selectedUserDetail.zipCode,
		"id" : "zipcodeId"
	}).bind('keydown', function(e) {
		e.stopPropagation();
		var selectedCity = $('#cityId').val();
		var searchData = [];
		var count = 0;
		for (var i = 0; i < currentZipcodeLookUp.length; i++) {
			if (selectedCity == currentZipcodeLookUp[i].cityName) {
				searchData[count++] = currentZipcodeLookUp[i].zipcode;
			}
		}
		initializeZipcodeLookup(searchData);
	}).bind('focus', function() {

		$(this).trigger('keydown');
		$(this).autocomplete("search");
	}).mask('99999');

	var errMessage = $('<div>').attr({
		"class" : "err-msg hide"
	});

	inputCont.append(zipInput).append(errMessage);

	rowCol2.append(inputCont);
	row.append(rowCol1).append(rowCol2);
	$('#cus-prof-container').append(row);
}

function appendCarrierNameDropDown() {

	var row = $('<div>').attr({
		"class" : "cust-prof-edit-row clearfix",
		"id" : "prof-form-row-custom-email"
	});

	var label = $('<div>').attr({
		"class" : "cust-prof-edit-label float-left"
	}).html("Carrier Name");

	var rowCol2 = $('<div>').attr({
		"class" : "prof-form-rc float-left"
	});

	var carrierinfo = $('<input>')
			.attr(
					{
						"class" : "prof-form-input-carrier prof-form-input-carrierDropdown prof-form-input-select",
						"value" : selectedUserDetail.carrierName,
						"placeholder" : "Select Carrier",
						"id" : "carrierInfoID"
					})
			.bind(
					'click',
					function(e) {
						e.stopPropagation();
						if ($('#carrier-dropdown-wrapper').css("display") == "none") {
							appendCarrierNames('carrier-dropdown-wrapper',
									mobileCarrierNames);
							toggleCarrierDropDown();
						} else {
							toggleCarrierDropDown();
						}
					});


	var dropDownWrapper = $('<div>').attr({
		"id" : "carrier-dropdown-wrapper",
		"class" : "carrier-dropdown-wrapper hide"
	});
		rowCol2.append(carrierinfo).append(dropDownWrapper).append(appendErrorMessage());
		row.append(label).append(rowCol2);
		$('#cus-prof-container').append(row);
}
function updateUserProfile() {
	var firstname=validateFirstName("firstNameID");
	var lastname=validateLastName("lastNameID");
	if(!firstname || !lastname){
		return false;
	}
	var userProfileJson = new Object();

	userProfileJson.id = selectedUserDetail.userID;
	userProfileJson.firstName = $("#firstNameID").val();
	userProfileJson.lastName = $("#lastNameID").val();
	userProfileJson.emailId = $("#emailIdID").val();
	var phoneNumber = $("#primaryPhoneID").val();
	userProfileJson.phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

	var customerDetails = new Object();
	customerDetails.id = selectedUserDetail.customerId;
	customerDetails.addressCity = $("#cityId").val();
	customerDetails.addressState = $("#stateId").val();
	customerDetails.addressZipCode = $("#zipcodeId").val();
	customerDetails.dateOfBirth = $("#dobID").val();

	if($('.cust-radio-btn-yes').hasClass('radio-btn-selected')){
		userProfileJson.mobileAlertsPreference = true;	
		}else if($('.cust-radio-btn-no').hasClass('radio-btn-selected')){
		   userProfileJson.mobileAlertsPreference = false;
		}
	if ($('#carrierInfoID').val() != null || $('#carrierInfoID').val() != "") {
        
		userProfileJson.carrierInfo = $('#carrierInfoID').val();
	}
	userProfileJson.customerDetail = customerDetails;
       showOverlay();
		$.ajax({
			url : "rest/userprofile/managerupdateprofile",
			type : "POST",
			cache:false,
			data : {
				"updateUserInfo" : JSON.stringify(userProfileJson)
			},
			dataType : "json",
			success : function(data) {
				hideOverlay();
				if(data.error==null){
					showToastMessage(updateSuccessMessage);
					$("#cusProfNameTxtID").text(
							userProfileJson.firstName + " "
									+ userProfileJson.lastName);
					$('#cusProfPhoneNumber').html(formatPhoneNumberToUsFormat(userProfileJson.phoneNumber));
				}else{
					if(data.error.message){
						showErrorToastMessage(data.error.message);
					}else{
						showErrorToastMessage(updateErrorMessage);
					}
					
				}
				
				
				hideCustomerEditProfilePopUp();
			},
			error : function(error) {
				hideOverlay();
				showErrorToastMessage(updateErrorMessage);
			}
		});

}

function showCustomerEditProfilePopUp() {
	$('#cus-prof-popup').show();
}

function hideCustomerEditProfilePopUp() {
	$('#cus-prof-popup').hide();
}

function appendCustomerProfEditRow(labelTxt, value, id) {
	var row = $('<div>').attr({
		"class" : "cust-prof-edit-row clearfix"
	});
	var ErrMessage = $('<div>').attr({
		"class" : "err-msg hide"
	});
    if(labelTxt!="Receive SMS Alert"){
	var span = $('<span>').attr({

		"class" : "mandatoryClass"
	}).html("*").css("color", "red");

	var wrapper=$('<div>').attr({
		"class":"cust-prof-edit-wrapper float-left"
		
	});

	var label = $('<div>').attr({
		"class" : "cust-prof-edit-label float-left"
	}).html(labelTxt);

	if (id == "firstNameID" || id == "lastNameID" || id == "emailIdID") {
		label.append(span);
	}

	var inputTag = $('<input>').attr({
		"class" : "cust-prof-edit-input float-left",
		"id" : id,

	}).val(value);
	if(labelTxt=="Primary Phone"){
		inputTag.mask("(999) 999-9999");
	}
    wrapper.append(inputTag).append(ErrMessage);
	row.append(label).append(wrapper);
	$('#cus-prof-container').append(row);
}else{
	var rowCol1 = $('<div>').attr({
		"class" : "cust-prof-edit-label float-left"
	}).html("Receive SMS Alert");
	
	var rowColtext = $('<div>').attr({
		"class" : "cust-sms-ch float-left"
	}).html("Yes");
	var rowCol2 = $('<div>').attr({
		"class" : "prof-form-rc float-left"
	});
	var rowColtext2 = $('<div>').attr({
		"class" : "cust-sms-ch float-left"
	}).html("No");
	var inputCont = $('<div>').attr({
		"class" : "prof-form-input-cont"
	});
	
	var radioYesButton = $('<div>').attr({
		"class" : "cust-radio-btn-yes radio-btn float-left",		
		"id" : "alertSMSPreferenceIDYes",		
		

	}).bind('click',function(e){
			$('.cust-radio-btn-no').removeClass('radio-btn-selected');
			$(this).addClass('radio-btn-selected');	
			if($("#primaryPhoneID").val()==""||$("#primaryPhoneID").val()==null){
				var phoneStatus=phoneNumberValidation($("#primaryPhoneID").val(),true ,"primaryPhoneID");
				
			    if(!phoneStatus){
			    	if($("#carrierInfoID").val() == ""){
			    		$('#carrier-dropdown-wrapper').next('.err-msg').html(carrierSelectmessage).show();
						$('#carrierInfoID').addClass('ce-err-input').show();
			    		return false;
						
					}else{
						$('#carrier-dropdown-wrapper').next('.err-msg').html('');
						$('#carrierInfoID').removeClass('ce-err-input');
						
					}
			    	
			    }else{
			    	if($("#carrierInfoID").val() == ""){
			    		$('#carrier-dropdown-wrapper').next('.err-msg').html(carrierSelectmessage).show();
						$('#carrierInfoID').addClass('ce-err-input').show();
						return false;
					}else{
						$('#carrier-dropdown-wrapper').next('.err-msg').html('');
						$('#carrierInfoID').removeClass('ce-err-input');
					}
			    }	
			}else{
		    	if($("#carrierInfoID").val() == ""){
		    		$('#carrier-dropdown-wrapper').next('.err-msg').html(carrierSelectmessage).show();
					$('#carrierInfoID').addClass('ce-err-input').show();
					return false;
				}else{
					$('#carrier-dropdown-wrapper').next('.err-msg').html('');
					$('#carrierInfoID').removeClass('ce-err-input');
				}
		    }	
	});
	
	var radioNoButton = $('<div>').attr({
		"class" : "cust-radio-btn-no radio-btn float-left",		
		"id" : "alertSMSPreferenceIDNo"
	}).bind('click',function(e){
		
			$('.cust-radio-btn-yes').removeClass('radio-btn-selected');
			$(this).addClass('radio-btn-selected');
			if(	$('#carrierInfoID').next('.err-msg').html()!=""){
				$('#carrier-dropdown-wrapper').next('.err-msg').html('');
				$('#carrierInfoID').removeClass('ce-err-input');
			}
			
	});
	
	if(value!=null){
		if(value){
			radioYesButton.addClass('radio-btn-selected');
		}else if(!value){
			radioNoButton.addClass('radio-btn-selected');
		}}

	
	inputCont.append(radioYesButton).append(rowColtext).append(radioNoButton).append(rowColtext2);
	
	rowCol2.append(inputCont);
	 row.append(rowCol1).append(rowCol2);
	 $('#cus-prof-container').append(row);
}
}

$(document).on('keypress',"#firstName", function(e) {

    if($(this).val().length == 0){
        var k = e.which;
        var ok = k >= 65 && k <= 90 || // A-Z
            k >= 97 && k <= 122 || // a-z
            k >= 48 && k <= 57 || // 0-9
            k==32 ||//to allow space
    	    k==8 ||//to allow to delte
    	    k==46;//to allow backspace

        if (!ok){
            e.preventDefault();
        }
    }
}); 
$(document).on('keypress', "#lastName",function(e) {

    if($(this).val().length == 0){
        var k = e.which;
        var ok = k >= 65 && k <= 90 || // A-Z
            k >= 97 && k <= 122 || // a-z
            k >= 48 && k <= 57 ||// 0-9
            k==32 ||//to allow space
    	    k==8 ||//to allow to delte
    	    k==46;//to allow backspace

        if (!ok){
            e.preventDefault();
        }
    }
});
$(document).on('blur',"#carrierInfoID",function(){
	if($("#carrierInfoID").val()!=""||$("#carrierInfoID").val()!=null){
		$('#carrier-dropdown-wrapper').next('.err-msg').hide();
		$('#carrierInfoID').removeClass('err-input');
	}
});

$('body').on('focus',"#primaryPhoneID",function(){
    $(this).mask("(999) 999-9999");
});
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
	});

	var inputHiddenFile = $('<input>').attr({
		"type" : "file",
		"id" : "prof-image",
		"name" : selectedUserDetail.userID,
		"value" : "Upload"

	});
	var inputHiddenDiv = $('<div>').attr({
		"style" : "display:none"

	});

	inputHiddenDiv.append(inputHiddenFile);

	var uploadBtn = $('<div>').attr({
		"class" : "cust-prof-upload-btn",
		"id" : "uploadID",
		"onclick" : "uploadeImage()"
	}).html("upload");

	uploadPhotoRc.append(uploadPhotoFileName).append(uploadBtn).append(
			inputHiddenDiv);
	uploadPhotoCont.append(uploadIcn).append(uploadPhotoRc);
	row.append(label).append(uploadPhotoCont);
	$('#cus-prof-container').append(row);

}

function uploadeImage() {

	$("#prof-image").trigger('click');
	$(".overlay-container").css("display", "block");

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
	appendCreateUserPopupEmail();

	// save button
	var saveBtn = $('<div>').attr({
		"class" : "prof-cust-save-btn"
	}).html("save").on(
			'click',function(event) {
				event.stopImmediatePropagation();

				var user = new Object();
				user.emailId = $('#create-user-emailId').val();
				user.firstName = $('#create-user-first-name').val();
				user.lastName = $('#create-user-last-name').val();
				//console.log("Create user button clicked. User : "
						

				if (user.firstName == "") {
					 $('#create-user-first-name').next('.err-msg').html(firstNameEmptyMessage).show();
					 $('#create-user-first-name').addClass('ce-err-input').show();
					return false;
				}else{
					 $('#create-user-first-name').next('.err-msg').hide();
					 $('#create-user-first-name').removeClass('ce-err-input');
				} 
				if (user.lastName == "") {
					$('#create-user-last-name').next('.err-msg').html(lastNameEmptyMessage).show();
					$('#create-user-last-name').addClass('ce-err-input').show();
					return false;
				}else{
					$('#create-user-last-name').next('.admin-err-msg').hide();
					$('#create-user-last-name').removeClass('ce-err-input');
				} 
				if (user.emailId == "") {
					$('#create-user-emailId').next('.err-msg').html(emailEmptyMessage).show();
					$('#create-user-emailId').addClass('ce-err-input').show();
					return false;
				}else{
					$('#create-user-emailId').next('.err-msg').hide();
					$('#create-user-emailId').removeClass('ce-err-input');
				} 
				if(user.emailId!="")
				{var validationStatus=emailValidation(user.emailId);
			      if(validationStatus){
			    	  $('#create-user-emailId').val('');	
			    	  $('#create-user-emailId').next('.err-msg').html(invalidEmailErrorMessage).show();
			    	  $('#create-user-emailId').addClass('err-input').focus();
				  
				  return false;
				  }else{
					  $('#create-user-emailId').next('.err-msg').hide();
					  $('#create-user-emailId').removeClass('err-input');
				  }
			      
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

$(document).click(function() {
	if ($('#create-title-company-popup').css("display") == "block") {
		getCreateTitleCompanyContext(0).hideCreateTitleCompanyPopup();
	}
});

$(document).click(function() {
	if ($('#create-hoi-company-popup').css("display") == "block") {
		getCreateHomeOwnInsCompanyContext(0).hideCreateCompanyPopup();
	}
});

function getCreateHomeOwnInsCompanyContext(loanID) {

	var context = new Object();
	context.loanID = loanID;
	context.createCompanyPopup = function() {
		if ($("#create-hoi-company-popup").length > 0)
			return;

		var popUpWrapper = $('<div>').attr({
			"id" : "create-hoi-company-popup",
			"class" : "pop-up-wrapper create-user-popup hide"
		}).bind("click",function(e){
			e.stopImmediatePropagation();
		});;

		var header = $('<div>').attr({
			"class" : "pop-up-header"
		}).html("Create Insurance Agent");

		var container = $('<div>').attr({
			"id" : "create-hoi-company-container",
			"class" : "pop-up-container clearfix"
		});
		popUpWrapper.append(header).append(container);
		$('#add-member-sel').append(popUpWrapper);

		this.appendHoiCompanyName();
		this.appendAddress();
		this.appendPhoneNumber();
		this.appendFaxNumber();
		this.appendEmailId();
		this.appendPrimaryContact();
		var ob = this;
		// save button
		var saveBtn = $('<div>').attr({
			"class" : "prof-cust-save-btn"
		}).html("save").bind(
				'click',
				{
					"contxt" : ob
				},
				function(event) {
					event.stopImmediatePropagation();
					var ob = event.data.contxt;
					var company = new Object();
					company.name = $('#create-hoic-name').val();
					company.address = $('#create-hoic-address').val();
					var phoneNumber=$('#create-hoic-phone-number').val();
					company.phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
					var fax=$('#create-hoic-fax-number').val();
					company.fax = fax.replace(/[^0-9]/g, '');
					company.emailID = $('#create-hoic-email-id').val();
					company.primaryContact = $('#create-hoic-primary-contact')
							.val();

					ob.company = company;

					$('.err-msg').css('padding-left','109px');
					var companyName=validateFormFeild('#create-hoic-name','#create-hoic-name',companyNameEmptyMessage);
					var phoneNumber=validateFormFeild('#create-hoic-phone-number','#create-hoic-phone-number',phoneEmptyMessage);
					var userEmailID=validateFormFeild('#create-hoic-email-id','#create-hoic-email-id',emailAddressEmptyMessage);
					if(!companyName || !phoneNumber || !userEmailID){
						return false;
					}
					if (user.emailId == "") {
						showErrorToastMessage(emailEmptyMessage);
						return;
					}
				
					//console.log("Create company button clicked. User : "
							
					// TODO-write method to call add company
					//console.log("Adding company");
					ob.addCompany();
				});

		$('#create-hoi-company-popup').append(saveBtn);

	};

	context.appendHoiCompanyName = function() {

		var row = $('<div>').attr({
			"class" : "create-user-popup-cont clearfix float-left"
		});
		var label = $('<div>').attr({
			"class" : "create-user-popup-label float-left"
		}).html("Name");

		var inputBox = $('<input>').attr({
			"class" : "create-user-popup-input",
			"id" : "create-hoic-name"
		}).val("");
		row.append(label).append(inputBox).append(appendErrorMessage());
		$('#create-hoi-company-container').append(row);
	}

	context.appendAddress = function() {

		var row = $('<div>').attr({
			"class" : "create-user-popup-cont clearfix float-left"
		});
		var label = $('<div>').attr({
			"class" : "create-user-popup-label float-left"
		}).html("Address");

		var inputBox = $('<input>').attr({
			"class" : "create-user-popup-input",
			"id" : "create-hoic-address"
		}).val("");
		row.append(label).append(inputBox).append(appendErrorMessage());
		$('#create-hoi-company-container').append(row);
	}

	context.appendPhoneNumber = function() {

		var row = $('<div>').attr({
			"class" : "create-user-popup-cont clearfix float-left"
		});
		var label = $('<div>').attr({
			"class" : "create-user-popup-label float-left"
		}).html("Phone Number");

		var inputBox = $('<input>').attr({
			"class" : "create-user-popup-input",
			"id" : "create-hoic-phone-number"
		}).val("");
		inputBox.mask("(999) 999-9999");
		row.append(label).append(inputBox).append(appendErrorMessage());
		$('#create-hoi-company-container').append(row);
	}

	context.appendFaxNumber = function() {

		var row = $('<div>').attr({
			"class" : "create-user-popup-cont clearfix float-left"
		});
		var label = $('<div>').attr({
			"class" : "create-user-popup-label float-left"
		}).html("Fax Number");

		var inputBox = $('<input>').attr({
			"class" : "create-user-popup-input",
			"id" : "create-hoic-fax-number"
		}).val("");
		inputBox.mask("(999) 999-9999");
		row.append(label).append(inputBox).append(appendErrorMessage());
		$('#create-hoi-company-container').append(row);
	}

	context.appendEmailId = function() {

		var row = $('<div>').attr({
			"class" : "create-user-popup-cont clearfix float-left"
		});
		var label = $('<div>').attr({
			"class" : "create-user-popup-label float-left"
		}).html("Email address");

		var inputBox = $('<input>').attr({
			"class" : "create-user-popup-input",
			"id" : "create-hoic-email-id"
		}).val("");
		row.append(label).append(inputBox).append(appendErrorMessage());
		$('#create-hoi-company-container').append(row).append(appendErrorMessage());
	}

	context.appendPrimaryContact = function() {

		var row = $('<div>').attr({
			"class" : "create-user-popup-cont clearfix float-left"
		});
		var label = $('<div>').attr({
			"class" : "create-user-popup-label float-left"
		}).html("Primary Contact");

		var inputBox = $('<input>').attr({
			"class" : "create-user-popup-input",
			"id" : "create-hoic-primary-contact"
		}).val("");
		row.append(label).append(inputBox).append(appendErrorMessage());
		$('#create-hoi-company-container').append(row);
	}

	context.showCreateCompanyPopup = function() {

		if ($("#create-hoi-company-popup").length == 0)
			this.createCompanyPopup();

		var left = $('#center-panel-cont').offset().left;
		var top = $('#add-member-sel').offset().top;
		$('#create-hoic-name').val("");
		$('#create-hoic-address').val("");
		$('#create-hoic-phone-number').val("");
		$('#create-hoic-fax-number').val("");
		$('#create-hoic-email-address').val("");
		$('#create-hoic-primary-contact').val("");
		$('#create-hoi-company-popup').show();
	}

	context.hideCreateCompanyPopup = function() {
		$('#create-hoi-company-popup').hide();
		$('#ms-add-member-popup').hide();
	}

	context.addCompany = function(callback) {
		var ob = this;
		var data = {};

		ajaxRequest("rest/loan/homeOwnersInsurance/", "POST", "json", JSON
				.stringify(ob.company), function(response) {
			if (response.error) {
				
				showToastMessage(response.error.message)
			} else {
				$('create-tc-email-id').val('');
				$('create-hoic-email-id').val('');
				//console.log("Home owners ins company added");
				ob.response = response;
				if (callback) {
					callback(ob);
				}
				var input = {
					homeOwnInsID : response.resultObject.id
				};
				if (newfiObject.user.userRole.roleCd == "CUSTOMER")
					addUserToLoanTeam(input, newfiObject.user.defaultLoanId,
							function() {
								ob.hideCreateCompanyPopup();
							});
				else
					addUserToLoanTeam(input, selectedUserDetail.loanID,
							function() {
								ob.hideCreateCompanyPopup();
							});
			}

		});
	}

	context.addCompanyToTeamList = function() {

	}

	return context;

}
$('body').on('focus',"#create-tc-phone-number",function(){
    $(this).mask("(999) 999-9999");
});
$('body').on('focus',"#create-tc-fax-number",function(){
    $(this).mask("(999) 999-9999");
});
$('body').on('focus',"#create-hoic-phone-number",function(){
    $(this).mask("(999) 999-9999");
});
$('body').on('focus',"#create-hoic-fax-number",function(){
    $(this).mask("(999) 999-9999");
});
function getCreateTitleCompanyContext(loanID) {
	var context = new Object();
	context.loanID = loanID;
	context.createTitleCompanyPopup = function() {

		if ($("#create-title-company-popup").length > 0)
			return;

		var popUpWrapper = $('<div>').attr({
			"id" : "create-title-company-popup",
			"class" : "pop-up-wrapper create-user-popup hide"
		}).bind("click",function(e){
			e.stopImmediatePropagation();
		});

		var header = $('<div>').attr({
			"class" : "pop-up-header"
		}).html("Create Title Company");

		var container = $('<div>').attr({
			"id" : "create-title-company-container",
			"class" : "pop-up-container clearfix"
		});
		popUpWrapper.append(header).append(container);
		$('#add-member-sel').append(popUpWrapper);

		var ob = this;
		this.appendTitleCompanyName();
		this.appendAddress();
		this.appendPhoneNumber();
		this.appendFaxNumber();
		this.appendEmailId();
		this.appendPrimaryContact();

		// save button
		var saveBtn = $('<div>').attr({
			"class" : "prof-cust-save-btn"
		}).html("save").bind(
				'click',
				{
					"contxt" : ob
				},
				function(event) {
					event.stopImmediatePropagation();
					var ob = event.data.contxt;
					var company = new Object();
					company.name = $('#create-tc-name').val();
					company.address = $('#create-tc-address').val();
					var phoneNumber =  $('#create-tc-phone-number').val();
					company.phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
					var phoneNumber =  $('#create-tc-fax-number').val();
					company.fax = phoneNumber.replace(/[^0-9]/g, '');
					company.emailID = $('#create-tc-email-id').val();
					company.primaryContact = $('#create-tc-primary-contact')
							.val();

					ob.company = company;
					$('.err-msg').css('padding-left','109px');
					var companyName=validateFormFeild('#create-tc-name','#create-tc-name',companyNameEmptyMessage);
					var phoneNumber=validateFormFeild('#create-tc-phone-number','#create-tc-phone-number',phoneEmptyMessage);
					var userEmailID=validateFormFeild('#create-tc-email-id','#create-tc-email-id',emailAddressEmptyMessage);
					if(!companyName || !phoneNumber || !userEmailID){
						return false;
					}
					if (user.emailId == "") {
						showErrorToastMessage(emailEmptyMessage);
						return;
					}
					ob.addCompany();

				});

		$('#create-title-company-popup').append(saveBtn);

	};

	context.appendTitleCompanyName = function() {

		var row = $('<div>').attr({
			"class" : "create-user-popup-cont clearfix float-left"
		});
		var label = $('<div>').attr({
			"class" : "create-user-popup-label float-left"
		}).html("Name");

		var inputBox = $('<input>').attr({
			"class" : "create-user-popup-input",
			"id" : "create-tc-name"
		}).val("");
		row.append(label).append(inputBox).append(appendErrorMessage());
		$('#create-title-company-container').append(row);
	}

	context.appendAddress = function() {

		var row = $('<div>').attr({
			"class" : "create-user-popup-cont clearfix float-left"
		});
		var label = $('<div>').attr({
			"class" : "create-user-popup-label float-left"
		}).html("Address");

		var inputBox = $('<input>').attr({
			"class" : "create-user-popup-input",
			"id" : "create-tc-address"
		}).val("");
		row.append(label).append(inputBox).append(appendErrorMessage());
		$('#create-title-company-container').append(row);
	}

	context.appendPhoneNumber = function() {

		var row = $('<div>').attr({
			"class" : "create-user-popup-cont clearfix float-left"
		});
		var label = $('<div>').attr({
			"class" : "create-user-popup-label float-left"
		}).html("Phone Number");

		var inputBox = $('<input>').attr({
			"class" : "create-user-popup-input",
			"id" : "create-tc-phone-number"
		}).val("");
		inputBox.mask("(999) 999-9999");
		row.append(label).append(inputBox).append(appendErrorMessage());
		$('#create-title-company-container').append(row);
	}

	context.appendFaxNumber = function() {

		var row = $('<div>').attr({
			"class" : "create-user-popup-cont clearfix float-left"
		});
		var label = $('<div>').attr({
			"class" : "create-user-popup-label float-left"
		}).html("Fax Number");

		var inputBox = $('<input>').attr({
			"class" : "create-user-popup-input",
			"id" : "create-tc-fax-number"
		}).val("");
		inputBox.mask("(999) 999-9999");
		row.append(label).append(inputBox).append(appendErrorMessage());
		$('#create-title-company-container').append(row);
	}

	context.appendEmailId = function() {

		var row = $('<div>').attr({
			"class" : "create-user-popup-cont clearfix float-left"
		});
		var label = $('<div>').attr({
			"class" : "create-user-popup-label float-left"
		}).html("Email address");

		var inputBox = $('<input>').attr({
			"class" : "create-user-popup-input",
			"id" : "create-tc-email-id"
		}).val("");
		row.append(label).append(inputBox).append(appendErrorMessage());
		$('#create-title-company-container').append(row);
	}

	context.appendPrimaryContact = function() {

		var row = $('<div>').attr({
			"class" : "create-user-popup-cont clearfix float-left"
		});
		var label = $('<div>').attr({
			"class" : "create-user-popup-label float-left"
		}).html("Primary Contact");

		var inputBox = $('<input>').attr({
			"class" : "create-user-popup-input",
			"id" : "create-tc-primary-contact"
		}).val("");
		row.append(label).append(inputBox).append(appendErrorMessage());
		$('#create-title-company-container').append(row);
	}

	context.showCreateTitleCompanyPopup = function() {

		if ($("#create-title-company-popup").length == 0)
			this.createTitleCompanyPopup();

		var left = $('#center-panel-cont').offset().left;
		var top = $('#add-member-sel').offset().top;
		$('#create-tc-name').val("");
		$('#create-tc-address').val("");
		$('#create-tc-phone-number').val("");
		$('#create-tc-fax-number').val("");
		$('#create-tc-email-address').val("");
		$('#create-tc-primary-contact').val("");
		$('#create-title-company-popup').show();
	}

	context.hideCreateTitleCompanyPopup = function() {
		$('#create-title-company-popup').hide();
		$('#ms-add-member-popup').hide();
	}

	context.addCompany = function(callback) {
		var ob = this;
		var data = {};

		ajaxRequest("rest/loan/titleCompany", "POST", "json", JSON
				.stringify(ob.company), function(response) {
			if (response.error) {
				
				showToastMessage(response.error.message);
			} else {
				$('#create-tc-email-id').val('');
				//console.log("Title company added");
				ob.response = response;
				if (callback) {
					callback(ob);
				}
				var input = {
					titleCompanyID : response.resultObject.id
				};
				if (newfiObject.user.userRole.roleCd == "CUSTOMER")
					addUserToLoanTeam(input, newfiObject.user.defaultLoanId,
							function() {
								ob.hideCreateTitleCompanyPopup();
							});
				else
					addUserToLoanTeam(input, selectedUserDetail.loanID,
							function() {
								ob.hideCreateTitleCompanyPopup();
							});
			}

		});
	}

	context.addCompanyToTeamList = function() {

	}

	return context;
}

function showCreateUserPopup() {
	var leftPannelValue = $('#center-panel-cont').offset();
	var topValue = $('#add-member-sel').offset();
	if (leftPannelValue != undefined && topValue != undefined) {
		var left = $('#center-panel-cont').offset().top;
		var top = $('#add-member-sel').offset().left;
		$('#create-user-first-name').val("");
		$('#create-user-last-name').val("");
		$('#create-user-emailId').val("");
		$('#create-user-popup').show();
	} else {
		var left = $('#create-user-id').offset().top;
		var top = $('#create-user-id').offset().left;
		$('#create-user-first-name').val("");
		$('#create-user-last-name').val("");
		$('#create-user-emailId').val("");
		$('#admin-create-user-popup').show();
	}
}

function hideCreateUserPopup() {
	$('#create-user-popup').hide();
	
	//To remove validation
	$('#create-user-first-name').next('.err-msg').hide();
	$('#create-user-first-name').removeClass('ce-err-input');


	$('#create-user-last-name').next('.err-msg').hide();
	$('#create-user-last-name').removeClass('ce-err-input');


	$('#create-user-emailId').next('.err-msg').hide();
	$('#create-user-emailId').removeClass('ce-err-input');


	$('#create-user-emailId').next('.err-msg').hide();
	$('#create-user-emailId').removeClass('ce-err-input');
}

function appendCreateUserPopupFirstName() {
	var ErrMessage = $('<div>').attr({
		"class" : "err-msg loan-type hide"
	});
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
	row.append(label).append(inputBox).append(ErrMessage);
	$('#create-user-container').append(row);
}

function appendCreateUserPopupLastName() {
	var ErrMessage = $('<div>').attr({
		"class" : "err-msg loan-type hide"
	});
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
	row.append(label).append(inputBox).append(ErrMessage);
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
	var ErrMessage = $('<div>').attr({
		"class" : "err-msg loan-type hide"
	});
	var row = $('<div>').attr({
		"class" : "create-user-popup-cont clearfix float-left"
	});
	var label = $('<div>').attr({
		"class" : "create-user-popup-label float-left"
	}).html("Email");
	var inputBox = $('<input>').attr({
		"class" : "create-user-popup-input",
		"id" : "create-user-emailId",

	}).val("");
	row.append(label).append(inputBox).append(ErrMessage);
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
		"class" : "add-needs-input-edit float-left",
		"maxlength":'45'
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
	
	//TO capture lQB doc type for custom need
	var row4 = $('<div>').attr({
		"class" : "add-needs-input-row clearfix"
	});
	var row4Label = $('<div>').attr({
		"class" : "add-needs-input-label float-left"
	}).html("LQB Doc Type");
	var row4Input = $('<input>').attr({
		"id" : "lqb_need_doc_type",
		"class" : "add-needs-input-edit float-left"
	});
	row4.append(row4Label).append(row4Input);
	
	container.append(row1).append(row2).append(row4).append(row3);

	//NEXNF-836
	var addNeedsBtn = $('<div>').attr({
		"class" : "cep-button-color  add-needs-btn",
		"onclick" : "saveCustomNeed()"
	}).html("Add Needs");

	container.append(addNeedsBtn);

	wrapper.append(header).append(container);
	$('#initial-needs-wrapper').append(wrapper);
}

$(document).on('keyup', '#need_doc_title', function() {

	var data = contxt.customList[($("#need_doc_type").val())];
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
}

function clearAddNeedForm() {
	$('#need_doc_title').val('');
	$('#need_doc_desc').val('');
	$('#lqb_need_doc_type').val('');
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

function removeUserFromLoanTeam(input, loanID,callback) {

	var userID = input.userID;
	var homeOwnInsID = input.homeOwnInsID;
	var titleCompanyID = input.titleCompanyID
	var queryString = "userID=" + userID + "&homeOwnInsCompanyID="
			+ homeOwnInsID + "&titleCompanyID=" + titleCompanyID;

	ajaxRequest("rest/loan/" + loanID + "/team?" + queryString, "DELETE",
			"json", {},function(response){
				onReturnOfRemoveUserFromLoanTeam(response,callback);
			});
}

function onReturnOfRemoveUserFromLoanTeam(data,callback) {

	var editLoanTeamVO = data.resultObject;
	var result = editLoanTeamVO.operationResult;
	if (!result) {
		showErrorToastMessage(userRemovalErrorMessage);
		return;
	} else
		showToastMessage(userRemoveSuccessMessage);

	var loanID = editLoanTeamVO.loanID;
	var userID = editLoanTeamVO.userID;
	var homeOwnInsID = editLoanTeamVO.homeOwnInsCompanyID;
	var titleCompanyID = editLoanTeamVO.titleCompanyID

	var teamMemberRow;
	if (userID && userID > 0)
		teamMemberRow = $(".user-del-icn[userid=" + userID + "][loanid="
				+ loanID + "]");
	else if (homeOwnInsID && homeOwnInsID > 0)
		teamMemberRow = $(".user-del-icn[homeOwnInsID=" + homeOwnInsID
				+ "][loanid=" + loanID + "]");
	else if (titleCompanyID && titleCompanyID > 0)
		teamMemberRow = $(".user-del-icn[titleCompanyID=" + titleCompanyID
				+ "][loanid=" + loanID + "]");

	teamMemberRow.parent().parent().remove();
	if(callback)
		callback();
}

function addUserToLoanTeam(input, loanID, callback) {

	var addData = $('.add-team-mem-wrapper').data('additionalData');
	var userID = input.userID == undefined ? 0 : input.userID;
	var homeOwnInsID = input.homeOwnInsID == undefined ? 0 : input.homeOwnInsID;
	var titleCompanyID = input.titleCompanyID == undefined ? 0
			: input.titleCompanyID;
	input.loanID = loanID;
	var queryString = "userID=" + userID + "&homeOwnInsCompanyID="
			+ homeOwnInsID + "&titleCompanyID=" + titleCompanyID;
	if (addData && addData.OTHURL) {

		ajaxRequest(addData.OTHURL, "POST", "json", JSON.stringify(input),
				function(data) {

					var user = JSON.parse(data.resultObject);
					data.resultObject = user;
					onReturnOfAddUserToLoanTeam(data, callback);
				});
		return;
	}

	ajaxRequest("rest/loan/" + loanID + "/team?" + queryString, "POST", "json",
			{}, function(response) {
				onReturnOfAddUserToLoanTeam(response, callback)
			});
}

function onReturnOfAddUserToLoanTeam(data, callback) {

	var editLoanTeamVO = data.resultObject;
	var result = editLoanTeamVO.operationResult;

	var loanID = editLoanTeamVO.loanID;
	var userID = editLoanTeamVO.userID;

	var homeOwnInsID = editLoanTeamVO.homeOwnInsCompanyID;
	var titleCompanyID = editLoanTeamVO.titleCompanyID

	var teamMemberRow;
	var userToAdd;
	if (userID && userID > 0) {
		if (!result) {
			showErrorToastMessage(userRemovalErrorMessage);
			return;
		}
		teamMemberRow = $(".newfi-team-list-tr[userid=" + userID + "]");
		userToAdd = editLoanTeamVO.user;
	} else if (homeOwnInsID && homeOwnInsID > 0) {
		teamMemberRow = $(".newfi-team-list-tr[homeOwnInsID=" + homeOwnInsID
				+ "]");

		userToAdd = editLoanTeamVO.homeOwnInsCompany;
		userToAdd.firstName = userToAdd.name;
		userToAdd.emailId = userToAdd.emailID;
		userToAdd.homeOwnInsID = editLoanTeamVO.homeOwnInsCompanyID;
		userToAdd.userRole = {
			label : "Insurance Agent"
		};

	} else if (titleCompanyID && titleCompanyID > 0) {
		teamMemberRow = $(".newfi-team-list-tr[titleCompanyID="
				+ titleCompanyID + "]");
		userToAdd = editLoanTeamVO.titleCompany;
		userToAdd.firstName = userToAdd.name;
		userToAdd.emailId = userToAdd.emailID;
		userToAdd.titleCompanyID = editLoanTeamVO.titleCompanyID;
		userToAdd.userRole = {
			label : "Title Company"
		};

	}

	if (teamMemberRow != undefined && teamMemberRow.length > 0) {
		showErrorToastMessage(userExsistErrorMessage);
		return;
	}

	var teamMemberRow = getTeamListTableRow(userToAdd, loanID);
	var teamContainer = $(".newfi-team-container").append(teamMemberRow);

	// for milestone
	var addData = $('.add-team-mem-wrapper').data('additionalData');
	var container = $(".ms-team-member-table");
	var existingDiv = $('.ms-team-member-table').find(
			'.ms-team-member-tr[userid=' + userID + ']');
	if (existingDiv != undefined && existingDiv.length > 0) {
		showErrorToastMessage(userExsistErrorMessage);
		return;
	}

	showToastMessage(userAddedToLoanTeamSuccessMessage);
	if (addData != undefined) {
		var parentContainer = $("#WF" + addData.milestoneID);
		clearStatusClass(parentContainer);
		parentContainer.addClass("m-in-progress");
		container.append(getMilestoneTeamMembeTableRow(userToAdd));
	}
	if (callback) {
		callback();
	}
}

function searchUsersBasedOnNameAndRole(name, roleID, internalRoleID,hideAddUserOpt) {

	var restURL = "rest/userprofile/search?name=" + name;
	if (roleID != undefined && roleID > 0)
		restURL += "&roleID=" + roleID;
	if (internalRoleID != undefined && internalRoleID > 0)
		restURL += "&internalRoleID=" + internalRoleID;

	ajaxRequest(restURL, "GET", "json", {},function(response){
		onReturnOfUserSearchToAddToLoanTeam(response,hideAddUserOpt);
	}, true);

}

function searchUsersBasedOnCode(name, code) {

	var restURL = "rest/loan/searchTitleCompanyOrHomeOwnIns?";
	var id;
	if (code == "TITLE_COMPANY") {
		restURL += "code=" + code;
		id = "titleCompanyID";
	} else if (code = "HOME_OWN_INS") {
		restURL += "code=" + code;
		id = "homeOwnInsID";
	} else
		return;

	restURL += "&companyName=" + name;

	ajaxRequest(restURL, "GET", "json", {}, function(data) {
		onReturnSearchBasedOnCodeToAddToLoanTeam(data, id);
	}, true);

}

function onReturnSearchBasedOnCodeToAddToLoanTeam(data, id) {
	var result = data.resultObject;
	if (!result || result.length < 1)
		showUserNameDropDown([]);

	var adapterArray = [];
	for (i in result) {
		var value = result[i];
		var obj = {
			"class" : "add-member-dropdown-row",
			"firstName" : value.name
		};
		obj[id] = value.id;
		adapterArray.push(obj);
	}

	showUserNameDropDown(adapterArray)
}

function onReturnOfUserSearchToAddToLoanTeam(data,hideAddUserOpt) {
	showUserNameDropDown(data.resultObject,hideAddUserOpt)
}

function createUserAndAddToLoanTeam(user) {

	ajaxRequest("rest/userprofile/", "POST", "json", JSON.stringify(user),
			onReturnOfCreateUserAndAddToLoanTeam);

}

function onReturnOfCreateUserAndAddToLoanTeam(data) {
	//console.log("Return : " + JSON.stringify(data));	
	if(data.error!= undefined && data.error.code=="522"){
		showErrorToastMessage(emailAldreadyExsist);
		return;
	}	
	var result = data.resultObject;
	hideCreateUserPopup();
	hideMilestoneAddTeamMemberPopup();
	$('#add-member-input').val("");

	var input = {
		userID : result.id
	};
	if (newfiObject.user.userRole.roleCd == "CUSTOMER")
		addUserToLoanTeam(input, newfiObject.user.defaultLoanId);
	else
		addUserToLoanTeam(input, selectedUserDetail.loanID);

}

// Click function to show payment page
$(document).on('click', '.pay-application-fee', function(event) {
	//console.log("Pay application fee clicked!");
	showOverlay();
	$('body').addClass('body-no-scroll');
	url = "./payment/paymentpage.do";

	$.ajax({
		url : url,
		type : "GET",
		cache:false,
		success : function(data) {
			//console.log("Show payment called with data : " + data);
			$("#popup-overlay").html(data);
			hideOverlay();
			$("#popup-overlay").show();
		},
		error : function(e) {
			hideOverlay();
			//console.error("error : " + e);
		}
	});
});

function entryPointForAgentView(loanID, viewName) {
	synchronousAjaxRequest("rest/states/", "GET", "json", "", listOfStates);
	synchronousAjaxRequest("rest/userprofile/getMobileCarriers", "GET", "json",
			"", mobileCarrierNameList);
	if (selectedUserDetail === undefined || selectedUserDetail.loanID != loanID)
		ajaxRequest("rest/loan/" + loanID + "/retrieveDashboard", "GET",
				"json", undefined, function(response) {
					resetSelectedUserDetailObject(response.resultObject);
					entryPointAgentViewChangeNav(viewName);

				});
	else
		entryPointAgentViewChangeNav(viewName)

}
function mobileCarrierNameList(response) {
	if (response.error == null) {
		mobileCarrierNames = response.resultObject;
	}

}
function listOfStates(response) {
	if (response.error == null) {
		stateLists = response.resultObject;
	}
}
function entryPointAgentViewChangeNav(viewName) {

	paintMyLoansView();
	changeAgentSecondaryLeftPanel('lp-step' + viewName);
}


$(window).scroll(
		function() {
			var dashboard=$("#leads-container");
			if (dashboard&&dashboard.length>0&&(currentLoanType == "myloans" || currentLoanType == "myLeads")&&!newfiObject.fetchLock) {
				if (($(document).height()-($(window).scrollTop()+$(window).height()))<=400) {
					getMoreCustomers();
				}
			}

		});

$(document).on('click', '.delCustClas', function(e) {
	e.stopImmediatePropagation();
	//NEXNF-701
	if($('#cust-detail-wrapper').css('display')=="block"){
		$('#cust-detail-wrapper').hide();
	}
	var element=e.target;
	//NEXNF-715
	if($('.overlay-popup-wrapper').css("display")=="block"){
		$('.overlay-popup-wrapper').hide();				
		var parent=$(currentElement).parent();
		$(parent).removeClass('leads-container-tr-sel');
		currentElement="";
	}
	currentElement=$(element);	
	currentSelectedUserFlag=1;
	var loanId=$(element).attr("loanId");
	var customer_name=$(element).attr("customer_name");
	var parentComponent=$(element).parent();
	var parentElemet=$(this).parent();
	$(parentElemet).addClass('leads-container-tr-sel');
	$('#overlay-confirm').off();
	$('#overlay-cancel').off();
	$('.overlay-popup-wrapper').addClass('overlay-popup-wrapper-adj');
	$('#overlay-popup-txt').addClass('overlay-popup-txt-adj');
	$('#overlay-popup-txt').html("Are you sure you want to delete loan- "+customer_name+"?");
	
	$('#overlay-confirm').on('click', function() {
		if(loanId){
			ajaxRequest("rest/loan/"+loanId, "DELETE", "json", {}, function(response) {
		        if (response.error) {
		            showToastMessage(response.error.message)
		        } else {
		            if(response.resultObject=="Success"){
		            	$(parentComponent).remove();
		            }
		        }
		    });
			$('#overlay-popup').hide();
			$('#overlay-confirm').on('click', function() {});			
		}
	});

	$('#overlay-cancel').on('click', function() {
		$('#overlay-popup').hide();
		$(parentElemet).removeClass('leads-container-tr-sel');
		$('#overlay-confirm').on('click', function() {});
	});

	$('#overlay-popup').show();
	e.stopImmediatePropagation();
});

//Sort Loan Advisor
$('body').on('click','.leads-container-th .leads-container-tc1.sm-leads-container-tc1', function(){
	var isAsc;
	if($(this).hasClass('sort-list-asc')){
		$(this).removeClass('sort-list-asc');
		$(this).addClass('sort-list-dsc');
		isAsc = 1;
	}else if($(this).hasClass('sort-list-dsc')){
		$(this).removeClass('sort-list-dsc');
		$(this).addClass('sort-list-asc');
		isAsc = -1;
	}
    sortTableByLastName(isAsc);
});

// Sort Loan Advisor
$('body').on('click','.leads-container-th .leads-container-tc4', function(){
	var isAsc;
	if($(this).hasClass('loan-advisor-sort-list-asc')){
		$(this).removeClass('loan-advisor-sort-list-asc');
		$(this).addClass('loan-advisor-sort-list-dsc');
		isAsc = 1;
	}else if($(this).hasClass('loan-advisor-sort-list-dsc')){
		$(this).removeClass('loan-advisor-sort-list-dsc');
		$(this).addClass('loan-advisor-sort-list-asc');
		isAsc = -1;
	}
    sortTable(isAsc, ".leads-container-tc4");
});

//Sort Loan Status
$('body').on('click','.leads-container-th .leads-container-tc2.sm-leads-container-tc2', function(){
	var isAsc;
	if($(this).hasClass('loan-status-sort-list-asc')){
		$(this).removeClass('loan-status-sort-list-asc');
		$(this).addClass('loan-status-sort-list-dsc');
		isAsc = 1;
	}else if($(this).hasClass('loan-status-sort-list-dsc')){
		$(this).removeClass('loan-status-sort-list-dsc');
		$(this).addClass('loan-status-sort-list-asc');
		isAsc = -1;
	}
    sortTable(isAsc, ".leads-container-tc2");
});

//  Sort on Opened Colummn
$('body').on('click','.leads-container-tc5.sm-leads-container-tc5',function(){
	
	var isAsc ;
	if($(this).hasClass('opened-sort-list-asc')){
		$(this).removeClass('opened-sort-list-asc');
		$(this).addClass('opened-sort-list-dsc');
		isAsc = 1;
	}else if($(this).hasClass('opened-sort-list-dsc')){
		$(this).removeClass('opened-sort-list-dsc');
		$(this).addClass('opened-sort-list-asc');
		isAsc = -1;
	}
	
	sortTableByTime(isAsc, ".leads-container-tc5");
	
});

//  Sort on Last Action
$('body').on('click','.leads-container-tc6.sm-leads-container-tc6',function(){
	
	var isAsc ;
	
	if($(this).hasClass('last-action-sort-list-asc')){
		$(this).removeClass('last-action-sort-list-asc');
		$(this).addClass('last-action-sort-list-dsc');
		isAsc = 1;
		
	}else if($(this).hasClass('last-action-sort-list-dsc')){
		$(this).removeClass('last-action-sort-list-dsc');
		$(this).addClass('last-action-sort-list-asc');
		isAsc = -1;
	}
	
	sortTableByTime(isAsc, ".last-action-cell");
});


//Sort Leads By LastName First  Name
$('body').on('click','.leads-container-th .leads-col-1', function(){
	var isAsc;
	if($(this).hasClass('sort-list-asc')){
		$(this).removeClass('sort-list-asc');
		$(this).addClass('sort-list-dsc');
		isAsc = 1;
	}else if($(this).hasClass('sort-list-dsc')){
		$(this).removeClass('sort-list-dsc');
		$(this).addClass('sort-list-asc');
		isAsc = -1;
	}
    sortTableByLastName(isAsc);
});


//Sort Leads Status
$('body').on('click','.leads-container-th .leads-col-3', function(){
	var isAsc;
	if($(this).hasClass('loan-status-sort-list-asc')){
		$(this).removeClass('loan-status-sort-list-asc');
		$(this).addClass('loan-status-sort-list-dsc');
		isAsc = 1;
	}else if($(this).hasClass('loan-status-sort-list-dsc')){
		$(this).removeClass('loan-status-sort-list-dsc');
		$(this).addClass('loan-status-sort-list-asc');
		isAsc = -1;
	}
    sortTable(isAsc, ".leads-col-3");
});


//Sort Leads Emails
$('body').on('click','.leads-container-th .leads-col-2', function(){
	var isAsc;
	if($(this).hasClass('sort-up-arrow-45')){
		$(this).removeClass('sort-up-arrow-45');
		$(this).addClass('sort-down-arrow-45');
		isAsc = 1;
	}else if($(this).hasClass('sort-down-arrow-45')){
		$(this).removeClass('sort-down-arrow-45');
		$(this).addClass('sort-up-arrow-45');
		isAsc = -1;
	}
    sortTable(isAsc, ".leads-col-2");
});


//Sort Loan Advisor
$('body').on('click','.leads-container-th .leads-col-processor', function(){
	var isAsc;
	if($(this).hasClass('loan-advisor-sort-list-asc')){
		$(this).removeClass('loan-advisor-sort-list-asc');
		$(this).addClass('loan-advisor-sort-list-dsc');
		isAsc = 1;
	}else if($(this).hasClass('loan-advisor-sort-list-dsc')){
		$(this).removeClass('loan-advisor-sort-list-dsc');
		$(this).addClass('loan-advisor-sort-list-asc');
		isAsc = -1;
	}
    sortTable(isAsc, ".leads-row-processor");
});

/**
 * Method to sort based on time type columns.
 * @param isAsc
 * @param selector
 */
function sortTableByTime(isAsc,selector){
	
	$('#leads-container').find('.leads-container-tr').removeClass("leads-container-row-odd");
	var rows = $('#leads-container').find('.leads-container-tr').get();
	
	rows.sort(function(a, b) {
		try {
		   var time1 = $(a).children(selector).text().trim();
		   var time2 = $(b).children(selector).text().trim();
           time1  = time1.replace(/-/g, "/");
           time2  = time2.replace(/-/g, "/");
           
           var timestamp1 = new Date(time1).getTime();
           timestamp1 = isNaN(timestamp1 ) ? 0 : timestamp1;
           
           var timestamp2 = new Date(time2).getTime();
           timestamp2 = isNaN(timestamp2) ? 0 : timestamp2;
           
           return isAsc * (timestamp1 - timestamp2); 
       } catch(ex)  {
           console.log("Error while parsing date sortTableByTime," + ex);
           return 0;
		}
	});

	$.each(rows, function(index, row) {
		if( index % 2 == 0){
			$(row).addClass("leads-container-row-odd");
		} 
		console.log(row);
		$('#leads-container').append(row);
	});
}



/**
 * Method to sort rows based on certain column.
 * @param isAsc
 * @param selector
 */
function sortTable(isAsc, selector) {
	
	$('#leads-container').find('.leads-container-tr').removeClass("leads-container-row-odd");
	
	var rows = $('#leads-container').find('.leads-container-tr').get();
	
	rows.sort(function(a, b) {

		var A = $(a).children(selector).text().toLowerCase().trim();
		var B = $(b).children(selector).text().toLowerCase().trim();
		return (A == B ? 0 : A > B ? -1  * isAsc : isAsc );
	});

	$.each(rows, function(index, row) {
		if( index % 2 == 0){
			$(row).addClass("leads-container-row-odd");
		} 
		$('#leads-container').append(row);
	});
}

/**
 * Method to sort rows based on certain column.
 * @param isAsc
 */
function sortTableByLastName(isAsc) {
	
	$('#leads-container').find('.leads-container-tr').removeClass("leads-container-row-odd");
	var rows = $('#leads-container').find('.leads-container-tr').get();
	
	rows.sort(function(a, b) {
		var name1 = $(a).children(".leads-container-tc1").text().toLowerCase().trim();
		var name2 = $(b).children(".leads-container-tc1").text().toLowerCase().trim();
		name1  = reverseWordsInString(name1);
		name2 = reverseWordsInString(name2);
		return (name1 == name2 ? 0 : name1 > name2 ? -1  * isAsc : isAsc );
	});
	
	$.each(rows, function(index, row) {
		if( index % 2 == 0){
			$(row).addClass("leads-container-row-odd");
		} 
		$('#leads-container').append(row);
	});
}
