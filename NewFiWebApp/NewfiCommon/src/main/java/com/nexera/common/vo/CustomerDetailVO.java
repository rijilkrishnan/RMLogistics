package com.nexera.common.vo;

import java.io.Serializable;
import java.util.Date;

public class CustomerDetailVO implements Serializable {
	private static final long serialVersionUID = 1L;
	private int id;
	private String addressCity;
	private String addressState;
	private String addressZipCode;
	private Date dateOfBirth;
	private Integer profileCompletionStatus;
	private String secEmailId;
	private String secPhoneNumber;
	private UserVO user;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getAddressCity() {
		return addressCity;
	}
	public void setAddressCity(String addressCity) {
		this.addressCity = addressCity;
	}
	public String getAddressState() {
		return addressState;
	}
	public void setAddressState(String addressState) {
		this.addressState = addressState;
	}
	public String getAddressZipCode() {
		return addressZipCode;
	}
	public void setAddressZipCode(String addressZipCode) {
		this.addressZipCode = addressZipCode;
	}
	public Date getDateOfBirth() {
		return dateOfBirth;
	}
	public void setDateOfBirth(Date dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}
	public Integer getProfileCompletionStatus() {
		return profileCompletionStatus;
	}
	public void setProfileCompletionStatus(Integer profileCompletionStatus) {
		this.profileCompletionStatus = profileCompletionStatus;
	}
	public String getSecEmailId() {
		return secEmailId;
	}
	public void setSecEmailId(String secEmailId) {
		this.secEmailId = secEmailId;
	}
	public String getSecPhoneNumber() {
		return secPhoneNumber;
	}
	public void setSecPhoneNumber(String secPhoneNumber) {
		this.secPhoneNumber = secPhoneNumber;
	}
	public UserVO getUser() {
		return user;
	}
	public void setUser(UserVO user) {
		this.user = user;
	}

}