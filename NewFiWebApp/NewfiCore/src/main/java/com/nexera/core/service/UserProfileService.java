package com.nexera.core.service;

import java.util.List;

import com.nexera.common.vo.UserRoleVO;
import com.nexera.common.vo.UserVO;

public interface UserProfileService {

	public UserVO findUser(Integer userid);

	public Integer updateUser(UserVO userVO);

	public Integer updateCustomerDetails(UserVO userVO);

	public Integer updateUser(String s3ImagePath, Integer userid);

	public List<UserVO> searchUsersByName(String name, UserRoleVO role);


	public Integer competeUserProfile(UserVO userVO);

	public Integer completeCustomerDetails(UserVO userVO);

	public Integer managerUpdateUserProfile(UserVO userVO);

	public Integer managerUpdateUCustomerDetails(UserVO userVO);

	public UserVO createUser(UserVO userVO);

}
