package com.nexera.common.entity;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;
import java.util.List;


/**
 * The persistent class for the workflow database table.
 * 
 */
@Entity
@NamedQuery(name="Workflow.findAll", query="SELECT w FROM Workflow w")
public class Workflow implements Serializable {
	private static final long serialVersionUID = 1L;
	private int id;
	private Boolean active;
	private Date createdTime;
	private WorkflowItem currentExecutingItem;
	private Date executionCompleteTime;
	private Date lastUpdatedTime;
	private byte[] meta;
	private String status;
	private String summary;
	private WorkflowMaster workflowMaster;
	private User user;
	private List<WorkflowItem> workflowItems;

	public Workflow() {
	}


	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}


	public Boolean getActive() {
		return this.active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}


	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="created_time")
	public Date getCreatedTime() {
		return this.createdTime;
	}

	public void setCreatedTime(Date createdTime) {
		this.createdTime = createdTime;
	}


	@Column(name="current_executing_item")
	public WorkflowItem getCurrentExecutingItem() {
		return this.currentExecutingItem;
	}

	public void setCurrentExecutingItem(WorkflowItem currentExecutingItem) {
		this.currentExecutingItem = currentExecutingItem;
	}


	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="execution_complete_time")
	public Date getExecutionCompleteTime() {
		return this.executionCompleteTime;
	}

	public void setExecutionCompleteTime(Date executionCompleteTime) {
		this.executionCompleteTime = executionCompleteTime;
	}


	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="last_updated_time")
	public Date getLastUpdatedTime() {
		return this.lastUpdatedTime;
	}

	public void setLastUpdatedTime(Date lastUpdatedTime) {
		this.lastUpdatedTime = lastUpdatedTime;
	}


	@Lob
	public byte[] getMeta() {
		return this.meta;
	}

	public void setMeta(byte[] meta) {
		this.meta = meta;
	}


	public String getStatus() {
		return this.status;
	}

	public void setStatus(String status) {
		this.status = status;
	}


	public String getSummary() {
		return this.summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}


	//bi-directional many-to-one association to WorkflowMaster
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="workflow")
	public WorkflowMaster getWorkflowmaster() {
		return this.workflowMaster;
	}

	public void setWorkflowmaster(WorkflowMaster workflowmaster) {
		this.workflowMaster = workflowmaster;
	}


	//bi-directional many-to-one association to User
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="created_by")
	public User getUser() {
		return this.user;
	}

	public void setUser(User user) {
		this.user = user;
	}


	//bi-directional many-to-one association to WorkflowItem
	@OneToMany(mappedBy="workflow")
	public List<WorkflowItem> getWorkflowItems() {
		return this.workflowItems;
	}

	public void setWorkflowItems(List<WorkflowItem> workflowitems) {
		this.workflowItems = workflowitems;
	}

	public WorkflowItem addWorkflowItem(WorkflowItem workflowitem) {
		getWorkflowItems().add(workflowitem);
		workflowitem.setParentWorkflow(this);

		return workflowitem;
	}

	public WorkflowItem removeWorkflowItem(WorkflowItem workflowitem) {
		getWorkflowItems().remove(workflowitem);
		workflowitem.setParentWorkflow(null);

		return workflowitem;
	}

}