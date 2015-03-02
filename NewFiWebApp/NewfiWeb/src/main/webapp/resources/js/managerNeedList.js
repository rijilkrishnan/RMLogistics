function getLoanNeedsManagerContext(loanId){
	
	var loanNeedsListContext={
		loanId:loanId,
		needsList:[],
		selectedNeeds:[],
		customList:{},
		needLookup:{},
		getCustomNeedList:function(callback){
			var ob=this;
			var data={};
			ob.customList={};
			ajaxRequest("rest/loanneeds/custom","GET","json",data,function(response){
				if(response.error){

				}else{
					var customList=response.resultObject;
					for(var i=0;i<customList.length;i++){
						ob.addCustomNeedToList(customList[i]);
					}
					if(callback){
						callback(ob);
					}
				}
				
			});
		},
		addCustomNeedToList:function(need){
			var ob=this;
			var category=need.needCategory;
			switch(category){
				case "Credit/Liabilities":
					if(!ob.customList.liability){
						ob.customList.liability=[];
					}
					ob.customList.liability.push(need);
				    break;
			    case "Property":
			    	if(!ob.customList.property){
						ob.customList.property=[];
					}
					ob.customList.property.push(need);
				    break;
			    case "Income/Assets":
			    	if(!ob.customList.income){
						ob.customList.income=[];
					}
					ob.customList.income.push(need);
				    break;
			    case "Other":
			   		if(!ob.customList.Other){
						ob.customList.Other=[];
					}
					ob.customList.Other.push(need);
				    break;
			}
		},
		mapNeedCategory : function (category){
			switch(category){
				case "liability":
				        return "Credit/Liabilities";
			    case "property":
			    	return "Property";
			    case "income":
			    	return "Income/Assets";
			    case "other":
			   		return "Other"
			}
		},
		mapNeedCategoryBack : function (category){
			switch(category){
				case "Credit/Liabilities":
				        return "liability";
			    case "Property":
			    	return "property";
			    case "Income/Assets":
			    	return "income";
			    case "Other":
			   		return "other";
			}
		},
		saveCustomNeed:function(callback){
			var ob=this;
			var f_category=$("#need_doc_type").val();
			var category=ob.mapNeedCategory($("#need_doc_type").val());
			var label=$("#need_doc_title").val();
			var desc=$("#need_doc_desc").val();
			if(label==""){
				alert("Invalid document title");
			}else if(desc==""){
				alert("Invalid document description");
			}else if(category==""){
				alert("Invalid document type");
			}else{
				var data={};
				data.category=category;
				data.label=label;
				data.description=desc;
				var exist;
				var categoryList=ob.customList[f_category];
				if(categoryList){
					for(var i=0;i<categoryList.length;i++){
						if(categoryList[i].title==label){
							exist=categoryList[i];
							break;
						}
					}
				}

				if(exist){
						if(!ob.needLookup[exist.title]){
							var document = exist;
							document.isChecked=true;
							ob.addCustomNeedToList(document);
							var newNeedRow = getNeededDocumentRow(document);
							
							$('.initial-list-doc-wrapper[data-doc-type="'+f_category+'"]').find('.initial-list-doc-container').append(newNeedRow);
							clearAddNeedForm();
							if(callback){
								callback();
							}
						}else{
							alert("Need already exist");
						}
				}else{
					ajaxRequest("rest/loanneeds/custom","POST","json",data,function(response){
						if(response.error){

						}else{
							var componentId=response.resultObject;
							var document = {
								"isChecked" : true,
								"title" : label,
								"desc" : desc,
								"needType" : componentId,
								"needCategory" : category
							};
							ob.addCustomNeedToList(document);
							var newNeedRow = getNeededDocumentRow(document);
							
							$('.initial-list-doc-wrapper[data-doc-type="'+f_category+'"]').find('.initial-list-doc-container').append(newNeedRow);
							clearAddNeedForm();
							if(callback){
								callback();
							}
						}
						
					});
				}
				
			}
		},
		getNeedsList:function(callback){
			var data={};
			data.loanId=this.loanId;
			var ob=this;

			ajaxRequest("rest/loanneeds/"+this.loanId,"GET","json",data,function(response){
				if(response.error){
				
				}else{
					ob.needsList=response.resultObject;
					if(callback){
						callback(ob);
					}
				}
				
			});
		},
		cleanDocData:function(){
			docData.liability=[];
			docData.property=[];
			docData.asset=[];
			docData.other=[];
			this.needLookup={};
		},
		populateNeedsList:function(callback){
			this.cleanDocData();
			var ob=this;
			var arrayLength = this.needsList.length;
			for (var i = 0; i < arrayLength; i++) {
				var category=this.needsList[i].needCategory;
				ob.needLookup[this.needsList[i].title]=this.needsList[i];
			    switch (category) {
				    case "Credit/Liabilities":
				        //append in Credit/Liabilities div
				        docData.liability.push(this.needsList[i]);
				       // $('#check').append('<input type="checkbox" name="needsCheckBox" needId="'needsList[i].needType'" title="'+needsList[i].description+'" checked="'+needsList[i].required+'">' + needsList[i].label+'</input>');
				        break;
				    case "Property":
				    	docData.property.push(this.needsList[i]);
				       //$('#check').append('<input type="checkbox" name="needsCheckBox" needId="'needsList[i].needType'" title="'+needsList[i].description+'" checked="'+needsList[i].required+'">' + needsList[i].label+'</input>');
				        break;
				    case "Income/Assets":
				    	docData.asset.push(this.needsList[i]);
				       //$('#check').append('<input type="checkbox" name="needsCheckBox" needId="'needsList[i].needType'" title="'+needsList[i].description+'" checked="'+needsList[i].required+'">' + needsList[i].label+'</input>');
				        break;
				    case "Other":
				   		docData.other.push(this.needsList[i]);
				       // $('#check').append('<input type="checkbox" name="needsCheckBox" needId="'needsList[i].needType'" title="'+needsList[i].description+'" checked="'+needsList[i].required+'">' + needsList[i].label+'</input>');
				        break;
				}
			}
			if(callback){
				callback(this);
			}
		},
		updateNeedsList:function(callback){
			var checkboxes = $(".doc-checked");
			var checkboxesChecked = [];

			for (var i=0; i<checkboxes.length; i++) {
				
					var ob=checkboxes[i].getAttribute("needId");
					checkboxesChecked.push(ob);
				
			}
			this.selectedNeeds=checkboxesChecked;

			if(callback){
				callback();
			}
		},
		saveSelectedNeedsList:function(callback){
			//API call TO save Updated Needs List
			var ob=this;
			var data={};
			data.loanId=this.loanId;
			data.needs=JSON.stringify(this.selectedNeeds);
			var ob=this;
			ajaxRequest("rest/loanneeds/"+data.loanId,"POST","json",data,function(response){
				if(response.error){
					alert(response.error.message);
				}else{
					alert("Save Successful")
					if(callback){
						callback(ob);
					}
				}
				
			});
		},
		init:function(callback){
			this.getNeedsList(function(ob){
				ob.populateNeedsList(callback);
			});
			this.getCustomNeedList();
		}
	};
	return loanNeedsListContext;
}
function ajaxRequest(url,type,dataType,data,successCallBack){
	$.ajax({
		url : url,
		type : type,
		dataType : dataType,
		data : data,
		success : successCallBack,
		error : function(){
			
		}
	});
}
var contxt;
function paintAgentNeedsListPage(){

	var loanNeedContext=getLoanNeedsManagerContext(1);//Insert Proper Loan Id here
	loanNeedContext.init(function(){
		appendDocumentToolTip();
		var loandetails={"id":1,"createdDate":"Dec 12, 2015 12:00:00 AM","deleted":false,"modifiedDate":"Dec 12, 2015 12:00:00 AM","name":"Sample loan","status":"IN_PROGRESS","user":{"id":1,"emailId":"test@gmail.com","firstName":"Test","lastName":"test","userRole":{"id":1,"roleCd":"CUST","label":"Customer","roleDescription":"Customer"}},"loanTeam":[{"id":1,"emailId":"test@gmail.com","firstName":"Test","lastName":"test","userRole":{"id":1,"roleCd":"CUST","label":"Customer","roleDescription":"Customer"}},{"id":2,"emailId":"test2@gmail.com","firstName":"Loan","lastName":"Manager","userRole":{"id":2,"roleCd":"LM","label":"Loan Manager","roleDescription":"Loan manager for the loan"}},{"id":3,"emailId":"test3@gmail.com","firstName":"Loan","lastName":"Manager2","userRole":{"id":2,"roleCd":"LM","label":"Loan Manager","roleDescription":"Loan manager for the loan"}}]};
		appendCustomerDetailHeader(selectedUserDetail);
		appendInitialNeedsListWrapper();
		paintUploadNeededItemsPage();
	})
	contxt=loanNeedContext;
	
}

function appendInitialNeedsListWrapper(){
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
	
	var incomeDocContainer = getNeedsListDocumentContainer("income",docData.asset).addClass('float-left');
	
	var propertyDocContainer = getNeedsListDocumentContainer("property",docData.property).addClass('float-right');
	
	var assetDocContainer = getNeedsListDocumentContainer("Liabilities",docData.liability).addClass('float-right');
	
	var otherDocContainer = getNeedsListDocumentContainer("other",docData.other).addClass('float-left');
	
	container.append(incomeDocContainer).append(propertyDocContainer).append(assetDocContainer).append(otherDocContainer);
	
	wrapper.append(header).append(container);
	$('#center-panel-cont').append(wrapper);
	
	appendAddNeedsContainer();
	
	//append save button
	var savebtnWrapper = $('<div>').attr({
		"class" : "need-list-save-btn-wrapper"
	});
	
	var savebtn = $('<div>').attr({
		"id" : "",
		"class" : "need-list-save-btn",
		"onclick": "saveLoanNeeds()"
	}).html("Save Needs");
	
	savebtnWrapper.append(savebtn);
	
	$('#center-panel-cont').append(savebtnWrapper);
}
function getNeedsListDocumentContainer(docType,documents){
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
	
	for(var i=0; i<documents.length; i++){
		var row = getNeededDocumentRow(documents[i]);
		container.append(row);
	}
	
	return docWrapper.append(header).append(container);
}
function getNeededDocumentRow(document){
	var row = $('<div>').attr({
		"class" : "initial-list-doc-row clearfix"
	});
	
	var checkBox = $('<div>').attr({
		"class" : "doc-checkbox float-left",
		"needId": document.needType
	});
	if(document.isChecked == true){
		checkBox.addClass('doc-checked');
	}else{
		checkBox.addClass('doc-unchecked');
	}
	
	var docTitle = $('<div>').attr({
		"class" : "doc-title float-left",
		"title" : document.desc//need to add id data here
	}).html(document.title);
	
	/*docTitle.bind('mouseenter',{"desc" : document.desc},function(event){
		var leftOffset = $(this).offset().left;
		var topOffset = $(this).offset().top;
		var desc = event.data.desc;
		showDocumentToolTip(desc, topOffset, leftOffset);
	});
	
	docTitle.bind('mouseleave',function(event){
		hideDocumentToolTip();
	});*/
	
	return row.append(checkBox).append(docTitle);
}
function saveLoanNeeds(){
	contxt.updateNeedsList(function(){
		contxt.saveSelectedNeedsList();
	});
}
function saveCustomNeed(){
	contxt.saveCustomNeed();
}