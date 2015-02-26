<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Nexera</title>
<link href="resources/css/bootstrap.min.css" rel="stylesheet">
<link href="resources/css/jquery-ui.css" rel="stylesheet">
<link href="resources/css/styles.css" rel="stylesheet">
<link href="resources/css/style-resp.css" rel="stylesheet">
</head>

<body>
	<jsp:include page="header.jsp"></jsp:include>
	<div id="main-body-wrapper">
		<div class="home-container container">
			<div class="container-row row clearfix">
				<jsp:include page="customerViewLeftPanel.jsp"></jsp:include>
				<div id="conv-main-container"
					class="right-panel-messageDashboard float-left">

					<!-- Wrapper for selecting loan type -->
					<div class="loan-type-wrapper calculator-step-wrapper">
						<div class="loan-type-header">Loan Type</div>
						<div class="calculator-step-container">
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">Select Loan
									Type</div>
								<div class="loan-type-sel-rc float-left">
									<form>
										<input type="radio" checked /> Purchase <input type="radio" />Refinance
									</form>
								</div>
							</div>
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">Home Buying</div>
								<div class="loan-type-sel-rc float-left">
									<select class="calc-select">
										<option selected="selected">Select One</option>
										<option>Signed a purchase Agreement</option>
										<option>Get PreApproved</option>
										<option>What Can I Afford</option>
									</select>
								</div>
							</div>
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">First Time
									Home Buyer</div>
								<div class="loan-type-sel-rc float-left">
									<select class="calc-select">
										<option selected="selected">Select One</option>
										<option>No</option>
										<option>Yes</option>
									</select>
								</div>
							</div>
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">Preferred Loan
									Type</div>
								<div class="loan-type-sel-rc float-left">
									<select class="calc-select">
										<option selected="selected">Site Chooses</option>
										<option>Fixed Rate</option>
										<option>Adjustable Rate</option>
									</select>
								</div>
							</div>
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">How soon would
									you like to close</div>
								<div class="loan-type-sel-rc float-left">
									<select class="calc-select">
										<option selected="selected">30 days</option>
										<option>25 days</option>
										<option>40 days</option>
										<option>55 days</option>
									</select>
								</div>
							</div>
						</div>
						<div class="calc-btn calc-nxt-btn">Next</div>
					</div>


					<!-- Wrapper to add personal info -->
					<div class="personal-info-wrapper calculator-step-wrapper hide">
						<div class="personal-info-header">Personal Information</div>
						<div class="calculator-step-container">
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">What is your
									current Employment Status?</div>
								<div class="loan-type-sel-rc float-left">
									<select class="calc-select">
										<option selected="selected">Salaried Employee</option>
										<option>Active Military Duty</option>
										<option>Self Employed</option>
										<option>Retired</option>
										<option>Other/Unemployed</option>
									</select>
								</div>
							</div>
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">What is your
									current Credit score?</div>
								<div class="loan-type-sel-rc float-left">
									<select class="calc-select">
										<option selected="selected">Select One</option>
										<option>Active Military Duty</option>
										<option>Self Employed</option>
										<option>Retired</option>
										<option>Other/Unemployed</option>
									</select>
								</div>
							</div>
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">Please enter
									your personal contact</div>
								<div class="loan-type-sel-rc float-left clearfix">
									<div class="calc-input-cont float-left">
										<div>First Name</div>
										<input type="text" class="calc-input">
									</div>
									<div class="calc-input-cont float-left">
										<div>Last Name</div>
										<input type="text" class="calc-input">
									</div>
									<div class="calc-input-cont float-left">
										<div>Email</div>
										<input type="text" class="calc-input">
									</div>
									<div class="clearfix">
										<div class="calc-input-cont float-left">
											<div>Preferred Phone</div>
											<input type="text" class="calc-input"> <select
												class="calc-select">
												<option selected="selected">Home</option>
												<option>Cell</option>
												<option>Work</option>
												<option>Other</option>
											</select>
										</div>
										<div class="calc-input-cont float-left">
											<div>Alternate Phone</div>
											<input type="text" class="calc-input"> <select
												class="calc-select">
												<option>Home</option>
												<option selected="selected">Cell</option>
												<option>Work</option>
												<option>Other</option>
											</select>
										</div>
									</div>
								</div>
							</div>
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">How did you
									hear about us?</div>
								<div class="loan-type-sel-rc float-left">
									<select class="calc-select">
										<option selected="selected">Select One</option>
										<option>Advanced Medical Management</option>
										<option>Buckingham Asset Management</option>
										<option>Craig Wright</option>
										<option>Family</option>
										<option>Friend</option>
										<option>Heroes Mortgage</option>
										<option>Ideal Living</option>
										<option>Internet</option>
										<option>Social Media</option>
									</select>
								</div>
							</div>
						</div>
						<div class="calc-btn calc-nxt-btn">Next</div>
					</div>

					<!-- Wrapper for property and loan information -->
					<div class="poperty-loan-wrapper calculator-step-wrapper hide">
						<div class="poperty-loan-header">Property and Loan
							Information</div>
						<div class="calculator-step-container">
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">What is the
									loan amount you are looking for?</div>
								<div class="loan-type-sel-rc float-left">
									<input type="text" class="calc-input">
								</div>
							</div>
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">Do you prefer
									to include Taxes and Insurance as part of your loan payment?</div>
								<div class="loan-type-sel-rc float-left">
									<input type="radio" checked /> Yes <input type="radio" />No
								</div>
							</div>
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">What is the
									loan amount you are looking for?</div>
								<div class="loan-type-sel-rc float-left">
									<input type="text" class="calc-input">
								</div>
							</div>
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">Occupancy
									type?</div>
								<div class="loan-type-sel-rc float-left">
									<select class="calc-select">
										<option selected="selected">Primary Residence</option>
										<option>Investment Property</option>
										<option>Second/Vacation Home</option>
									</select>
								</div>
							</div>
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">What type of
									property is this?</div>
								<div class="loan-type-sel-rc float-left">
									<select class="calc-select">
										<option selected="selected">Single Family</option>
										<option>Condo</option>
										<option>Coop</option>
										<option>Manufactured/Double-wide</option>
										<option>Manufactured/Single-wide</option>
										<option>Modular</option>
										<option>PUD</option>
										<option>Townhouse</option>
									</select>
								</div>
							</div>
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">Number of
									units?</div>
								<div class="loan-type-sel-rc float-left">
									<select class="calc-select">
										<option selected="selected">1</option>
										<option>2</option>
										<option>3</option>
										<option>4</option>
									</select>
								</div>
							</div>
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">What is the
									property address?</div>
								<div class="loan-type-sel-rc float-left">
									<div class="prop-addr-edit-row clearfix">
										<div class="prop-addr-edit-cont float-left">
											<div>Address</div>
											<input type="text" class="calc-input">
										</div>
										<div class="prop-addr-edit-cont float-left">
											<div>Unit#</div>
											<input type="text" class="calc-input">
										</div>
										<div class="prop-addr-edit-cont float-left">
											<div>Zip</div>
											<input type="text" class="calc-input">
										</div>
									</div>
									<div class="prop-addr-edit-row">
										<div class="prop-addr-edit-cont float-left">
											<div>City</div>
											<input type="text" class="calc-input">
										</div>
										<div class="prop-addr-edit-cont float-left">
											<div>State</div>
											<select class="calc-select">
												<option>CA</option>
											</select>
										</div>
										<div class="prop-addr-edit-cont float-left">
											<div>County</div>
											<select class="calc-select">
												<option>Calaveras</option>
											</select>
										</div>
									</div>
								</div>
							</div>
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">Do you have a
									real estate agent?</div>
								<div class="loan-type-sel-rc float-left">
									<form>
										<input type="radio" checked /> Yes <input type="radio" />No
									</form>
								</div>
							</div>
						</div>
						<div class="calc-btn calc-nxt-btn">Next</div>
					</div>


					<!-- Wrapper for VA information -->
					<div class="va-wrapper calculator-step-wrapper hide">
						<div class="va-header">VA Information</div>
						<div class="calculator-step-container">
							<div class="loan-type-sel-row clearfix">
								<div class="loan-type-sel-label float-left">Are you a
									Veteran?</div>
								<div class="loan-type-sel-rc float-left">
									<form>
										<input type="radio" checked /> Yes <input type="radio" />No
									</form>
								</div>
							</div>
						</div>
						<div class="calc-btn">Submit</div>
					</div>

				</div>
			</div>
		</div>
	</div>
	<jsp:include page="footer.jsp"></jsp:include>
	<script type="text/javascript">
		$(document).ready(function() {
			$(document).on('click','.calc-nxt-btn',function(){
				$(this).parent().hide();
				$(this).parent().next().show();
			});
		});
	</script>

</body>
</html>