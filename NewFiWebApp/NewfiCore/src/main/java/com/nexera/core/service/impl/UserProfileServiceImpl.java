package com.nexera.core.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.nexera.common.dao.UserProfileDao;
import com.nexera.common.entity.CustomerDetail;
import com.nexera.common.entity.User;
import com.nexera.common.entity.UserRole;
import com.nexera.common.vo.CustomerDetailVO;
import com.nexera.common.vo.UserRoleVO;
import com.nexera.common.vo.UserVO;
import com.nexera.core.service.UserProfileService;

@Component
@Transactional
public class UserProfileServiceImpl implements UserProfileService {

	@Autowired
	private UserProfileDao userProfileDao;

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

		userVO.setUserRole(UserProfileServiceImpl.buildUserRoleVO(user
				.getUserRole()));

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
		return null;
	}

	public List<UserVO> searchUsersByName(String name, UserRoleVO roleVO) {

		UserRole role = UserProfileServiceImpl.parseUserRoleModel(roleVO);
		return LoanServiceImpl.buildUserVOList(userProfileDao
				.searchUsersByName(name, role));

	}

	public static UserRoleVO buildUserRoleVO(UserRole role) {

		if (role == null)
			return null;

		UserRoleVO roleVO = new UserRoleVO();

		roleVO.setId(role.getId());
		roleVO.setRoleCd(role.getRoleCd());
		roleVO.setLabel(role.getLabel());
		roleVO.setRoleDescription(role.getRoleDescription());

		return roleVO;

	}

	public static UserRole parseUserRoleModel(UserRoleVO roleVO) {

		if (roleVO == null)
			return null;

		UserRole role = new UserRole();

		role.setId(roleVO.getId());
		role.setRoleCd(roleVO.getRoleCd());
		role.setLabel(roleVO.getLabel());
		role.setRoleDescription(roleVO.getRoleDescription());

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

		Integer rowCount = userProfileDao.completeCustomerDetails(customerDetail);
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

		Integer rowCount = userProfileDao.managerUpdateUCustomerDetails(customerDetail);
		return rowCount;
	}



	public static UserVO buildUserVO(User user) {

		if (user == null)
			return null;

		UserVO userVO = new UserVO();

		userVO.setId(user.getId());
		userVO.setFirstName(user.getFirstName());
		userVO.setLastName(user.getLastName());
		userVO.setEmailId(user.getEmailId());
		userVO.setPhoneNumber(user.getPhoneNumber());
		userVO.setPhotoImageUrl(user.getPhotoImageUrl());

		userVO.setUserRole(UserProfileServiceImpl.buildUserRoleVO(user
				.getUserRole()));

		return userVO;
	}

	public static User parseUserModel(UserVO userVO) {

		if (userVO == null)
			return null;
		User userModel = new User();

		userModel.setId(userVO.getId());
		userModel.setFirstName(userVO.getFirstName());
		userModel.setLastName(userVO.getLastName());
		userModel.setUsername(userVO.getUsername());
		userModel.setEmailId(userVO.getEmailId());
		userModel.setPhoneNumber(userVO.getPhoneNumber());
		userModel.setPhotoImageUrl(userVO.getPhotoImageUrl());

		userModel.setUserRole(UserProfileServiceImpl.parseUserRoleModel(userVO
				.getUserRole()));

		return userModel;
	}

	@Override
	public UserVO createUser(UserVO userVO) {

		Integer userID = (Integer) userProfileDao.save(UserProfileServiceImpl
				.parseUserModel(userVO));
		User user = null;
		if (userID != null && userID > 0)
			user = (User) userProfileDao.load(User.class, userID);

		return UserProfileServiceImpl.buildUserVO(user);
	}

}
