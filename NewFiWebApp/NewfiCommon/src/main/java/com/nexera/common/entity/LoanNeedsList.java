package com.nexera.common.entity;

import java.io.Serializable;

import javax.persistence.*;

import org.hibernate.annotations.Type;

import java.util.Date;

/**
 * The persistent class for the loanneedslist database table.
 * 
 */
@Entity
@NamedQuery(name = "LoanNeedsList.findAll", query = "SELECT l FROM LoanNeedsList l")
public class LoanNeedsList implements Serializable {
	private static final long serialVersionUID = 1L;
	private int id;
	private Boolean active;
	private String comments;
	private Boolean deleted;
	private String fileId;
	private String fileUrl;
	private Boolean mandatory;
	private Boolean systemAction;
	private Date uploadedDate;
	private Loan loan;
	private NeedsListMaster needsListMaster;
	private User uploadedBy;

	public LoanNeedsList() {
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}
	@Column(columnDefinition = "TINYINT")
	@Type(type = "org.hibernate.type.NumericBooleanType")
	public Boolean getActive() {
		return this.active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public String getComments() {
		return this.comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}
	@Column(columnDefinition = "TINYINT")
	@Type(type = "org.hibernate.type.NumericBooleanType")
	public Boolean getDeleted() {
		return this.deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}

	@Column(name = "file_id")
	public String getFileId() {
		return this.fileId;
	}

	public void setFileId(String fileId) {
		this.fileId = fileId;
	}

	@Column(name = "file_url")
	public String getFileUrl() {
		return this.fileUrl;
	}

	public void setFileUrl(String fileUrl) {
		this.fileUrl = fileUrl;
	}

	@Column(columnDefinition = "TINYINT")
	@Type(type = "org.hibernate.type.NumericBooleanType")
	public Boolean getMandatory() {
		return this.mandatory;
	}

	public void setMandatory(Boolean mandatory) {
		this.mandatory = mandatory;
	}

	@Column(name = "system_action",columnDefinition = "TINYINT")
	@Type(type = "org.hibernate.type.NumericBooleanType")
	public Boolean getSystemAction() {
		return this.systemAction;
	}

	public void setSystemAction(Boolean systemAction) {
		this.systemAction = systemAction;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "uploaded_date")
	public Date getUploadedDate() {
		return this.uploadedDate;
	}

	public void setUploadedDate(Date uploadedDate) {
		this.uploadedDate = uploadedDate;
	}

	// bi-directional many-to-one association to Loan
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "loan")
	public Loan getLoan() {
		return loan;
	}

	public void setLoan(Loan loan) {
		this.loan = loan;
	}

	// bi-directional many-to-one association to NeedsListMaster
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "need_type")
	public NeedsListMaster getNeedsListMaster() {
		return needsListMaster;
	}

	public void setNeedsListMaster(NeedsListMaster needsListMaster) {
		this.needsListMaster = needsListMaster;
	}

	// bi-directional many-to-one association to User
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uploaded_by")
	public User getUploadedBy() {
		return uploadedBy;
	}

	public void setUploadedBy(User uploadedBy) {
		this.uploadedBy = uploadedBy;
	}

}