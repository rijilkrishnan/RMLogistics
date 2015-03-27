package com.nexera.newfi.workflow.customer.tasks;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.nexera.common.dao.LoanDao;
import com.nexera.common.entity.Loan;
import com.nexera.common.entity.User;
import com.nexera.newfi.workflow.WorkflowDisplayConstants;
import com.nexera.workflow.engine.EngineTrigger;
import com.nexera.workflow.task.IWorkflowTaskExecutor;

@Component
public class BankConnectionManager implements IWorkflowTaskExecutor {
	@Autowired
	private LoanDao loanDao;
	@Autowired
	private EngineTrigger engineTrigger;

	@Override
	public String execute(HashMap<String, Object> objectMap) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String renderStateInfo(HashMap<String, Object> inputMap) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String checkStatus(HashMap<String, Object> inputMap) {
		// TODO Auto-generated method stub
		int userId = Integer.parseInt(inputMap.get(
				WorkflowDisplayConstants.USER_ID_KEY_NAME).toString());
		User user = new User();
		user.setId(userId);
		Loan loan = loanDao.getActiveLoanOfUser(user);
		if (loan.getIsBankConnected()) {
			int workflowItemExecId = Integer.parseInt(inputMap.get(
					WorkflowDisplayConstants.WORKITEM_ID_KEY_NAME).toString());
			engineTrigger
					.changeStateOfWorkflowItemExec(workflowItemExecId, "3");
			return "3";
		}
		return null;
	}

	@Override
	public String invokeAction(HashMap<String, Object> inputMap) {
		// TODO Auto-generated method stub
		return null;
	}

}
