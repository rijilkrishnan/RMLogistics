package com.nexera.core.service.impl;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.nexera.common.commons.CommonConstants;
import com.nexera.common.dao.UserProfileDao;
import com.nexera.common.entity.CustomerDetail;
import com.nexera.common.entity.InternalUserDetail;
import com.nexera.common.entity.InternalUserRoleMaster;
import com.nexera.common.entity.User;
import com.nexera.common.entity.UserRole;
import com.nexera.common.exception.DatabaseException;
import com.nexera.common.exception.InvalidInputException;
import com.nexera.common.exception.NoRecordsFetchedException;
import com.nexera.common.exception.UndeliveredEmailException;
import com.nexera.common.vo.CustomerDetailVO;
import com.nexera.common.vo.InternalUserDetailVO;
import com.nexera.common.vo.InternalUserRoleMasterVO;
import com.nexera.common.vo.UserRoleVO;
import com.nexera.common.vo.UserVO;
import com.nexera.common.vo.email.EmailRecipientVO;
import com.nexera.common.vo.email.EmailVO;
import com.nexera.core.service.SendGridEmailService;
import com.nexera.core.service.UserProfileService;

@Component
@Transactional
public class UserProfileServiceImpl implements UserProfileService, InitializingBean {

	@Autowired
	private UserProfileDao userProfileDao;
	
	@Autowired
	private SendGridEmailService sendGridEmailService;
	
	@Value("${NEW_USER_TEMPLATE_ID}")
	private String newUserMailTemplateId; 
	
	private SecureRandom randomGenerator;
	
	private static final Logger LOG = LoggerFactory.getLogger(UserProfileServiceImpl.class);


	@Override
	public UserVO findUser(Integer userid) {

		User user = userProfileDao.findByUserId(userid);

		UserVO userVO = new UserVO();

		userVO.setId(user.getId());
		userVO.setFirstName(user.getFirstName());
		userVO.setLastName(user.getLastName());
		userVO.setEmailId(user.getEmailId());
		userVO.setPhoneNumber(user.getPhoneNumber());
		userVO.setPhotoImageUrl(user.getPhotoImageUrl());

		userVO.setUserRole(this.buildUserRoleVO(user.getUserRole()));

		CustomerDetail customerDetail = user.getCustomerDetail();
		CustomerDetailVO customerDetailVO = new CustomerDetailVO();
		if (customerDetail != null) {
			customerDetailVO.setId(customerDetail.getId());
			customerDetailVO.setAddressCity(customerDetail.getAddressCity());
			customerDetailVO.setAddressState(customerDetail.getAddressState());
			customerDetailVO.setAddressZipCode(customerDetail
			        .getAddressZipCode());
			customerDetailVO.setSecPhoneNumber(customerDetail
			        .getSecPhoneNumber());
			customerDetailVO.setSecEmailId(customerDetail.getSecEmailId());
			if (customerDetail.getDateOfBirth() != null) {
				customerDetailVO.setDateOfBirth(customerDetail.getDateOfBirth()
				        .getTime());
			}

			customerDetailVO.setProfileCompletionStatus(customerDetail
			        .getProfileCompletionStatus());

		}

		userVO.setCustomerDetail(customerDetailVO);

		return userVO;
	}

	@Override
	public Integer updateUser(UserVO userVO) {

		User user = new User();

		user.setId(userVO.getId());
		user.setFirstName(userVO.getFirstName());
		user.setLastName(userVO.getLastName());
		user.setEmailId(userVO.getEmailId());
		user.setPhoneNumber(userVO.getPhoneNumber());
		user.setPhotoImageUrl(userVO.getPhotoImageUrl());

		Integer userVOObj = userProfileDao.updateUser(user);

		return userVOObj;
	}

	@Override
	public Integer updateCustomerDetails(UserVO userVO) {

		CustomerDetailVO customerDetailVO = userVO.getCustomerDetail();
		CustomerDetail customerDetail = new CustomerDetail();

		customerDetail.setId(customerDetailVO.getId());
		customerDetail.setAddressCity(customerDetailVO.getAddressCity());
		customerDetail.setAddressState(customerDetailVO.getAddressState());
		customerDetail.setAddressZipCode(customerDetailVO.getAddressZipCode());
		customerDetail.setSecPhoneNumber(customerDetailVO.getSecPhoneNumber());
		customerDetail.setSecEmailId(customerDetailVO.getSecEmailId());
		if (customerDetailVO.getDateOfBirth() != null) {
			customerDetail.setDateOfBirth(new Date(customerDetailVO
			        .getDateOfBirth()));
		} else {
			customerDetail.setDateOfBirth(null);
		}
		customerDetail.setProfileCompletionStatus(customerDetailVO
		        .getProfileCompletionStatus());

		Integer customerDetailVOObj = userProfileDao
		        .updateCustomerDetails(customerDetail);
		return customerDetailVOObj;
	}

	@Override
	public Integer updateUser(String s3ImagePath, Integer userid) {

		Integer number = userProfileDao.updateUser(s3ImagePath, userid);
		return number;
	}

	public List<UserVO> searchUsers(UserVO userVO) {

		return this.buildUserVOList(userProfileDao
		        .searchUsers(parseUserModel(userVO)));

	}

	@Override
	public List<UserVO> buildUserVOList(List<User> userList) {

		if (userList == null)
			return null;

		List<UserVO> voList = new ArrayList<UserVO>();
		for (User user : userList) {
			voList.add(this.buildUserVO(user));
		}

		return voList;
	}

	public UserRoleVO buildUserRoleVO(UserRole role) {

		if (role == null)
			return null;

		UserRoleVO roleVO = new UserRoleVO();

		roleVO.setId(role.getId());
		roleVO.setRoleCd(role.getRoleCd());
		roleVO.setLabel(role.getLabel());
		roleVO.setRoleDescription(role.getRoleDescription());

		return roleVO;

	}

	private UserRole parseUserRoleModel(UserRoleVO roleVO) {

		UserRole role = new UserRole();
		
		if (roleVO == null){
			
			role.setId(1);
		}else{
			
			role.setId(roleVO.getId());
			role.setRoleCd(roleVO.getRoleCd());
			role.setLabel(roleVO.getLabel());
			role.setRoleDescription(roleVO.getRoleDescription());
		}

		return role;

	}

	@Override
	public Integer competeUserProfile(UserVO userVO) {

		User user = new User();

		user.setId(userVO.getId());
		user.setFirstName(userVO.getFirstName());
		user.setLastName(userVO.getLastName());
		user.setEmailId(userVO.getEmailId());
		user.setPhoneNumber(userVO.getPhoneNumber());

		Integer rowCount = userProfileDao.competeUserProfile(user);

		return rowCount;
	}

	@Override
	public Integer completeCustomerDetails(UserVO userVO) {

		CustomerDetailVO customerDetailVO = userVO.getCustomerDetail();
		CustomerDetail customerDetail = new CustomerDetail();

		customerDetail.setId(customerDetailVO.getId());
		customerDetail.setAddressCity(customerDetailVO.getAddressCity());
		customerDetail.setAddressState(customerDetailVO.getAddressState());
		customerDetail.setAddressZipCode(customerDetailVO.getAddressZipCode());
		customerDetail.setSecPhoneNumber(customerDetailVO.getSecPhoneNumber());
		customerDetail.setSecEmailId(customerDetailVO.getSecEmailId());

		if (customerDetailVO.getDateOfBirth() != null) {
			customerDetail.setDateOfBirth(new Date(customerDetailVO
			        .getDateOfBirth()));
		} else {
			customerDetail.setDateOfBirth(null);
		}
		customerDetail.setProfileCompletionStatus(customerDetailVO
		        .getProfileCompletionStatus());

		Integer rowCount = userProfileDao
		        .completeCustomerDetails(customerDetail);
		return rowCount;
	}

	@Override
	public Integer managerUpdateUserProfile(UserVO userVO) {

		User user = new User();

		user.setId(userVO.getId());
		user.setFirstName(userVO.getFirstName());
		user.setLastName(userVO.getLastName());
		user.setEmailId(userVO.getEmailId());
		user.setPhoneNumber(userVO.getPhoneNumber());

		Integer rowCount = userProfileDao.managerUpdateUserProfile(user);

		return rowCount;
	}

	@Override
	public Integer managerUpdateUCustomerDetails(UserVO userVO) {

		CustomerDetailVO customerDetailVO = userVO.getCustomerDetail();
		CustomerDetail customerDetail = new CustomerDetail();

		customerDetail.setId(customerDetailVO.getId());
		customerDetail.setAddressCity(customerDetailVO.getAddressCity());
		customerDetail.setAddressState(customerDetailVO.getAddressState());
		customerDetail.setAddressZipCode(customerDetailVO.getAddressZipCode());
		customerDetail.setSecPhoneNumber(customerDetailVO.getSecPhoneNumber());
		customerDetail.setSecEmailId(customerDetailVO.getSecEmailId());

		if (customerDetailVO.getDateOfBirth() != null) {
			customerDetail.setDateOfBirth(new Date(customerDetailVO
			        .getDateOfBirth()));
		} else {
			customerDetail.setDateOfBirth(null);
		}
		customerDetail.setProfileCompletionStatus(customerDetailVO
		        .getProfileCompletionStatus());

		Integer rowCount = userProfileDao
		        .managerUpdateUCustomerDetails(customerDetail);
		return rowCount;
	}

	@Override
	public UserVO buildUserVO(User user) {

		if (user == null)
			return null;

		UserVO userVO = new UserVO();

		userVO.setId(user.getId());
		userVO.setFirstName(user.getFirstName());
		userVO.setLastName(user.getLastName());
		userVO.setEmailId(user.getEmailId());
		userVO.setPhoneNumber(user.getPhoneNumber());
		userVO.setPhotoImageUrl(user.getPhotoImageUrl());
		
		userVO.setPassword(user.getPassword());
		userVO.setUsername(user.getUsername());
		userVO.setStatus(user.getStatus());

		userVO.setUserRole(this.buildUserRoleVO(user.getUserRole()));
		//userVO.setCustomerDetail(buildCustomerDetailVO(user.getCustomerDetail()));
		userVO.setInternalUserDetail(this.buildInternalUserDetailsVO(user.getInternalUserDetail()));

		return userVO;
	}

	public CustomerDetailVO buildCustomerDetailVO(CustomerDetail customerDetail) {
		

			if (customerDetail == null)
				return null;

			CustomerDetailVO customerDetailVO = new CustomerDetailVO();

			customerDetailVO.setId(customerDetail.getId());
			customerDetailVO.setAddressCity(customerDetail.getAddressCity());
			customerDetailVO.setAddressState(customerDetail.getAddressState());
			customerDetailVO.setAddressZipCode(customerDetail.getAddressZipCode());
			customerDetailVO.setDateOfBirth(customerDetail.getDateOfBirth().getTime());
			customerDetailVO.setSsn(customerDetail.getSsn());
			customerDetailVO.setSecPhoneNumber(customerDetail.getSecPhoneNumber());
			customerDetailVO.setSecEmailId(customerDetail.getSecEmailId());
			customerDetailVO.setProfileCompletionStatus(customerDetail.getProfileCompletionStatus());
			
			return customerDetailVO;	
    }


	@Override
	public User parseUserModel(UserVO userVO) {

		if (userVO == null)
			return null;
		User userModel = new User();

		userModel.setId(userVO.getId());
		userModel.setFirstName(userVO.getFirstName());
		userModel.setLastName(userVO.getLastName());
		userModel.setUsername(userVO.getEmailId());
		userModel.setEmailId(userVO.getEmailId());
		
		userModel.setPassword(userVO.getPassword());
		userModel.setStatus(userVO.getStatus());
		
		CustomerDetail customerDetail = new CustomerDetail();
		customerDetail.setSubscriptionsStatus(2);		
		userModel.setCustomerDetail(customerDetail);

		userModel.setPhoneNumber(userVO.getPhoneNumber());
		userModel.setPhotoImageUrl(userVO.getPhotoImageUrl());

		userModel.setUserRole(this.parseUserRoleModel(userVO.getUserRole()));

		userModel.setInternalUserDetail(this.parseInternalUserDetailsModel(userVO.getInternalUserDetail()));

		return userModel;
	}

	@Override
	public UserVO createUser(UserVO userVO) {
		
		User user = this.parseUserModel(userVO);
		user.setStatus(true);

		Integer userID = (Integer) userProfileDao.saveUserWithDetails(this.parseUserModel(userVO));
		if (userID != null && userID > 0)
			user = (User) userProfileDao.findInternalUser(userID);

		return this.buildUserVO(user);
	}

	@Override
	public InternalUserDetailVO buildInternalUserDetailsVO(
	        InternalUserDetail internalUserDetail) {
		// TODO Auto-generated method stub

		if (internalUserDetail == null)
			return null;

		InternalUserDetailVO detailVO = new InternalUserDetailVO();
		detailVO.setInternalUserRoleMasterVO(buildInternalUserRoleMasterVO(internalUserDetail
		        .getInternaUserRoleMaster()));

		return detailVO;
	}

	private InternalUserRoleMasterVO buildInternalUserRoleMasterVO(
	        InternalUserRoleMaster internal) {
		if (internal == null)
			return null;

		InternalUserRoleMasterVO masterVO = new InternalUserRoleMasterVO();
		masterVO.setId(internal.getId());
		masterVO.setRoleName(internal.getRoleName());
		masterVO.setRoleDescription(internal.getRoleDescription());

		return masterVO;
	}

	private InternalUserDetail parseInternalUserDetailsModel(
	        InternalUserDetailVO internalUserDetailVO) {
		// TODO Auto-generated method stub

		if (internalUserDetailVO == null)
			return null;

		InternalUserDetail detail = new InternalUserDetail();
		detail.setInternaUserRoleMaster(parseInternalUserRoleMasterModel(internalUserDetailVO
		        .getInternalUserRoleMasterVO()));

		return detail;
	}

	private InternalUserRoleMaster parseInternalUserRoleMasterModel(
	        InternalUserRoleMasterVO internalVO) {
		if (internalVO == null)
			return null;

		InternalUserRoleMaster master = new InternalUserRoleMaster();
		master.setId(internalVO.getId());
		master.setRoleDescription(internalVO.getRoleDescription());

		return master;
	}

	@Override
	public UserVO loadInternalUser(Integer userID) {
		// TODO Auto-generated method stub
		return this.buildUserVO(userProfileDao.findInternalUser(userID));
	}

	@Override
	public void disableUser(int userId) throws NoRecordsFetchedException {
		
		User user = userProfileDao.findByUserId(userId);
		if( user == null){
			throw new NoRecordsFetchedException("User not found in the user table");
		}
		
		user.setStatus(false);
		userProfileDao.update(user);
	}
	
	@Override
	public void enableUser(int userId) throws NoRecordsFetchedException {
		
		User user = userProfileDao.findByUserId(userId);
		if( user == null){
			throw new NoRecordsFetchedException("User not found in the user table");
		}
		
		user.setStatus(true);
		userProfileDao.update(user);
	}
	
	private String generateRandomPassword(){
		return new BigInteger( CommonConstants.RANDOM_PASSWORD_LENGTH * 5, randomGenerator).toString(32);
	}
	
	private void sendNewUserEmail(User user) throws InvalidInputException, UndeliveredEmailException{
		
		EmailVO emailEntity = new EmailVO();
		EmailRecipientVO recipientVO = new EmailRecipientVO();
		
		//We create the substitutions map
		Map<String, String[]> substitutions = new HashMap<String, String[]>();
		substitutions.put("-name-", new String[]{user.getFirstName() + " " + user.getLastName()});
		substitutions.put("-username-", new String[]{user.getUsername()});
		substitutions.put("-password-", new String[]{user.getPassword()});
		
		recipientVO.setEmailID(user.getEmailId());
		emailEntity.setRecipients(new ArrayList<EmailRecipientVO>(Arrays.asList(recipientVO)));
		emailEntity.setSenderEmailId(CommonConstants.SENDER_EMAIL_ID);
		emailEntity.setSenderName(CommonConstants.SENDER_NAME);
		emailEntity.setSubject("You have been subscribed to Nexera");
		emailEntity.setTokenMap(substitutions);
		emailEntity.setTemplateId(newUserMailTemplateId);

		sendGridEmailService.sendMail(emailEntity);
	}

	@Override
	public UserVO createNewUserAndSendMail(UserVO userVO) throws InvalidInputException, UndeliveredEmailException {
		LOG.info("createNewUserAndSendMail called!");
		LOG.debug("PArsing the VO");
		User newUser = parseUserModel(userVO);
		newUser.setStatus(true);
		LOG.debug("Done parsing, Setting a new random password");
		newUser.setPassword(generateRandomPassword());	
		LOG.debug("Saving the user to the database");
		int userID = userProfileDao.saveUserWithDetails(newUser);
		LOG.debug("Saved, sending the email");
		sendNewUserEmail(newUser);
		newUser = null;
		if (userID > 0)
			newUser = (User) userProfileDao.findInternalUser(userID);
		LOG.info("Returning the userVO");
		return this.buildUserVO(newUser);
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		randomGenerator = new SecureRandom();
	}

	@Override
	public void deleteUser(int userId) {
		// TODO Auto-generated method stub
		
	}

	public User findUserByMail(String userMailAddress) {

		User user = null;
		
		try {
			user = userProfileDao.findByUserName(userMailAddress);
			

		} catch (DatabaseException e) {

		} catch (NoRecordsFetchedException e) {

		}
		return user;
	}
	
	/**
	 * This method is use to create a recode of the user in the user table when the user as a shopper comes from the customer engagement path 
	 * 
	 */
	@Override
    public UserVO saveUser(UserVO userVO) {
	  
		// 1st create a entry in the customer details table 
		// use that id to put in the user table .
		
		Integer userID = (Integer) userProfileDao.saveCustomerDetails(this.parseUserVO(userVO));
		User user = null;
		if (userID != null && userID > 0)
			user = (User) userProfileDao.findInternalUser(userID);

		return this.buildUserVO(user);
		
    }
	
	
	public User parseUserVO(UserVO userVO) {

		if (userVO == null)
			return null;
		User userModel = new User();

		//userModel.setId(userVO.getId());
		userModel.setFirstName(userVO.getFirstName());
		userModel.setLastName(userVO.getLastName());
		userModel.setUsername(userVO.getEmailId().split(":")[0]);
		userModel.setEmailId(userVO.getEmailId().split(":")[0]);
		
		userModel.setPassword("abc123");
		userModel.setStatus(true);

		userModel.setPhoneNumber(userVO.getPhoneNumber());
		userModel.setPhotoImageUrl(userVO.getPhotoImageUrl());

		userModel.setUserRole(this.parseUserRoleModel(userVO.getUserRole()));
		
		CustomerDetail customerDetail = new CustomerDetail();
		customerDetail.setSubscriptionsStatus(2);
		
		userModel.setCustomerDetail(customerDetail);
		userModel.setInternalUserDetail(this.parseInternalUserDetailsModel(userVO.getInternalUserDetail()));

		return userModel;
	}

	@Override
    public UserVO convertTOUserVO(User user) {
		
		if (user == null)
			return null;
		UserVO userVO = new UserVO();

		userVO.setId(user.getId());
		userVO.setFirstName(user.getFirstName());
		userVO.setLastName(user.getLastName());
		userVO.setUsername(user.getEmailId());
		userVO.setEmailId(user.getEmailId());		
		userVO.setPassword(user.getPassword());
		userVO.setStatus(user.getStatus());
		userVO.setPhoneNumber(user.getPhoneNumber());
		userVO.setPhotoImageUrl(user.getPhotoImageUrl());
		
		CustomerDetailVO customerDetailVO = convertTOCustomerDetailVO(user.getCustomerDetail());
		
		userVO.setCustomerDetail(customerDetailVO);

		userVO.setUserRole(this.convertTOUserRoleVO(user.getUserRole()));

		userVO.setInternalUserDetail(this.convertTOInternalUserDetailVO(user.getInternalUserDetail()));

		return userVO;
    }

	private CustomerDetailVO convertTOCustomerDetailVO(CustomerDetail customerDetail){
		
		if(customerDetail == null)
			return null;
		
		CustomerDetailVO customerDetailVO = new CustomerDetailVO();
		
		customerDetailVO.setId(customerDetail.getId());
		customerDetailVO.setAddressCity(customerDetail.getAddressCity());
		customerDetailVO.setAddressState(customerDetail.getAddressState());
		customerDetailVO.setAddressZipCode(customerDetail.getAddressZipCode());
		if(null!= customerDetail.getDateOfBirth())
		customerDetailVO.setDateOfBirth(customerDetail.getDateOfBirth().getTime());
		customerDetailVO.setProfileCompletionStatus(customerDetail.getProfileCompletionStatus());
		customerDetailVO.setSsn(customerDetail.getSsn());
		customerDetailVO.setSecEmailId(customerDetail.getSecEmailId());
		customerDetailVO.setSecPhoneNumber(customerDetail.getSecEmailId());
		customerDetailVO.setSubscriptionsStatus(customerDetail.getSubscriptionsStatus());
		
		return customerDetailVO;
		
	}
	
	private UserRoleVO convertTOUserRoleVO(UserRole userRole) {

		UserRoleVO userRoleVO = new UserRoleVO();
		
		if (userRole == null){
			
			userRoleVO.setId(1);
		}else{
			
			userRoleVO.setId(userRole.getId());
			userRoleVO.setRoleCd(userRole.getRoleCd());
			userRoleVO.setLabel(userRole.getLabel());
			userRoleVO.setRoleDescription(userRole.getRoleDescription());
		}

		return userRoleVO;

	}
	
	
	private InternalUserDetailVO convertTOInternalUserDetailVO(InternalUserDetail internalUserDetail) {
		// TODO Auto-generated method stub

		if (internalUserDetail == null)
			return null;

		InternalUserDetailVO internalUserDetailVO = new InternalUserDetailVO();
		
		InternalUserRoleMasterVO internalUserRoleMasterVO =convertTOInternalUserRoleMasterVO(internalUserDetail.getInternaUserRoleMaster());
		internalUserDetailVO.setInternalUserRoleMasterVO(internalUserRoleMasterVO);;

		return internalUserDetailVO;
	}

	public List<User> fetchAllActiveUsers() {
		return userProfileDao.fetchAllActiveUsers();
	}


	
	private InternalUserRoleMasterVO convertTOInternalUserRoleMasterVO(InternalUserRoleMaster internalUserRoleMaster){
		
		if (internalUserRoleMaster == null)
			return null;

		InternalUserRoleMasterVO internalUserRoleMasterVO = new InternalUserRoleMasterVO();
		internalUserRoleMasterVO.setId(internalUserRoleMaster.getId());
		internalUserRoleMasterVO.setRoleName(internalUserRoleMaster.getRoleName());
		internalUserRoleMasterVO.setRoleDescription(internalUserRoleMaster.getRoleDescription());

		return internalUserRoleMasterVO;
	}

}
