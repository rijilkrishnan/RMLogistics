package com.nexera.core.service.impl;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.nexera.common.commons.Utils;
import com.nexera.common.commons.WebServiceOperations;
import com.nexera.common.entity.InternalUserDetail;
import com.nexera.common.entity.User;
import com.nexera.common.vo.InternalUserDetailVO;
import com.nexera.common.vo.LoanAppFormVO;
import com.nexera.common.vo.LoanTeamListVO;
import com.nexera.common.vo.LoanTeamVO;
import com.nexera.common.vo.UserVO;
import com.nexera.core.lqb.broker.LqbInvoker;
import com.nexera.core.service.LoanService;
import com.nexera.core.service.LqbInterface;
import com.nexera.core.service.UserProfileService;
import com.nexera.core.utility.NexeraCacheableMethodInterface;
import com.nexera.core.utility.NexeraUtility;

@Component("lqbCacheInvoker")
public class LqbCacheInvoker implements LqbInterface {

	@Value("${muleUrlForLoan}")
	private String muleUrlForLoan;

	@Autowired
	NexeraUtility nexeraUtility;

	@Value("${cryptic.key}")
	private String crypticKey;

	@Autowired
	LqbInvoker lqbInvoker;

	@Autowired
	LoanService loanService;

	byte[] salt = { (byte) 0xA9, (byte) 0x9B, (byte) 0xC8, (byte) 0x32,
	        (byte) 0x56, (byte) 0x35, (byte) 0xE3, (byte) 0x03 };

	@Autowired
	Utils utils;
	@Autowired
	NexeraCacheableMethodInterface cacheableMethodInterface;

	@Autowired
	private ApplicationContext applicationContext;

	private static final Logger LOGGER = LoggerFactory
	        .getLogger(LqbCacheInvoker.class);

	@Override
	@Cacheable("teaserRate")
	public HashMap<String, String> invokeRest(String appFormData) {
		HashMap<String, String> map = new HashMap<String, String>();
		try {
			LOGGER.debug("Input to LQB:" + appFormData);
			HttpHeaders headers = new HttpHeaders();
			HttpEntity request = new HttpEntity(appFormData, headers);
			RestTemplate restTemplate = new RestTemplate();
			Date date = new Date();
			LOGGER.debug("Time taken before invoking this rest call for teaser rate is "
			        + date);
			String returnedUser = restTemplate.postForObject(muleUrlForLoan,
			        request, String.class);
			Date date1 = new Date();
			LOGGER.debug("Time taken after invoking this rest call for teaser rate is "
			        + date1);
			JSONObject jsonObject = new JSONObject(returnedUser);
			map.put("responseMessage", jsonObject.get("responseMessage")
			        .toString());
			map.put("responseTime", jsonObject.get("responseTime").toString());
			return map;

		} catch (Exception e) {
			LOGGER.error("Exception caught ", e);
		}

		return null;
	}

	@Override
	public String findSticket(LoanAppFormVO loanAppFormVo)
	        throws InvalidKeyException, NoSuchAlgorithmException,
	        InvalidKeySpecException, NoSuchPaddingException,
	        InvalidAlgorithmParameterException, UnsupportedEncodingException,
	        IllegalBlockSizeException, BadPaddingException, IOException {
		LOGGER.debug("findSticket is called for loan app form for: "
		        + loanAppFormVo.getLoan().getId());
		String sTicket = null;
		String lqbUsername = null;
		String lqbPassword = null;
		String authToken = null;
		Long tokenExpiration = null;
		UserVO internalUser = null;

		boolean loanMangerFound = false;
		LoanTeamListVO loanTeamListVo = loanService
		        .getLoanTeamListForLoan(loanAppFormVo.getLoan());

		List<LoanTeamVO> loanTeam = loanTeamListVo.getLoanTeamList();
		if (null != loanTeam && loanTeam.size() > 0) {
			for (LoanTeamVO loanTeamVo : loanTeam) {
				UserVO user = loanTeamVo.getUser();
				if (null != user.getInternalUserDetail()
				        && user.getInternalUserDetail()
				                .getInternalUserRoleMasterVO().getRoleName()
				                .equalsIgnoreCase("LM")) {
					/* this user would be either realtor or LM */
					internalUser = user;
					LOGGER.debug("Found a LM: " + user.getId()
					        + " on the team for loan: "
					        + loanAppFormVo.getLoan().getId());
					lqbUsername = internalUser.getInternalUserDetail()
					        .getLqbUsername();
					lqbPassword = internalUser.getInternalUserDetail()
					        .getLqbPassword();
					authToken = internalUser.getInternalUserDetail()
					        .getLqbAuthToken();
					tokenExpiration = internalUser.getInternalUserDetail()
					        .getLqbExpiryTime();
					if (lqbUsername != null && lqbPassword != null) {
						loanMangerFound = true;
						LOGGER.debug("Loan manager found for this loan, hence using that for generating ticket: "
						        + lqbUsername
						        + " loan: "
						        + loanAppFormVo.getId());
						break;
					}

				}
			}
		}
		/* This is the case when LM is not found */
		if (!loanMangerFound) {

			LOGGER.debug("loan manager not found for loan with appform: "
			        + loanAppFormVo.getLoan().getId());
			/*
			 * Get Sales manager's information
			 */

			UserProfileService userProfileService = (UserProfileService) applicationContext
			        .getBean("userProfileServiceImpl");
			List<User> salesManagers = userProfileService.geAllSalesManagers();
			if (salesManagers.size() > 0) {
				LOGGER.warn("Code does not handle multiple sales managers. Need to be fixed");
			}

			User salesManager = salesManagers.get(0);
			lqbUsername = salesManager.getInternalUserDetail().getLqbUsername();
			lqbPassword = salesManager.getInternalUserDetail().getLqbPassword();
			authToken = salesManager.getInternalUserDetail().getLqbAuthToken();
			tokenExpiration = salesManager.getInternalUserDetail()
			        .getLqbExpiryTime();

			internalUser = User.convertFromEntityToVO(salesManager);

		}

		// }
		// Here check for Token and Expiration.
		boolean requestForNewToken = false;
		if (authToken == null) {
			requestForNewToken = true;
		} else if (utils.hasTokenExpired(tokenExpiration)) {
			requestForNewToken = true;
		}
		LOGGER.debug("Token for user: " + lqbUsername + " has expired? "
		        + requestForNewToken);
		if (requestForNewToken) {
			// This method can be moved out of cachable interface
			sTicket = findSticket(lqbUsername, lqbPassword);
			if (sTicket != null) {
				saveTokenDetails(internalUser, sTicket,
				        System.currentTimeMillis());
			} else {
				LOGGER.debug("Was not able to generate ticket in first attempt, trying once again");
				sTicket = findSticket(lqbUsername, lqbPassword);
				if (sTicket != null) {
					saveTokenDetails(internalUser, sTicket,
					        System.currentTimeMillis());
				} else {
					LOGGER.error("Failed generating token for LQB user: "
					        + lqbUsername);
				}
			}

		} else {
			// generate use existing from table
			sTicket = authToken; // return the one from the table

		}
		LOGGER.debug("Token that will be used is: " + sTicket);
		return sTicket;
	}

	private void saveTokenDetails(UserVO internalUser, String sTicket,
	        long expirationTime) {
		InternalUserDetailVO internalUserDetailVO = internalUser
		        .getInternalUserDetail();
		if (internalUserDetailVO != null) {
			InternalUserDetail internalUserDetail = InternalUserDetail
			        .convertFromVOToEntity(internalUserDetailVO);
			internalUserDetail.setLqbAuthToken(sTicket);
			internalUserDetail.setLqbExpiryTime(System.currentTimeMillis());
			UserProfileService userProfileService = (UserProfileService) applicationContext
			        .getBean("userProfileServiceImpl");
			userProfileService.updateInternalUserDetails(internalUserDetail);
		}
	}

	@Override
	public String findSticket(String lqbUsername, String lqbPassword) {
		LOGGER.debug("findSticket called for: " + lqbUsername);
		String sTicket = null;
		if (null != lqbUsername && null != lqbPassword) {
			synchronized (lqbUsername) {

				lqbUsername = lqbUsername.replaceAll("[^\\x00-\\x7F]", "");
				try {
					lqbUsername = nexeraUtility.decrypt(salt, crypticKey,
					        lqbUsername);
				} catch (InvalidKeyException | NoSuchAlgorithmException
				        | InvalidKeySpecException | NoSuchPaddingException
				        | InvalidAlgorithmParameterException
				        | IllegalBlockSizeException | BadPaddingException
				        | IOException e) {

					LOGGER.error("Error in decryption : " + lqbUsername, e);
				}

				lqbPassword = lqbPassword.replaceAll("[^\\x00-\\x7F]", "");
				try {
					lqbPassword = nexeraUtility.decrypt(salt, crypticKey,
					        lqbPassword);
				} catch (InvalidKeyException | NoSuchAlgorithmException
				        | InvalidKeySpecException | NoSuchPaddingException
				        | InvalidAlgorithmParameterException
				        | IllegalBlockSizeException | BadPaddingException
				        | IOException e) {

					LOGGER.error("Error in decryption : " + lqbPassword, e);
				}

				org.json.JSONObject authOperationObject = NexeraUtility
				        .createAuthObject(
				                WebServiceOperations.OP_NAME_AUTH_GET_USER_AUTH_TICET,
				                lqbUsername, lqbPassword);
				LOGGER.debug("Invoking LQB service to fetch user authentication ticket ");
				String authTicketJson = lqbInvoker
				        .invokeRestSpringParseObjForAuth(authOperationObject
				                .toString());
				if (authTicketJson.contains("EncryptedTicket")) {
					LOGGER.debug("Ticket is valid for user: " + lqbUsername
					        + " token:" + authTicketJson);
					sTicket = authTicketJson;

				} else {
					LOGGER.error("Ticket Not Generated For This User "
					        + lqbUsername);
					sTicket = null;
				}
			}
		} else {
			LOGGER.error("LQBUsername or Password are not set ");
			sTicket = null;
		}
		return sTicket;
	}

	/*
	 * private User getUserObject() { final Object principal =
	 * SecurityContextHolder.getContext() .getAuthentication().getPrincipal();
	 * if (principal instanceof User) { return (User) principal; } else { return
	 * null; }
	 * 
	 * }
	 */

	@Override
	@CacheEvict(value = "teaserRate")
	public void invalidateTeaserRateCache(String appFormData) {
		LOGGER.info("Invalidating teaser rate cache for " + appFormData);

	}

}
