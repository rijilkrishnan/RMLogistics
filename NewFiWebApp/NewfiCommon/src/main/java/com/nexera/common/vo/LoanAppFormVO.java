package com.nexera.common.vo;

import java.io.Serializable;
import java.util.List;

import com.nexera.common.entity.LoanAppForm;
import com.nexera.common.entity.PropertyTypeMaster;

public class LoanAppFormVO implements Serializable {
	private static final long serialVersionUID = 1L;
	private int id;
	private Boolean employed;
	private Boolean hoaDues;
	private Boolean homeRecentlySold;
	private Boolean homeToSell;
	private String maritalStatus;
	private Boolean ownsOtherProperty;
	private Boolean pensionOrRetirement;
	private Boolean receiveAlimonyChildSupport;
	private Boolean rentedOtherProperty;
	private Boolean secondMortgage;
	private Boolean selfEmployed;
	private Boolean ssIncomeOrDisability;
	private UserVO user;
	private PropertyTypeMasterVO propertyTypeMaster;
	private LoanTypeMasterVO loanTypeMaster;
	private LoanVO loan;
	private List<UserEmploymentHistoryVO> userEmploymentHistories;
	private Boolean paySecondMortgage;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Boolean getEmployed() {
		return employed;
	}

	public void setEmployed(Boolean employed) {
		this.employed = employed;
	}

	public Boolean getHoaDues() {
		return hoaDues;
	}

	public void setHoaDues(Boolean hoaDues) {
		this.hoaDues = hoaDues;
	}

	public Boolean getHomeRecentlySold() {
		return homeRecentlySold;
	}

	public void setHomeRecentlySold(Boolean homeRecentlySold) {
		this.homeRecentlySold = homeRecentlySold;
	}

	public Boolean getHomeToSell() {
		return homeToSell;
	}

	public void setHomeToSell(Boolean homeToSell) {
		this.homeToSell = homeToSell;
	}

	public String getMaritalStatus() {
		return maritalStatus;
	}

	public void setMaritalStatus(String maritalStatus) {
		this.maritalStatus = maritalStatus;
	}

	public Boolean getOwnsOtherProperty() {
		return ownsOtherProperty;
	}

	public void setOwnsOtherProperty(Boolean ownsOtherProperty) {
		this.ownsOtherProperty = ownsOtherProperty;
	}

	public Boolean getPensionOrRetirement() {
		return pensionOrRetirement;
	}

	public void setPensionOrRetirement(Boolean pensionOrRetirement) {
		this.pensionOrRetirement = pensionOrRetirement;
	}

	public Boolean getReceiveAlimonyChildSupport() {
		return receiveAlimonyChildSupport;
	}

	public void setReceiveAlimonyChildSupport(Boolean receiveAlimonyChildSupport) {
		this.receiveAlimonyChildSupport = receiveAlimonyChildSupport;
	}

	public Boolean getRentedOtherProperty() {
		return rentedOtherProperty;
	}

	public void setRentedOtherProperty(Boolean rentedOtherProperty) {
		this.rentedOtherProperty = rentedOtherProperty;
	}

	public Boolean getSecondMortgage() {
		return secondMortgage;
	}

	public void setSecondMortgage(Boolean secondMortgage) {
		this.secondMortgage = secondMortgage;
	}

	public Boolean getSelfEmployed() {
		return selfEmployed;
	}

	public void setSelfEmployed(Boolean selfEmployed) {
		this.selfEmployed = selfEmployed;
	}

	public Boolean getSsIncomeOrDisability() {
		return ssIncomeOrDisability;
	}

	public void setSsIncomeOrDisability(Boolean ssIncomeOrDisability) {
		this.ssIncomeOrDisability = ssIncomeOrDisability;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public PropertyTypeMasterVO getPropertyTypeMaster() {
		return propertyTypeMaster;
	}

	public void setPropertyTypeMaster(PropertyTypeMasterVO propertyTypeMaster) {
		this.propertyTypeMaster = propertyTypeMaster;
	}

	public LoanTypeMasterVO getLoanTypeMaster() {
		return loanTypeMaster;
	}

	public void setLoanTypeMaster(LoanTypeMasterVO loanTypeMaster) {
		this.loanTypeMaster = loanTypeMaster;
	}

	public LoanVO getLoan() {
		return loan;
	}

	public void setLoan(LoanVO loan) {
		this.loan = loan;
	}

	public List<UserEmploymentHistoryVO> getUserEmploymentHistories() {
		return userEmploymentHistories;
	}

	public void setUserEmploymentHistories(
			List<UserEmploymentHistoryVO> userEmploymentHistories) {
		this.userEmploymentHistories = userEmploymentHistories;
	}

	public LoanAppForm convertToEntity() {

		LoanAppForm loanAppForm = new LoanAppForm();
		loanAppForm.setId(this.id);
		loanAppForm.setEmployed(this.getEmployed());
		loanAppForm.setHoaDues(this.getHoaDues());
		loanAppForm.setHomeRecentlySold(this.homeRecentlySold);

		loanAppForm.setMaritalStatus(this.getMaritalStatus());
		loanAppForm.setOwnsOtherProperty(ownsOtherProperty);
		loanAppForm.setPensionOrRetirement(pensionOrRetirement);
		loanAppForm.setReceiveAlimonyChildSupport(receiveAlimonyChildSupport);
		loanAppForm.setRentedOtherProperty(rentedOtherProperty);
		loanAppForm.setSecondMortgage(secondMortgage);
		loanAppForm.setSelfEmployed(selfEmployed);
		loanAppForm.setSsIncomeOrDisability(ssIncomeOrDisability);
		loanAppForm.setPaySecondMortgage(this.paySecondMortgage);
		loanAppForm.setHomeToSell(this.homeToSell);
		PropertyTypeMaster propertyTypeMaster = new PropertyTypeMaster();
		propertyTypeMaster.setId(1);
		loanAppForm.setPropertyTypeMaster(propertyTypeMaster);

		loanAppForm.setUser(this.getUser().convertToEntity());

		loanAppForm.setLoan(this.getLoan().convertToEntity());

		return loanAppForm;
	}

	public Boolean getPaySecondMortgage() {
		return paySecondMortgage;
	}

	public void setPaySecondMortgage(Boolean paySecondMortgage) {
		this.paySecondMortgage = paySecondMortgage;
	}

	public LoanAppFormVO convertFromEntity(LoanAppForm loanAppEntity) {

		LoanAppFormVO loanAppFormVO = new LoanAppFormVO();
		loanAppFormVO.setEmployed(loanAppEntity.getEmployed());
		loanAppFormVO.setHoaDues(loanAppEntity.getHoaDues());
		loanAppFormVO.setMaritalStatus(loanAppEntity.getMaritalStatus());
		loanAppFormVO.setReceiveAlimonyChildSupport(loanAppEntity
				.getReceiveAlimonyChildSupport());
		return loanAppFormVO;
	}

}