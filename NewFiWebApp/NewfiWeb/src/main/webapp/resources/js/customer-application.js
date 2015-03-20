var appUserDetails = new Object();

var flag = 0;
var applicationItemsList = [ {
							    "text":"Home Information",
	                            "onselect" : paintCustomerApplicationPageStep1a
	                        },
	                        {
								"text":"Who's on the Loan?",
		                        "onselect" : paintCustomerApplicationPageStep2
		                    },
	                        {
								"text":"My Income",
		                        "onselect" : paintRefinanceMyIncome
		                    },
			                {
							    "text":"Government Questions",
				                 "onselect" : paintCustomerApplicationPageStep4a
				             },
				             {
				            	 "text":"My Credit",
					             "onselect" : paintCustomerApplicationPageStep5
					        },
];

function applicationStatusLeftPanel() {
	var container = $('<div>').attr({
		"class" : "ce-lp float-left"
	});

	for (var i = 0; i < applicationItemsList.length; i++) {
		var itemCompletionStage = "NOT_STARTED";

		var itemCont = applicationStatusPanelItem(applicationItemsList[i], i + 1,itemCompletionStage);
		container.append(itemCont);
	}

	return container;
}

function applicationStatusPanelItem(itemTxt, stepNo, itemCompletionStage) {
	var itemCont = $('<div>').attr({
		"class" : "ce-lp-item clearfix",
		"data-step" : stepNo,
		"id" : "appProgressBaarId_" + stepNo
	}).bind('click',{"option":itemTxt.onselect},function(event){
		
		event.data.option();
	});;

	var leftIcon = $('<div>').attr({
		"class" : "ce-lp-item-icon float-left",
		"id" : "appStepNoId_" + stepNo
	});

	itemCont.addClass('ce-lp-not-started');
	leftIcon.html(stepNo);

	var textCont = $('<div>').attr({
		"class" : "ce-app-lp-item-text float-left"
	}).html(itemTxt.text);

	return itemCont.append(leftIcon).append(textCont);
}


function paintCustomerApplicationPage() {
    
	
	var topHeader = getCompletYourApplicationHeader();

    var container = $('<div>').attr({
        "class": "clearfix"
    });

    var applicationLeftPanel = $('<div>').attr({
        "class": "cust-app-lp float-left"
    });

    var leftPanel = applicationStatusLeftPanel();
    
    applicationLeftPanel.append(leftPanel);
    
    var applicationRightPanel = $('<div>').attr({
        "id": "app-right-panel",
        "class": "cust-app-rp float-left"
    });

    container.append(applicationLeftPanel).append(applicationRightPanel);
    
    

    $('#center-panel-cont').append(topHeader).append(container);

    paintCustomerApplicationPageStep1a();
}


function getQuestionsContainer(questions,target) {
    var questionsContainer = $('<div>').attr({
        "class": "app-ques-container"
    });
    if(target){
    	target.parent().data("subContainer",questionsContainer);
    }
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
        var quesCont = getApplicationQuestion(question);
        questionsContainer.append(quesCont);
    }
    return questionsContainer;
}

function getApplicationQuestion(question) {
    var quesCont;
    if (question.type == "mcq") {
        quesCont = getApplicationMultipleChoiceQues(question);
    } else if (question.type == "desc") {
        quesCont = getApplicationTextQues(question);
    } else if (question.type == "select") {
        quesCont = getApplicationSelectQues(question);
    } else if (question.type == "yesno") {
        quesCont = getApplicationYesNoQues(question);
    }
    return quesCont;
}

function getApplicationSelectQues(question) {
    var container = $('<div>').attr({
        "class": "app-ques-wrapper"
    });

    var quesTextCont = $('<div>').attr({
        "class": "app-ques-text"
    }).html(question.text);

    var optionsContainer = $('<div>').attr({
        "class": "app-options-cont",
        "name": question.name
    });

    var selectedOption = $('<div>').attr({
        "class": "app-option-selected"
    }).html("Select One").on('click', function() {
        $(this).parent().find('.app-dropdown-cont').toggle();
    });

    var dropDownContainer = $('<div>').attr({
        "class": "app-dropdown-cont hide"
    });

    for (var i = 0; i < question.options.length; i++) {
        var option = question.options[i];
        var optionCont = $('<div>').attr({
                "class": "app-option-sel"
            }).data({
                "value": option.value
            }).html(option.text)
            .on(
                'click',
                function() {
                    $(this).closest('.app-options-cont').find(
                        '.app-option-selected').html($(this).html());
                    $(this).closest('.app-options-cont').find(
                    '.app-option-selected').data("value",$(this).data("value"));
                    $(this).closest('.app-dropdown-cont').toggle();
                });
        dropDownContainer.append(optionCont);
    }

    optionsContainer.append(selectedOption).append(dropDownContainer);

    return container.append(quesTextCont).append(optionsContainer);
}

function getApplicationTextQues(question) {
    var container = $('<div>').attr({
        "class": "app-ques-wrapper"
    });

    var quesTextCont = $('<div>').attr({
        "class": "app-ques-text"
    }).html(question.text);

    var optionsContainer = $('<div>').attr({
        "class": "app-options-cont"
    });

    var optionCont = $('<input>').attr({
        "class": "app-input",
        "name": question.name
    });

    if (question.value != undefined) {
        optionCont.val(question.value);
    }

    optionsContainer.append(optionCont);

    return container.append(quesTextCont).append(optionsContainer);
}

function getApplicationMultipleChoiceQues(question) {
    var container = $('<div>').attr({
        "class": "app-ques-wrapper"
    });

    var quesTextCont = $('<div>').attr({
        "class": "app-ques-text"
    }).html(question.text);

    var optionsContainer = $('<div>').attr({
        "class": "app-options-cont",
        "name": question.name
    });

    for (var i = 0; i < question.options.length; i++) {
        var option = question.options[i];
        var optionCont = $('<div>').attr({
            "class": "app-option"
        }).data({
            value: option.value
        }).html(option.text)
        .on('click',function(){
        	if($(this).hasClass('app-option-checked')){
        		$(this).removeClass('app-option-checked');
        	}else{
	        	$(this).parent().find('.app-option').removeClass('app-option-checked');
	        	$(this).addClass('app-option-checked');
        	}
        });
        optionsContainer.append(optionCont);
    }

    return container.append(quesTextCont).append(optionsContainer);
}

function getApplicationYesNoQues(question) {
    var container = $('<div>').attr({
        "class": "app-ques-wrapper"
    });

    var quesTextCont = $('<div>').attr({
        "class": "app-ques-text"
    }).html(question.text);

    var optionsContainer = $('<div>').attr({
        "class": "app-options-cont",
        "name": question.name
    });

    for (var i = 0; i < question.options.length; i++) {
        var option = question.options[i];
        var optionCont = $('<div>').attr({
            "class": "app-option-choice",
            "isSelected" : "false"
        }).data({
            value: option.value
        }).html(option.text)
        .on('click',function(){
        	$(this).parent().find('.app-option-choice').attr("isSelected","false");
        	$(this).attr("isSelected","true");
        });

        //TODO-add questions on select of option
        //if (option.addQuestions != undefined && option.addQuestions.length > 0) {
        	optionCont.data("addQuestions",option.addQuestions).on('click',function(event){
        		if($(event.target).parent().data("subContainer")){
        			var subContainer=$(event.target).parent().data("subContainer");
        			subContainer.remove();
        		}
	        	if($(event.target).data("addQuestions")){	
	        	container.append(getQuestionsContainer($(event.target).data("addQuestions"),$(event.target)));
	        	}        	
        	});
            //var subQues = getApplicationQuestion(option.sub_question);
       // }

        optionsContainer.append(optionCont);
    }

    return container.append(quesTextCont).append(optionsContainer);
}



function paintCustomerApplicationPageStep1a() {
    
	appProgressBaar(1);
	$('#app-right-panel').html('');
    var quesHeaderTxt = "Address";

    var quesHeaderTextCont = $('<div>').attr({
        "class": "app-ques-header-txt"
    }).html(quesHeaderTxt);

    var questions = [/*{
        type: "desc",
        text: "Street Address",
        name: "streetAddress",
        value: ""
    }, */{
        type: "desc",
        text: "State",
        name: "state",
        value: ""
    }, {
        type: "desc",
        text: "City",
        name: "city",
        value: ""
    }, {
        type: "desc",
        text: "Zip Code",
        name: "zipCode",
        value: ""
    }];

    var questionsContainer = getQuestionsContainer(questions);

    var saveAndContinueButton = $('<div>').attr({
        "class": "app-save-btn"
    }).html("Save & continue").on('click', function() {
    	
    	appUserDetails["state"] = $('input[name="state"]').val();
    	appUserDetails["city"] = $('input[name="city"]').val();
    	appUserDetails["zipCode"] = $('input[name="zipCode"]').val();
        paintCustomerApplicationPageStep1b();
    });

    $('#app-right-panel').append(quesHeaderTextCont).append(questionsContainer)
        .append(saveAndContinueButton);
}

function paintCustomerApplicationPageStep1b() {
    $('#app-right-panel').html('');
    var quesHeaderTxt = "Home Details";

    var quesHeaderTextCont = $('<div>').attr({
        "class": "app-ques-header-txt"
    }).html(quesHeaderTxt);

    var questions = [{
        type: "select",
        text: "What type of property is this?",
        name: "propertyType",
        options: [{
            text: "Single Family Residence",
            value: "Single Family Residence"
        }, {
            text: "Condo",
            value: "Condo"
        }, {
            text: "Multi-Unit",
            value: "Multi-Unit"
        }, {
            text: "Mobile/Manufactured",
            value: "Mobile/Manufactured"
        }],
        selected: ""
    }, {
        type: "select",
        text: "How do you use this home?",
        name: "residenceType",
        options: [{
            text: "Primary Residence",
            value: "Primary Residence"
        }, {
            text: "Vacation Home",
            value: "Vacation Home"
        }, {
            text: "Investment Property",
            value: "Investment Property"
        }],
        selected: ""
    }, {
        type: "desc",
        text: "How much is paid in property taxes every year?",
        name: "taxesPaid",
        value: ""
    }, {
        type: "desc",
        text: "Who provides homeowners insurance?",
        name: "insuranceProvider",
        value: ""
    }, {
        type: "desc",
        text: "How much does homeowners insurance cost per year?",
        name: "insuranceCost",
        value: ""
    }, {
        type: "desc",
        text: "When did you purchase this property?",
        name: "purchaseTime",
        value: ""
    }];

    var questionsContainer = getQuestionsContainer(questions);

    var saveAndContinueButton = $('<div>').attr({
        "class": "app-save-btn"
    }).html("Save & continue").on('click', function() {
    	
    	appUserDetails["propertyType"] = $('.app-options-cont[name="propertyType"]').find('.app-option-selected').data().value;
    	appUserDetails["residenceType"] = $('.app-options-cont[name="residenceType"]').find('.app-option-selected').data().value;
    	appUserDetails["taxesPaid"] = $('input[name="taxesPaid"]').val();
    	appUserDetails["insuranceProvider"] = $('input[name="insuranceProvider"]').val();
    	appUserDetails["insuranceCost"] = $('input[name="insuranceCost"]').val();
    	appUserDetails["purchaseTime"] = $('input[name="purchaseTime"]').val();
    	
        paintCustomerApplicationPageStep2();
    });

    $('#app-right-panel').append(quesHeaderTextCont).append(questionsContainer)
        .append(saveAndContinueButton);
   
    putCurrencyFormat("taxesPaid");
    putCurrencyFormat("insuranceCost");
    
    
}

function paintCustomerApplicationPageStep2() {
	appProgressBaar(2);
	$('#app-right-panel').html('');
    var quesHeaderTxt = "Who's on the Loan?";

    var quesHeaderTextCont = $('<div>').attr({
        "class": "app-ques-header-txt"
    }).html(quesHeaderTxt);
    //TODO-try nested yesno question
    var questions = [{
        type: "yesno",
        text: "Are you married?",
        name: "isMarried",
        options: [{
            text: "Yes",
            addQuestions:[{
                type: "yesno",
                text: "Is your spouse on the loan?",
                name: "isSouseOnLoan",
                options: [{
                    text: "Yes",
                    addQuestions:[{
                        type: "text",
                        text: "What is your spouse name ?",
                        name: "spouseName"
                    }]
                }, {
                    text: "No"
                }],
                selected: ""
            }]
        }, {
            text: "No"
        }],
        selected: ""
    }];

    var questionsContainer = getQuestionsContainer(questions);
    //var spouseInLoan = paintSpouseInLoan();
    var saveAndContinueButton = $('<div>').attr({
        "class": "app-save-btn"
    }).html("Save & continue").on('click', function() {
        
    	appUserDetails["isMarried"] =  $('.app-options-cont[name="isMarried"]').find('.app-option-choice[isselected="true"]').html();

    	//paintCustomerApplicationPageStep3();
    	paintRefinanceMyIncome();

    });

    $('#app-right-panel').append(quesHeaderTextCont).append(questionsContainer).append(saveAndContinueButton);
}


function paintRefinanceMyIncome() {

	appProgressBaar(3);
	var quesTxt = "Select all that apply";
	var options = [ {
		"text" : "Employed",
		"onselect" : paintRefinanceEmployed,
		"name" : name,
		"value" : 0
	}, {
		"text" : "Self-employed",
		"onselect" : paintRefinanceSelfEmployed,
		"name" : name,
		"value" : 1
	}, {
		"text" : "Social Security Income/Disability",
		"onselect" : paintRefinanceDisability,
		"name" : name,
		"value" : 2
	}, {
		"text" : "Pension/Retirement/401(k)",
		"onselect" : paintRefinancePension,
		"name" : name,
		"value" : 3
	} ];
	var quesCont = paintCustomerApplicationPageStep3(quesTxt, options, name);

	$('#app-right-panel').html(quesCont);

}

function paintRefinanceEmployed(divId) {

	var quesTxt = "About how much do you make a year";
	var quesCont = getMultiTextQuestion(quesTxt);
	$('#ce-option_' + divId).toggle();
	$('#ce-option_' + divId).html(quesCont);
}

function getMultiTextQuestion(quesText) {
	var container = $('<div>').attr({
		"class" : "ce-ques-wrapper",
	});

	var quesTextCont = $('<div>').attr({
		"class" : "ce-option-text",
	}).html(quesText);

	var optionContainer = $('<div>').attr({
		"class" : "ce-options-cont",
	});

	var quesTextCont1 = $('<div>').attr({
		"class" : "ce-rp-ques-text",
	}).html("Before Tax");

	var inputBox1 = $('<input>').attr({
		"class" : "ce-input",
		"name" : "beforeTax",
	});

	quesTextCont1.append(inputBox1);

	var quesTextCont2 = $('<div>').attr({
		"class" : "ce-rp-ques-text"
	}).html("Where Do You Work ?");

	var inputBox2 = $('<input>').attr({
		"class" : "ce-input",
		"name" : "workPlace"
	});

	quesTextCont2.append(inputBox2);

	var quesTextCont3 = $('<div>').attr({
		"class" : "ce-rp-ques-text"
	}).html("When Did You Start Wokring ?");

	var inputBox3 = $('<input>').attr({
		"class" : "ce-input",
		"name" : "startWorking"
	});

	quesTextCont3.append(inputBox3);

	optionContainer.append(quesTextCont1).append(quesTextCont2).append(
			quesTextCont3);

	return container.append(quesTextCont).append(optionContainer);
}

function paintRefinanceSelfEmployed(divId) {

	var quesTxt = "How much do you make a year?";

	var container = $('<div>').attr({
		"class" : "ce-ques-wrapper"
	});

	var quesTextCont = $('<div>').attr({
		"class" : "ce-option-text"
	}).html(quesTxt);

	var optionContainer = $('<div>').attr({
		"class" : "ce-options-cont"
	});

	var inputBox = $('<input>').attr({
		"class" : "ce-input",
		"name" : "selfEmployed"
	});

	optionContainer.append(inputBox);
	container.append(quesTextCont).append(optionContainer);

	$('#ce-option_' + divId).toggle();
	$('#ce-option_' + divId).html(container);
}

function paintRefinanceDisability(divId) {

	var quesTxt = "About how much do you get monthly?";

	var container = $('<div>').attr({
		"class" : "ce-ques-wrapper"
	});

	var quesTextCont = $('<div>').attr({
		"class" : "ce-option-text"
	}).html(quesTxt);

	var optionContainer = $('<div>').attr({
		"class" : "ce-options-cont"
	});

	var inputBox = $('<input>').attr({
		"class" : "ce-input",
		"name" : "disability"
	});

	optionContainer.append(inputBox);
	container.append(quesTextCont).append(optionContainer);

	$('#ce-option_' + divId).toggle();
	$('#ce-option_' + divId).html(container);
}

function paintRefinancePension(divId) {

	var quesTxt = "About how much do you get monthly?";

	var container = $('<div>').attr({
		"class" : "ce-ques-wrapper"
	});

	var quesTextCont = $('<div>').attr({
		"class" : "ce-option-text"
	}).html(quesTxt);

	var optionContainer = $('<div>').attr({
		"class" : "ce-options-cont"
	});

	var inputBox = $('<input>').attr({
		"class" : "ce-input",
		"name" : "pension"
	});

	optionContainer.append(inputBox);
	container.append(quesTextCont).append(optionContainer);

	$('#ce-option_' + divId).toggle();
	$('#ce-option_' + divId).html(container);
}

function paintSpouseInLoan(){
	
	
	    var questions = [{
	        type: "yesno",
	        text: "Is your spouse going to be on the loan?",
	        name: "spouseInLoan",
	        options: [{
	            text: "Yes",
	        }, {
	            text: "No"
	        }],
	        selected: ""
	    }];

	    var questionsContainer = getQuestionsContainer(questions);
        return questionsContainer;
}

function getAppDetialsTextQuestion(quesText, clickEvent, name) {
	var container = $('<div>').attr({
		"class" : "ce-ques-wrapper"
	});

	var quesTextCont = $('<div>').attr({
		"class" : "ce-rp-ques-text"
	}).html(quesText);

	var optionContainer = $('<div>').attr({
		"class" : "ce-options-cont"
	});

	var inputBox = $('<input>').attr({
		"class" : "ce-input",
		"name" : name
	});

	optionContainer.append(inputBox);

	var saveBtn = $('<div>').attr({
		"class" : "ce-save-btn"
	}).html("Save & Continue").bind('click', {
		'clickEvent' : clickEvent,
		"name" : name
	}, function(event) {
		var key = event.data.name;
		appUserDetails[key] = $('input[name="' + key + '"]').val();
		event.data.clickEvent();
	});

	return container.append(quesTextCont).append(optionContainer).append(saveBtn);
}

/*function paintCustomerApplicationPageStep3() {
    $('#app-right-panel').html('');
    var quesHeaderTxt = "My Income";

    var quesHeaderTextCont = $('<div>').attr({
        "class": "app-ques-header-txt"
    }).html(quesHeaderTxt);

    var questions = [{
        type: "mcq",
        text: "Select all that apply",
        name: "purchaseTime",
        options: [{
            text: "Employee",
            value: "Employee",
            sub_questions: [{
                type: "desc",
                text: "About home much do you make a year before taxes?",
                name: "",
                value: ""
            }, {
                type: "desc",
                text: "Where do you work?",
                name: "",
                value: ""
            }, {
                type: "desc",
                text: "When did your start working there?",
                name: "",
                value: ""
            }]
        }, {
            text: "Self-employed",
            value: "Self-employed",
            sub_questions: [{
                type: "desc",
                text: "How much do you make a year?",
                name: "",
                value: ""
            }]
        }, {
            text: "Social Security/ Income Disability",
            value: "Social Security/ Income Disability",
            sub_questions: [{
                type: "desc",
                text: "About how much do you get monthly?",
                name: "",
                value: ""
            }]
        }, {
            text: "Pension/Re/rement/401(k)",
            value: "Pension/Re/rement/401(k)",
            sub_questions: [{
                type: "desc",
                text: "About how much do you get monthly?",
                name: "",
                value: ""
            }]
        }],
        selected: ""
    }];

    var questionsContainer = getQuestionsContainer(questions);

    var saveAndContinueButton = $('<div>').attr({
        "class": "app-save-btn"
    }).html("Save & continue").on('click', function() {
        paintCustomerApplicationPageStep4a();
    });

    $('#app-right-panel').append(quesHeaderTextCont).append(questionsContainer)
        .append(saveAndContinueButton);
}*/


function paintCustomerApplicationPageStep3(quesText, options, name) {
	var container = $('<div>').attr({
		"class" : "ce-ques-wrapper"
	});

	var quesTextCont = $('<div>').attr({
		"class" : "ce-rp-ques-text"
	}).html(quesText);

	var optionContainer = $('<div>').attr({
		"class" : "ce-options-cont"
	});

	for (var i = 0; i < options.length; i++) {

		var optionIncome = $('<div>').attr({
			"class" : "hide ce-option-ques-wrapper",
			"id" : "ce-option_" + i
		});

		var option = $('<div>').attr({
			"class" : "ce-option-checkbox",
			"value" : options[i].value
		}).html(options[i].text).bind('click', {
			"option" : options[i],
			"name" : name
		}, function(event) {
			$('.ce-option-checkbox').removeClass("ce-option-checked");
			$(this).addClass("ce-option-checked");
			var key = event.data.name;
			appUserDetails[key] = event.data.option.value;
			event.data.option.onselect(event.data.option.value);
		});

		optionContainer.append(option).append(optionIncome);
	}

	var saveBtn = $('<div>').attr({
		"class" : "ce-save-btn"
	}).html("Save & Continue").bind('click',function() {
				appUserDetails["beforeTax"] = $('input[name="beforeTax"]')
						.val();
				appUserDetails["workPlace"] = $('input[name="workPlace"]')
						.val();
				appUserDetails["startWorking"] = $(
						'input[name="startWorking"]').val();
				appUserDetails["selfEmployed"] = $(
						'input[name="selfEmployed"]').val();
				appUserDetails["disability"] = $(
						'input[name="disability"]').val();
				appUserDetails["pension"] = $('input[name="pension"]')
						.val();

				sessionStorage.refinaceData = JSON.stringify(appUserDetails);
				paintCustomerApplicationPageStep4a();
			});

	return container.append(quesTextCont).append(optionContainer).append(
			saveBtn);
}




function paintCustomerApplicationPageStep4a() {
   
	appProgressBaar(4);
	$('#app-right-panel').html('');
    var quesHeaderTxt = "Declaration Questions";

    var quesHeaderTextCont = $('<div>').attr({
        "class": "app-ques-header-txt"
    }).html(quesHeaderTxt);

    var questions = [{
        type: "yesno",
        text: "Are there any outstanding judgments against you?",
        name: "isOutstandingJudgments",
        options: [{
            text: "Yes",
            value: "yes"
        }, {
            text: "No",
            value: "no"
        }],
        selected: ""
    }, {
        type: "yesno",
        text: "Have you been declared bankrupt within the past 7 years?",
        name: "isBankrupt",
        options: [{
            text: "Yes",
            value: "yes"
        }, {
            text: "No",
            value: "no"
        }],
        selected: ""
    }, {
        type: "yesno",
        text: "Have you had property foreclosed upon or given title or deed in lieu thereof in the last 7 years?",
        name: "isPropertyForeclosed",
        options: [{
            text: "Yes",
            value: "yes"
        }, {
            text: "No",
            value: "no"
        }],
        selected: ""
    }, {
        type: "yesno",
        text: "Are you a party to a lawsuit?",
        name: "isLawsuit",
        options: [{
            text: "Yes",
            value: "yes"
        }, {
            text: "No",
            value: "no"
        }],
        selected: ""
    }, {
        type: "yesno",
        text: "Have you directly or indirectly been obligated on any loan which resulted in foreclosure, transfer of title in lieu of foreclosure, or judgment?",
        name: "isObligatedLoan",
        options: [{
            text: "Yes",
            value: "yes"
        }, {
            text: "No",
            value: "no"
        }],
        selected: ""
    }, {
        type: "yesno",
        text: "Are you presently delinquent or in default on any Federal debt or any other loan, mortgage, financial obligation, bond or loan guarantee?",
        name: "isFederalDebt",
        options: [{
            text: "Yes",
            value: "yes"
        }, {
            text: "No",
            value: "no"
        }],
        selected: ""
    }, {
        type: "yesno",
        text: "Are you obligated to pay alimony, child support, or separate maintenance?",
        name: "isObligatedToPayAlimony",
        options: [{
            text: "Yes",
            value: "yes"
        }, {
            text: "No",
            value: "no"
        }],
        selected: ""
    }, {
        type: "yesno",
        text: "Is any part of the down payment borrowed?",
        name: "isDownPaymentBorrowed",
        options: [{
            text: "Yes",
            value: "yes"
        }, {
            text: "No",
            value: "no"
        }],
        selected: ""
    }, {
        type: "yesno",
        text: "Are you a co-maker or endorser on a note?",
        name: "isEndorser",
        options: [{
            text: "Yes",
            value: "yes"
        }, {
            text: "No",
            value: "no"
        }],
        selected: ""
    }, {
        type: "yesno",
        text: "Are you a US citizen?",
        name: "isUSCitizen",
        options: [{
            text: "Yes"
        }, {
            text: "No",
            sub_questions: [{
                type: "select",
                text: "Are you a permanent resident alien?",
                name: "isPermanentResidentAlien",
                options: [{
                    text: "Yes",
                    value: "yes"
                }, {
                    text: "No",
                    value: "no"
                }],
                "selected": ""
            }]
        }],
        selected: ""
    },
    {
        type: "yesno",
        text: "Do you intend to occupy the property as your primary residence?",
        name: "isOccupyPrimaryResidence",
        options: [{
            text: "Yes",
            value: "yes"
        }, {
            text: "No",
            value: "no"
        }],
        selected: ""
    },
    {
        type: "yesno",
        text: "Have you had an ownership interest in a property in the last three years?",
        name: "isOwnershipInterestInProperty",
        options: [{
            text: "Yes",
            sub_questions: [{
                type: "select",
                text: "What type of property did you own? Select the choice that fits best.",
                name: "",
                options: [{
                    text: "Your Primary Residence",
                    value: "Your Primary Residence"
                }, {
                    text: "A Second Home",
                    value: "A Second Home"
                },
                {
                    text: "An Investment Property",
                    value: "An Investment Property"
                }],
                "selected": ""
            },
            {
                type: "select",
                text: "What was your status on the title of that property",
                name: "",
                options: [{
                    text: "I was the sole title holder",
                    value: "I was the sole title holder"
                }, {
                    text: "I held the title jointly with my spouse",
                    value: "I held the title jointly with my spouse"
                },
                {
                    text: "I held title jointly with another person",
                    value: "I held title jointly with another person"
                }],
                "selected": ""
            }]
        }, {
            text: "No"
        }],
        selected: ""
    }
    ];

    var questionsContainer = getQuestionsContainer(questions);

    var saveAndContinueButton = $('<div>').attr({
        "class": "app-save-btn"
    }).html("Save & continue").on('click', function() {
    	
    	appUserDetails["isOutstandingJudgments"] =  $('.app-options-cont[name="isOutstandingJudgments"]').find('.app-option-choice[isselected="true"]').html();
    	appUserDetails["isBankrupt"] =  $('.app-options-cont[name="isBankrupt"]').find('.app-option-choice[isselected="true"]').html();
    	appUserDetails["isPropertyForeclosed"] =  $('.app-options-cont[name="isPropertyForeclosed"]').find('.app-option-choice[isselected="true"]').html();
    	appUserDetails["isLawsuit"] =  $('.app-options-cont[name="isLawsuit"]').find('.app-option-choice[isselected="true"]').html();
    	appUserDetails["isObligatedLoan"] =  $('.app-options-cont[name="isObligatedLoan"]').find('.app-option-choice[isselected="true"]').html();
    	appUserDetails["isFederalDebt"] =  $('.app-options-cont[name="isFederalDebt"]').find('.app-option-choice[isselected="true"]').html();
    	appUserDetails["isObligatedToPayAlimony"] =  $('.app-options-cont[name="isObligatedToPayAlimony"]').find('.app-option-choice[isselected="true"]').html();
    	appUserDetails["isEndorser"] =  $('.app-options-cont[name="isEndorser"]').find('.app-option-choice[isselected="true"]').html();
    	appUserDetails["isUSCitizen"] =  $('.app-options-cont[name="isUSCitizen"]').find('.app-option-choice[isselected="true"]').html();
    	appUserDetails["isOccupyPrimaryResidence"] =  $('.app-options-cont[name="isOccupyPrimaryResidence"]').find('.app-option-choice[isselected="true"]').html();
    	appUserDetails["isOwnershipInterestInProperty"] =  $('.app-options-cont[name="isOwnershipInterestInProperty"]').find('.app-option-choice[isselected="true"]').html();
    	
    	paintCustomerApplicationPageStep4b();
    });

    $('#app-right-panel').append(quesHeaderTextCont).append(questionsContainer)
        .append(saveAndContinueButton);
}

function paintCustomerApplicationPageStep4b(){
	
	
	$('#app-right-panel').html('');
    var quesHeaderTxt = "Government Monitoring Questions";

    var quesHeaderTextCont = $('<div>').attr({
        "class": "app-ques-header-txt"
    }).html(quesHeaderTxt);

    var questions = [{
        type: "select",
        text: "Ethnicity",
        name: "ethnicity",
        options: [{
            text: "Hispanic",
            value: "hispanic"
        }, {
            text: "Non Hispanic or Latino",
            value: "latino"
        }],
        selected: ""
    }, {
        type: "select",
        text: "Race",
        name: "race",
        options: [{
            text: "American Indian or Alaska Native",
            value: "americanIndian"
        }, {
            text: "Native Hawaiian or Pacific Islander",
            value: "nativeHawaiian "
        }, {
            text: "Black or African American",
            value: "black"
        },
        {
            text: "White",
            value: "white"
        },
        {
            text: "Asian",
            value: "asian"
        }],
        selected: ""
    }, {
        type: "select",
        text: "Sex",
        name: "sex",
        options: [{
            text: "Male",
            value: "male"
        }, {
            text: "Female",
            value: "female "
        }],
      selected: ""
    }];

	
	 var questionsContainer = getQuestionsContainer(questions);
	
	 var saveAndContinueButton = $('<div>').attr({
	        "class": "app-save-btn"
	    }).html("Save & continue").on('click', function() {
	    	
	    	appUserDetails["ethnicity"] =  $('.app-options-cont[name="ethnicity"]').find('.app-option-selected').data().value;
	    	appUserDetails["race"] =  $('.app-options-cont[name="race"]').find('.app-option-selected').data().value;
	    	appUserDetails["sex"] =  $('.app-options-cont[name="sex"]').find('.app-option-selected').data().value;
	    	
	    	
	    	paintCustomerApplicationPageStep5();
	    });

	    $('#app-right-panel').append(quesHeaderTextCont).append(questionsContainer).append(saveAndContinueButton);
	
}

function paintCustomerApplicationPageStep5() {
    
	appProgressBaar(5);
	$('#app-right-panel').html('');
    var quesHeaderTxt = "My Income";

    var quesHeaderTextCont = $('<div>').attr({
        "class": "app-ques-header-txt"
    }).html(quesHeaderTxt);

    var questions = [{
        type: "desc",
        text: "Birthday",
        name: "birthday",
        value: ""
    },
    {
        type: "desc",
        text: "Social Security Number",
        name: "ssn",
        value: ""
    },
    {
        type: "desc",
        text: "Phone Number",
        name: "phoneNumber",
        value: ""
    }];

    var questionsContainer = getQuestionsContainer(questions);

    var saveAndContinueButton = $('<div>').attr({
        "class": "app-save-btn"
    }).html("Save & continue").on('click', function() {
    	appUserDetails["birthday"] = $('input[name="birthday"]').val();
    	appUserDetails["ssn"] =  $('input[name="ssn"]').val();
    	appUserDetails["phoneNumber"] =  $('input[name="phoneNumber"]').val();
    	
    	applicationFormSumbit();
    });

    $('#app-right-panel').append(quesHeaderTextCont).append(questionsContainer)
        .append(saveAndContinueButton);
}

function applicationFormSumbit(){
	
	alert(JSON.stringify(appUserDetails));
}


function appProgressBaar(num){
	
	var count = 5;
	$("#appProgressBaarId_" + num).removeClass('ce-lp-in-progress')
			.removeClass('ce-lp-complete').addClass('ce-lp-in-progress');
	$('#appStepNoId_' + num).html(num);

	for (var i = 1; i <= num - 1; i++) {
		$("#appProgressBaarId_" + i).removeClass('ce-lp-in-progress')
				.removeClass('ce-lp-not-started').addClass('ce-lp-complete');
		$('#appStepNoId_' + i).html("");
	}
	for (var i = num + 1; i <= count; i++) {
		$("#appProgressBaarId_" + i).removeClass('ce-lp-in-progress')
				.removeClass('ce-lp-complete').addClass('ce-lp-not-started');
		$('#appStepNoId_' + i).html(i);
	}
	
}

function putCurrencyFormat(name){
	
	$("input[name="+name+"]").keydown(function() {
    	$("input[name="+name+"]").maskMoney({
			thousands:',',
			decimal:'.',
			allowZero:true,
			prefix: '$',
		    precision:0,
		    allowNegative:true
		});		
    });
}