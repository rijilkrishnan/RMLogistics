package com.nexera.newfi.workflow.tasks;

import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.nexera.common.commons.LoanStatus;
import com.nexera.common.commons.WorkflowDisplayConstants;
import com.nexera.common.entity.Loan;
import com.nexera.common.entity.LoanMilestone;
import com.nexera.common.enums.Milestones;
import com.nexera.core.service.LoanService;
import com.nexera.workflow.task.IWorkflowTaskExecutor;

@Component
public class LoanClosureManager extends NexeraWorkflowTask implements
		IWorkflowTaskExecutor {
	private static final Logger LOG = LoggerFactory
			.getLogger(UWStatusManager.class);

	@Autowired
	private LoanService loanService;

	@Override
	public String execute(HashMap<String, Object> objectMap) {
		String status = objectMap.get(
		        WorkflowDisplayConstants.WORKITEM_STATUS_KEY_NAME)
				.toString();
		if (status.equals(LoanStatus.loanClosed)) {
			makeANote(Integer.parseInt(objectMap.get(
					WorkflowDisplayConstants.LOAN_ID_KEY_NAME).toString()),
					LoanStatus.loancClosedMessage);
			sendEmail(objectMap);
		} else if (status.equals(LoanStatus.loanDeclined)) {
			makeANote(Integer.parseInt(objectMap.get(
					WorkflowDisplayConstants.LOAN_ID_KEY_NAME).toString()),
					LoanStatus.loanDeclinedMessage);
			sendEmail(objectMap);
		} else if (status.equals(LoanStatus.loanFunded)) {
			makeANote(Integer.parseInt(objectMap.get(
					WorkflowDisplayConstants.LOAN_ID_KEY_NAME).toString()),
					LoanStatus.loanFundedMessage);
			sendEmail(objectMap);
		}
		return null;
	}

	@Override
	public String renderStateInfo(HashMap<String, Object> inputMap) {
		try {
			Loan loan = new Loan();
			loan.setId(Integer.parseInt(inputMap.get(
					WorkflowDisplayConstants.LOAN_ID_KEY_NAME).toString()));
			LoanMilestone mileStone = loanService.findLoanMileStoneByLoan(loan,
					Milestones.LOAN_CLOSURE.getMilestoneKey());
			return mileStone.getComments().toString();
		} catch (Exception e) {
			LOG.error(e.getMessage());
			return "";
		}
	}

	@Override
	public String checkStatus(HashMap<String, Object> inputMap) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String invokeAction(HashMap<String, Object> inputMap) {
		// TODO Auto-generated method stub
		return null;
	}

}
