package com.nexera.newfi.workflow.customer.tasks;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.nexera.common.commons.WorkflowDisplayConstants;
import com.nexera.common.vo.UserVO;
import com.nexera.core.service.UserProfileService;
import com.nexera.workflow.engine.EngineTrigger;
import com.nexera.workflow.enums.WorkItemStatus;
import com.nexera.workflow.task.IWorkflowTaskExecutor;

@Component
public class SMSPreferenceManager implements IWorkflowTaskExecutor {
	@Autowired
	private UserProfileService userProfileService;

	@Autowired
	private EngineTrigger engineTrigger;

	@Override
	public String execute(HashMap<String, Object> objectMap) {

		return WorkItemStatus.COMPLETED.getStatus();
	}

	@Override
	public String renderStateInfo(HashMap<String, Object> inputMap) {
		// TODO
		return null;
	}

	@Override
	public String checkStatus(HashMap<String, Object> inputMap) {
		int userId = Integer.parseInt(inputMap.get(
		        WorkflowDisplayConstants.USER_ID_KEY_NAME).toString());
		UserVO userVo = userProfileService.findUser(userId);
		if (userVo.getPhoneNumber() != null
		        && userVo.getCustomerDetail() != null
		        && userVo.getCustomerDetail().getMobileAlertsPreference() != null
		        && userVo.getCustomerDetail().getMobileAlertsPreference()) {
			int workflowItemExecId = Integer.parseInt(inputMap.get(
			        WorkflowDisplayConstants.WORKITEM_ID_KEY_NAME).toString());
			engineTrigger.startWorkFlowItemExecution(workflowItemExecId);
			engineTrigger.changeStateOfWorkflowItemExec(workflowItemExecId,
			        WorkItemStatus.COMPLETED.getStatus());
			return WorkItemStatus.COMPLETED.getStatus();
		}
		return null;

	}

	@Override
	public String invokeAction(HashMap<String, Object> inputMap) {
		// TODO Auto-generated method stub
		return null;
	}

	public String updateReminder(HashMap<String, Object> objectMap) {
		// TODO Auto-generated method stub
		return null;
	}

}
