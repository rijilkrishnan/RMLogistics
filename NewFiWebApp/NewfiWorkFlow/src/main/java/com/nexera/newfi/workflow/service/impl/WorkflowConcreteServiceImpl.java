package com.nexera.newfi.workflow.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.nexera.common.commons.LoanStatus;
import com.nexera.common.commons.Utils;
import com.nexera.common.commons.WorkflowDisplayConstants;
import com.nexera.common.entity.CustomerDetail;
import com.nexera.common.entity.Loan;
import com.nexera.common.entity.LoanAppForm;
import com.nexera.common.entity.LoanMilestone;
import com.nexera.common.entity.LoanMilestoneMaster;
import com.nexera.common.entity.LoanNeedsList;
import com.nexera.common.entity.NeedsListMaster;
import com.nexera.common.enums.InternalUserRolesEum;
import com.nexera.common.enums.MasterNeedsEnum;
import com.nexera.common.enums.Milestones;
import com.nexera.common.enums.UserRolesEnum;
import com.nexera.common.exception.InvalidInputException;
import com.nexera.common.exception.NoRecordsFetchedException;
import com.nexera.common.vo.CreateReminderVo;
import com.nexera.common.vo.LoanTurnAroundTimeVO;
import com.nexera.common.vo.LoanVO;
import com.nexera.common.vo.NotificationVO;
import com.nexera.common.vo.UserVO;
import com.nexera.core.service.LoanAppFormService;
import com.nexera.core.service.LoanService;
import com.nexera.core.service.NeedsListService;
import com.nexera.core.service.NotificationService;
import com.nexera.core.service.TransactionService;
import com.nexera.core.service.UserProfileService;
import com.nexera.newfi.workflow.service.IWorkflowService;
import com.nexera.workflow.bean.WorkflowExec;
import com.nexera.workflow.bean.WorkflowItemExec;
import com.nexera.workflow.bean.WorkflowItemMaster;
import com.nexera.workflow.enums.WorkItemStatus;
import com.nexera.workflow.service.WorkflowService;

@Component
public class WorkflowConcreteServiceImpl implements IWorkflowService {
	private static final Logger LOG = LoggerFactory
	        .getLogger(WorkflowConcreteServiceImpl.class);
	@Autowired
	private LoanAppFormService loanAppFormService;
	@Autowired
	private NotificationService notificationService;
	@Autowired
	private WorkflowService workflowService;
	@Autowired
	private LoanService loanService;
	@Autowired
	UserProfileService userProfileService;
	@Autowired
	private NeedsListService needsListService;
	@Autowired
	Utils utils;
	@Autowired
	private TransactionService transactionService;

	@Override
	public LoanAppForm getLoanAppFormDetails(Loan loan) {
		return loanAppFormService.findByLoan(loan);
	}

	@Override
	public String updateLMReminder(CreateReminderVo createReminderVo) {
		LOG.debug("Inside method updateLMReminder ");
		WorkflowItemExec currMilestone = workflowService
		        .getWorkflowExecById(createReminderVo
		                .getWorkflowItemExecutionId());
		LOG.debug("Current Milestone is  " + currMilestone.getId() + " "
		        + currMilestone.getWorkflowItemMaster().getWorkflowItemType());
		if (currMilestone.getStatus().equals(
		        WorkItemStatus.NOT_STARTED.getStatus())) {
			LOG.debug("This milestone has not yet started "
			        + currMilestone.getId());
			LoanVO loanVO = loanService.getLoanByID(createReminderVo
			        .getLoanId());
			if (createReminderVo.isForCustomer())
				LOG.debug("Creating reminder for customer");
			createReminderVo.setUserID(loanVO.getUser() != null ? loanVO
			        .getUser().getId() : 0);
			WorkflowExec workflowExec = new WorkflowExec();
			workflowExec.setId(loanVO.getLoanManagerWorkflowID());
			WorkflowItemMaster workflowItemMaster = workflowService
			        .getWorkflowByType(createReminderVo.getPrevMilestoneKey());
			WorkflowItemExec prevMilestone = workflowService
			        .getWorkflowItemExecByType(workflowExec, workflowItemMaster);
			if (prevMilestone.getStatus().equals(
			        WorkItemStatus.COMPLETED.getStatus())) {
				LOG.debug("previous milestone "
				        + prevMilestone.getId()
				        + " "
				        + prevMilestone.getWorkflowItemMaster()
				                .getWorkflowItemType()
				        + " is complete hence sending a reminder ");
				sendReminder(createReminderVo, currMilestone, prevMilestone);
			}
		} else {

			LOG.debug("Current Milestone already started  hence dismissing this notification");
			notificationService.dismissReadNotifications(
			        createReminderVo.getLoanId(),
			        createReminderVo.getNotificationType());
		}

		return null;
	}

	private void sendReminder(CreateReminderVo createReminderVo,
	        WorkflowItemExec currMilestone, WorkflowItemExec prevMilestone) {
		LOG.debug("Inside method sendReminder");
		long noOfHours = (prevMilestone.getEndTime().getTime() - new Date()
		        .getTime()) / (1000 * 60 * 60);
		LOG.debug("total number of hours left " + noOfHours);
		LoanTurnAroundTimeVO loanTurnAroundTimeVO = loanService
		        .retrieveTurnAroundTimeByLoan(createReminderVo.getLoanId(),
		                currMilestone.getWorkflowItemMaster().getId());
		long turnaroundTime = loanTurnAroundTimeVO.getHours();
		LOG.debug("total turnaroundtime left " + turnaroundTime);
		if (noOfHours >= turnaroundTime) {
			createAlertOfType(createReminderVo);
		}
	}

	@Override
	public void createAlertOfType(CreateReminderVo createReminderVo) {
		LOG.debug("Inside method createAlertOfType");
		List<NotificationVO> notificationList = notificationService
		        .findNotificationTypeListForLoan(createReminderVo.getLoanId(),
		                createReminderVo.getNotificationType()
		                        .getNotificationTypeName(), null);
		if (notificationList.size() == 0
		        || notificationList.get(0).getRead() == true) {
			LOG.debug("Creating new notification "
			        + createReminderVo.getNotificationType());
			NotificationVO notificationVO = new NotificationVO(
			        createReminderVo.getLoanId(), createReminderVo
			                .getNotificationType().getNotificationTypeName(),
			        createReminderVo.getNotificationReminderContent());
			if (!createReminderVo.isForCustomer()) {
				LOG.debug("Creating reminder for customer");
				createNotificationForLM(notificationVO);
			} else {
				LOG.debug("This notification of for loanmanager");
				notificationVO.setCreatedForID(createReminderVo.getUserID());
				notificationVO.setTimeOffset(new Date().getTimezoneOffset());
				notificationService.createNotification(notificationVO);
			}
		}
	}

	private void createNotificationForLM(NotificationVO notificationVO) {
		LOG.debug("Inside method createNotificationForLM");
		List<UserRolesEnum> userRoles = new ArrayList<UserRolesEnum>();
		userRoles.add(UserRolesEnum.INTERNAL);
		List<InternalUserRolesEum> internalUserRoles = new ArrayList<InternalUserRolesEum>();
		internalUserRoles.add(InternalUserRolesEum.LM);
		notificationService.createRoleBasedNotification(notificationVO,
		        userRoles, internalUserRoles);
	}

	@Override
	public void sendReminder(CreateReminderVo createReminderVo,
	        int currMilestoneID, int prevMilestoneID) {
		LOG.debug("Inside method sendReminder");
		WorkflowItemExec currMilestone = workflowService
		        .getWorkflowExecById(createReminderVo
		                .getWorkflowItemExecutionId());
		LoanVO loanVO = loanService.getLoanByID(createReminderVo.getLoanId());
		WorkflowExec workflowExec = new WorkflowExec();
		workflowExec.setId(loanVO.getLoanManagerWorkflowID());
		WorkflowItemMaster workflowItemMaster = workflowService
		        .getWorkflowByType(createReminderVo.getPrevMilestoneKey());
		WorkflowItemExec prevMilestone = workflowService
		        .getWorkflowItemExecByType(workflowExec, workflowItemMaster);
		sendReminder(createReminderVo, currMilestone, prevMilestone);
	}

	@Override
	public String updateNexeraMilestone(int loanId, int masterMileStoneId,
	        String comments) {
		LOG.debug("Inside method upadteNexeraMilestone ");
		String status = null;
		try {
			Loan loan = new Loan(loanId);
			LoanMilestone mileStone = new LoanMilestone();
			mileStone.setLoan(loan);
			LoanMilestoneMaster loanMilestoneMaster = new LoanMilestoneMaster();
			loanMilestoneMaster.setId(masterMileStoneId);
			mileStone.setLoanMilestoneMaster(loanMilestoneMaster);
			mileStone.setComments(comments);
			mileStone.setStatusUpdateTime(new Date());
			LOG.debug("Saving milestone in database ");
			loanService.saveLoanMilestone(mileStone);
			status = WorkItemStatus.COMPLETED.getStatus();
			return status;
		} catch (Exception e) {
			LOG.error("Exception caught " + e.getMessage());
			return status;
		}
	}

	@Override
	public String getNexeraMilestoneComments(int loanId, Milestones milestone) {
		String comments = null;
		LOG.debug("Inside method getNexeraMilestoneComments");
		Loan loan = new Loan(loanId);
		LoanMilestone mileStone = loanService.findLoanMileStoneByLoan(loan,
		        milestone.getMilestoneKey());
		if (mileStone != null) {
			if (mileStone.getComments() != null)
				comments = mileStone.getComments().toString();
		}
		return comments;
	}

	@Override
	public String getCreditDisplayScore(int userID) {
		LOG.debug("Inside method getCreditDisplayScore");
		String creditDisplay = "";
		UserVO user = userProfileService.findUser(userID);
		if (user != null) {
			if (user.getCustomerDetail() != null) {
				creditDisplay = utils.constrtCreditScore(CustomerDetail
				        .convertFromVOToEntity(user.getCustomerDetail()));
			}
		}
		return creditDisplay;
	}

	@Override
	public String getRenderInfoForDisclosure(int loanID) {
		LOG.debug("Inside method getRenderStateInfoForDisclosure");
		HashMap<String, Object> map = new HashMap<String, Object>();
		Loan loan = new Loan(loanID);
		LoanMilestone loanMilestone = loanService.findLoanMileStoneByLoan(loan,
		        Milestones.DISCLOSURE.getMilestoneKey());
		String status = loanMilestone.getComments().toString();
		LOG.debug("Status is " + status);
		map.put(WorkflowDisplayConstants.WORKFLOW_RENDERSTATE_STATUS_KEY,
		        status);
		MasterNeedsEnum needURLItem = null;
		if (status.equals(LoanStatus.disclosureAvail)) {
			needURLItem = MasterNeedsEnum.Disclsoure_Available;
		} else if (status.equals(LoanStatus.disclosureSigned)) {
			needURLItem = MasterNeedsEnum.Signed_Disclosure;
		}
		if (needURLItem != null) {
			map.put(WorkflowDisplayConstants.RESPONSE_URL_KEY,
			        getDisclosureURL(loanID, needURLItem));
		}
		return utils.getJsonStringOfMap(map);
	}

	@Override
	public String getDisclosureURL(int loanID, MasterNeedsEnum needItem) {
		String uuID = "";
		if (needItem != null) {
			NeedsListMaster needsListMaster = new NeedsListMaster();
			needsListMaster.setId(Integer.parseInt(needItem.getIndx()));
			LoanNeedsList loanNeedsList = needsListService.findNeedForLoan(
			        new Loan(loanID), needsListMaster);
			if (loanNeedsList != null
			        && loanNeedsList.getUploadFileId() != null) {
				uuID = loanNeedsList.getUploadFileId().getUuidFileId();
			}
		}
		return uuID;
	}

	@Override
	public String getRenderInfoForApplicationFee(int loanID) {
		LOG.debug("Inside method getRenderStateInfoForApplicationFee ");
		Map<String, Object> map = new HashMap<String, Object>();
		String status = LoanStatus.APP_PAYMENT_CLICK_TO_PAY;
		Loan loan = new Loan(loanID);
		LoanMilestone mileStone = loanService.findLoanMileStoneByLoan(loan,
		        Milestones.APP_FEE.getMilestoneKey());
		if (mileStone != null && mileStone.getComments() != null) {
			status = mileStone.getComments().toString();
		}
		int amount = 0;
		BigDecimal configuredAmount = null;
		try {
			LoanVO loanVO = loanService.getLoanByID(loanID);
			// Configured Amount : Loan Table App Fee - set my SM
			configuredAmount = loanVO.getAppFee();
			amount = loanService.getApplicationFee(loanID);
			LOG.debug("Application fee is " + amount);
		} catch (NoRecordsFetchedException e) {
			amount = 0;
			LOG.error("Exception Caught " + e.getMessage());
		} catch (InvalidInputException e) {
			amount = 0;
			LOG.error("Exception Caught " + e.getMessage());
		}
		if (configuredAmount == null) {
			map.put(WorkflowDisplayConstants.APP_FEE_KEY_NAME, amount);
		} else {
			map.put(WorkflowDisplayConstants.APP_FEE_KEY_NAME, configuredAmount);

		}
		map.put(WorkflowDisplayConstants.WORKFLOW_RENDERSTATE_STATUS_KEY,
		        status);

		return utils.getJsonStringOfMap(map);
	}

	@Override
	public String getRenderInfoFor1003(int loanID, int userID) {
		LOG.debug("Inside method getRenderStateInfoFor1003");
		HashMap<String, Object> map = new HashMap<String, Object>();
		Loan loan = new Loan(loanID);

		LoanMilestone loanMilestone = loanService.findLoanMileStoneByLoan(loan,
		        Milestones.App1003.getMilestoneKey());
		if (loanMilestone != null) {
			String status = loanMilestone.getComments();
			map.put(WorkflowDisplayConstants.WORKFLOW_RENDERSTATE_STATUS_KEY,
			        status);
			String lqbURL = userProfileService.getLQBUrl(userID, loanID);
			if (lqbURL != null) {
				map.put(WorkflowDisplayConstants.RESPONSE_URL_KEY, lqbURL);
			}
			LoanVO loanVO = loanService.getLoanByID(loanID);
			if (loanVO != null && loanVO.getLqbFileId() != null) {
				map.put(WorkflowDisplayConstants.WORKFLOW_LQB_FILE_KEY,
				        loanVO.getLqbFileId());
			}
		}

		return utils.getJsonStringOfMap(map);
	}

	@Override
	public String getRenderInfoForAppraisal(int loanID) {
		LOG.debug("Inside method getRenderStateInfoForAppraisal");
		HashMap<String, Object> map = new HashMap<String, Object>();
		Loan loan = new Loan(loanID);
		LoanMilestone loanMilestone = loanService.findLoanMileStoneByLoan(loan,
		        Milestones.APPRAISAL.getMilestoneKey());
		String status = "Pending";
		if (loanMilestone != null) {
			status = loanMilestone.getComments().toString();
			MasterNeedsEnum needURLItem = MasterNeedsEnum.Appraisal_Report;
			NeedsListMaster needsListMaster = new NeedsListMaster();
			needsListMaster.setId(Integer.parseInt(needURLItem.getIndx()));
			LoanNeedsList loanNeedsList = needsListService.findNeedForLoan(
			        loan, needsListMaster);
			if (loanNeedsList != null
			        && loanNeedsList.getUploadFileId() != null) {
				map.put(WorkflowDisplayConstants.RESPONSE_URL_KEY,
				        loanNeedsList.getUploadFileId().getUuidFileId());
			}

		}
		map.put(WorkflowDisplayConstants.WORKFLOW_RENDERSTATE_STATUS_KEY,
		        status);
		return utils.getJsonStringOfMap(map);

	}
}
