package com.nexera.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.nexera.common.commons.WorkflowConstants;
import com.nexera.common.vo.CommonResponseVO;

import com.nexera.core.service.LoanService;

import com.nexera.common.vo.MilestoneNotificationVO;

import com.nexera.web.rest.util.RestUtil;
import com.nexera.workflow.engine.EngineTrigger;
import com.nexera.workflow.enums.WorkflowItemStatus;
import com.nexera.workflow.service.WorkflowService;
import com.nexera.workflow.vo.WorkflowItemExecVO;
import com.nexera.workflow.vo.WorkflowVO;


@RestController
@RequestMapping ( value = "/workflow/")
public class WorkflowRestService
{

    private WorkflowService workflowService;

    @Autowired
    private EngineTrigger engineTrigger;

    @Autowired
    private LoanService loanService;
    private static final Logger LOG = LoggerFactory.getLogger( WorkflowRestService.class );


    @RequestMapping ( value = "create/{loanID}", method = RequestMethod.GET)
    public @ResponseBody CommonResponseVO createWorkflow( @PathVariable int loanID )
    {

        LOG.debug( "Loan ID for this workflow is " + loanID );
        CommonResponseVO response = null;
        try {
            WorkflowVO workflowVO = new WorkflowVO();
            LOG.debug( "Putting loan manager workflow into execution  " );
            workflowVO.setWorkflowType( WorkflowConstants.LOAN_MANAGER_WORKFLOW_TYPE );
            Gson gson = new Gson();
            int loanManagerWFID = engineTrigger.triggerWorkFlow( gson.toJson( workflowVO ) );

            LOG.debug( "Putting customer workflow into execution  " );
            workflowVO.setWorkflowType( WorkflowConstants.CUSTOMER_WORKFLOW_TYPE );
            int customerWFID = engineTrigger.triggerWorkFlow( gson.toJson( workflowVO ) );


            loanService.saveWorkflowInfo( loanID, customerWFID, loanManagerWFID );

            String successMessage = "The Loan " + loanID + " has been put into execution ";
            response = RestUtil.wrapObjectForSuccess( successMessage );
            LOG.debug( "Response" + response );
        } catch ( Exception e ) {
            LOG.error( e.getMessage() );
            response = RestUtil.wrapObjectForFailure( null, "500", e.getMessage() );
        }
        return response;
    }


    // workflow/3/milestone/state/workflowIte

    @RequestMapping ( value = "{loanId}/milestone/", method = RequestMethod.GET)
    public @ResponseBody CommonResponseVO getWorkflowItemStateInfo( @PathVariable int loanId,
        @RequestParam ( value = "workflowItemId") Integer workflowItemId )
    {

        LOG.info( "workflowItemExecId----" + workflowItemId );
        CommonResponseVO response = null;
        try {

            LOG.info( "loanId----" + loanId );
            /*String stateInfo = "";// Make a call to Workflow Engine which will call the renderStateInfo
            // to the work flow engine pass the loanId.. as Object[]..
            */String[] params = new String[1];
            params[0] = String.valueOf( loanId );
            String stateInfo = engineTrigger.getRenderStateInfoOfItem( workflowItemId, params );
            response = RestUtil.wrapObjectForSuccess( stateInfo );
            LOG.debug( "Response" + response );
        } catch ( Exception e ) {
            LOG.error( e.getMessage() );
            response = RestUtil.wrapObjectForFailure( null, "500", e.getMessage() );
        }
        return response;
    }


    @RequestMapping ( value = "{workflowId}", method = RequestMethod.GET)
    public @ResponseBody CommonResponseVO getWorkflowItems( @PathVariable int workflowId )
    {
        LOG.info( "workflowId----" + workflowId );
        CommonResponseVO response = null;
        try {
            // List<WorkflowItemExec> list =
            // workflowService.getWorkflowItemListByParentWorkflowExecItem(workflowId);
            List<WorkflowItemExecVO> list = new ArrayList<WorkflowItemExecVO>();
            int numberOrder = 1;
            WorkflowItemExecVO workflowItemExecVO = new WorkflowItemExecVO();
            workflowItemExecVO.setStatus( WorkflowItemStatus.NOT_STARTED.getStatusValue() );
            workflowItemExecVO.setSuccess( true );
            workflowItemExecVO.setId( numberOrder++ );
            workflowItemExecVO.setDisplayContent( "Make Initial Contact" );
            workflowItemExecVO.setStateInfo( "Schedule an Alert" );
            list.add( workflowItemExecVO );

            WorkflowItemExecVO childWorkflowItemExecVO = new WorkflowItemExecVO();
            childWorkflowItemExecVO.setStatus( WorkflowItemStatus.COMPLETED.getStatusValue() );
            childWorkflowItemExecVO.setSuccess( true );
            childWorkflowItemExecVO.setId( numberOrder++ );
            childWorkflowItemExecVO.setDisplayContent( "Child for one" );
            childWorkflowItemExecVO.setParentWorkflowItemExec( workflowItemExecVO );
            list.add( childWorkflowItemExecVO );

            workflowItemExecVO = new WorkflowItemExecVO();
            workflowItemExecVO.setStatus( WorkflowItemStatus.COMPLETED.getStatusValue() );
            workflowItemExecVO.setSuccess( true );
            workflowItemExecVO.setDisplayContent( "System Education" );
            workflowItemExecVO.setId( numberOrder++ );
            list.add( workflowItemExecVO );
            // make some child workflow items

            childWorkflowItemExecVO = new WorkflowItemExecVO();
            childWorkflowItemExecVO.setStatus( WorkflowItemStatus.COMPLETED.getStatusValue() );
            childWorkflowItemExecVO.setSuccess( true );
            childWorkflowItemExecVO.setId( numberOrder++ );
            childWorkflowItemExecVO.setDisplayContent( "Rates" );
            childWorkflowItemExecVO.setParentWorkflowItemExec( workflowItemExecVO );
            list.add( childWorkflowItemExecVO );

            WorkflowItemExecVO childWorkflowItemExecVO2 = new WorkflowItemExecVO();
            childWorkflowItemExecVO2.setStatus( WorkflowItemStatus.COMPLETED.getStatusValue() );
            childWorkflowItemExecVO2.setSuccess( true );
            childWorkflowItemExecVO2.setId( numberOrder++ );
            childWorkflowItemExecVO2.setDisplayContent( "Application" );
            childWorkflowItemExecVO2.setParentWorkflowItemExec( workflowItemExecVO );
            list.add( childWorkflowItemExecVO2 );

            childWorkflowItemExecVO2 = new WorkflowItemExecVO();
            childWorkflowItemExecVO2.setStatus( WorkflowItemStatus.COMPLETED.getStatusValue() );
            childWorkflowItemExecVO2.setSuccess( true );
            childWorkflowItemExecVO2.setId( numberOrder++ );
            childWorkflowItemExecVO2.setDisplayContent( "Communication" );
            childWorkflowItemExecVO2.setParentWorkflowItemExec( workflowItemExecVO );
            list.add( childWorkflowItemExecVO2 );

            childWorkflowItemExecVO2 = new WorkflowItemExecVO();
            childWorkflowItemExecVO2.setStatus( WorkflowItemStatus.COMPLETED.getStatusValue() );
            childWorkflowItemExecVO2.setSuccess( true );
            childWorkflowItemExecVO2.setId( numberOrder++ );
            childWorkflowItemExecVO2.setDisplayContent( "Needs List/ Documents" );
            childWorkflowItemExecVO2.setParentWorkflowItemExec( workflowItemExecVO );
            list.add( childWorkflowItemExecVO2 );

            childWorkflowItemExecVO2 = new WorkflowItemExecVO();
            childWorkflowItemExecVO2.setStatus( WorkflowItemStatus.COMPLETED.getStatusValue() );
            childWorkflowItemExecVO2.setSuccess( true );
            childWorkflowItemExecVO2.setId( numberOrder++ );
            childWorkflowItemExecVO2.setDisplayContent( "Loan Progress" );
            childWorkflowItemExecVO2.setParentWorkflowItemExec( workflowItemExecVO );
            list.add( childWorkflowItemExecVO2 );

            childWorkflowItemExecVO2 = new WorkflowItemExecVO();
            childWorkflowItemExecVO2.setStatus( WorkflowItemStatus.COMPLETED.getStatusValue() );
            childWorkflowItemExecVO2.setSuccess( true );
            childWorkflowItemExecVO2.setId( numberOrder++ );
            childWorkflowItemExecVO2.setDisplayContent( "Profile" );
            childWorkflowItemExecVO2.setParentWorkflowItemExec( workflowItemExecVO );
            list.add( childWorkflowItemExecVO2 );

            /*
             * workflowItemExecVO = new WorkflowItemExecVO();
             * workflowItemExecVO.setStatus(WorkflowItemStatus.IN_PROGRESS
             * .getStatusValue()); workflowItemExecVO.setSuccess(true);
             * workflowItemExecVO.setDisplayContent("1003 Complete");
             * workflowItemExecVO.setId(numberOrder++);
             * list.add(workflowItemExecVO);
             * 
             * workflowItemExecVO = new WorkflowItemExecVO();
             * workflowItemExecVO.setStatus(WorkflowItemStatus.NOT_STARTED
             * .getStatusValue()); workflowItemExecVO.setSuccess(true);
             * workflowItemExecVO.setDisplayContent("Credit Bureau");
             * workflowItemExecVO.setId(numberOrder++);
             * list.add(workflowItemExecVO);
             * 
             * workflowItemExecVO = new WorkflowItemExecVO();
             * workflowItemExecVO.setStatus(WorkflowItemStatus.NOT_STARTED
             * .getStatusValue()); workflowItemExecVO.setSuccess(true);
             * workflowItemExecVO.setId(numberOrder++);
             * workflowItemExecVO.setDisplayContent("Needed Items");
             * list.add(workflowItemExecVO);
             */
            response = RestUtil.wrapObjectForSuccess( list );
            LOG.debug( "Response" + list.size() );
        } catch ( Exception e ) {
            LOG.error( e.getMessage() );
            response = RestUtil.wrapObjectForFailure( null, "500", e.getMessage() );
        }
        return response;
    }
    
    @RequestMapping(value = "/milestone/alert", method = RequestMethod.POST)
    public @ResponseBody CommonResponseVO getWorkflowItemStateInfo(

    @RequestBody String milestoneNotificationStr) {

        LOG.info("milestoneNotificationStr----" + milestoneNotificationStr);
        CommonResponseVO response = null;
        try {

            Gson gson = new Gson();
            MilestoneNotificationVO milestoneNoticationVO = gson.fromJson(
                    milestoneNotificationStr, MilestoneNotificationVO.class);
            LOG.info("workflowItem ID"
                    + milestoneNoticationVO.getWorkflowItemId());
            String stateInfo = "";// Make a call to Workflow Engine which will
                                  // call the renderStateInfo
            // to the work flow engine pass the loanId.. as Object[]..

            response = RestUtil.wrapObjectForSuccess(stateInfo);
            LOG.debug("Response" + response);
        } catch (Exception e) {
            LOG.error(e.getMessage());
            response = RestUtil.wrapObjectForFailure(null, "500",
                    e.getMessage());
        }
        return response;
    }
}
