package com.nexera.workflow.bean;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.Type;

/**
 * The persistent class for the workflowitem database table.
 * 
 */
@Entity
@Table(name = "workflowitemexec")
@NamedQuery(name = "WorkflowItemExec.findAll", query = "SELECT w FROM WorkflowItemExec w")
public class WorkflowItemExec implements Serializable {
	private static final long serialVersionUID = 1L;
	private Integer id;
	private Date creationDate;
	private Date modifiedDate;
	private Date startTime;
	private Date endTime;
	private String status;
	private Boolean success;
	private WorkflowItemExec onSuccessItem;
	private WorkflowItemMaster workflowItemMaster;
	private WorkflowExec parentWorkflow;
	private WorkflowItemExec parentWorkflowItemExec;
	private String params;
	private Boolean clickable;
	private Integer displayOrder;

	public WorkflowItemExec() {
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "end_time")
	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "creation_date")
	public Date getCreationDate() {
		return this.creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "modified_date")
	public Date getModifiedDate() {
		return this.modifiedDate;
	}

	public void setModifiedDate(Date modifiedDate) {
		this.modifiedDate = modifiedDate;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "start_time")
	public Date getStartTime() {
		return this.startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	@Column(columnDefinition = "TINYINT")
	@Type(type = "org.hibernate.type.NumericBooleanType")
	public Boolean getSuccess() {
		return this.success;
	}

	public void setSuccess(Boolean success) {
		this.success = success;
	}

	@Column(columnDefinition = "TINYINT")
	@Type(type = "org.hibernate.type.NumericBooleanType")
	public Boolean getClickable() {
		return this.clickable;
	}

	public void setClickable(Boolean clickable) {
		this.clickable = clickable;
	}

	// bi-directional many-to-one association to WorkflowItemMaster
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "workflow_item_master")
	public WorkflowItemMaster getWorkflowItemMaster() {
		return this.workflowItemMaster;
	}

	public void setWorkflowItemMaster(WorkflowItemMaster workflowItemMaster) {
		this.workflowItemMaster = workflowItemMaster;
	}

	// bi-directional many-to-one association to Workflow
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_workflow")
	public WorkflowExec getParentWorkflow() {
		return parentWorkflow;
	}

	public void setParentWorkflow(WorkflowExec parentWorkflow) {
		this.parentWorkflow = parentWorkflow;
	}

	/**
	 * @return the status
	 */
	@Column(name = "status", columnDefinition = "enum('0','1','2','3')")
	public String getStatus() {
		return status;
	}

	/**
	 * @param status
	 *            the status to set
	 */
	public void setStatus(String status) {
		this.status = status;
	}

	/**
	 * @return the parentWorkflowItemExec
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_workflow_item_master")
	public WorkflowItemExec getParentWorkflowItemExec() {
		return parentWorkflowItemExec;
	}

	/**
	 * @param parentWorkflowItemExec
	 *            the parentWorkflowItemExec to set
	 */
	public void setParentWorkflowItemExec(
	        WorkflowItemExec parentWorkflowItemExec) {
		this.parentWorkflowItemExec = parentWorkflowItemExec;
	}

	/**
	 * @return the params
	 */
	@Column(name = "params")
	public String getParams() {
		return params;
	}

	/**
	 * @param params
	 *            the params to set
	 */
	public void setParams(String params) {
		this.params = params;
	}

	@Column(name = "display_order")
	public Integer getDisplayOrder() {
		return displayOrder;
	}

	public void setDisplayOrder(Integer displayOrder) {
		this.displayOrder = displayOrder;
	}

	/**
	 * @return the onSuccessItem
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "on_success_item")
	public WorkflowItemExec getOnSuccessItem() {
		return onSuccessItem;
	}

	/**
	 * @param onSuccessItem
	 *            the onSuccessItem to set
	 */
	public void setOnSuccessItem(WorkflowItemExec onSuccessItem) {
		this.onSuccessItem = onSuccessItem;
	}

}