package com.nexera.common.commons;

import java.io.IOException;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.nexera.common.entity.CustomerDetail;
import com.nexera.common.entity.User;
import com.nexera.common.enums.UserRolesEnum;

@Component
public class Utils {

	private static final Logger LOG = LoggerFactory.getLogger(Utils.class);

	private static String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
	private static String GMT = "GMT";
	static final long ONE_MINUTE_IN_MILLIS = 60000;

	@Value("${unprotected.urls}")
	private String unProtectedUrls;

	/**
	 * Formatted string to be used for UI purpose. If input is null, the
	 * function returns an empty string to have a better display.
	 * 
	 * @param inputStr
	 * @return
	 */
	public String getDefaultString(String inputStr) {
		if (inputStr == null) {
			return "";
		}
		return inputStr;
	}

	public static String unformatCurrencyField(String field) {
		String finalString = "";

		if (field == null) {
			return finalString;
		}
		if (field.contains("$") || field.contains(",")) {

			for (int i = 0; i < field.length(); i++) {
				if (field.charAt(i) != '$' && field.charAt(i) != ',')
					finalString += field.charAt(i);
			}
			return finalString;
		} else {
			return field;
		}

	}

	public String getJsonStringOfMap(Map<String, Object> map) {
		ObjectMapper mapper = new ObjectMapper();
		StringWriter sw = new StringWriter();
		try {
			mapper.writeValue(sw, map);
		} catch (JsonGenerationException e) {
			LOG.error("Exception Caught " + e.getMessage());
			return null;
		} catch (JsonMappingException e) {
			LOG.error("Exception Caught " + e.getMessage());
			return null;
		} catch (IOException e) {
			LOG.error("Exception Caught " + e.getMessage());
			return null;
		}
		return sw.toString();
	}

	public String getDateInUserLocaleFormatted(Date date) {

		Integer offSetFromUser = getOffsetFromUserObject();
		DateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);
		Date localeDate = null;
		try {
			dateFormat.setTimeZone(TimeZone.getTimeZone(GMT));

			long offset = offSetFromUser * ONE_MINUTE_IN_MILLIS;
			localeDate = new Date(date.getTime() - offset);
			return dateFormat.format(localeDate);

		} catch (Exception e) {
			LOG.error("Exception Caught " + e.getMessage());
		}
		return null;
	}

	public Date getDateInUserLocale(Date date) {

		Integer offSetFromUser = getOffsetFromUserObject();
		return getDateInUserLocale(date, offSetFromUser);
	}

	public Date getDateInUserLocale(Date date, Integer offSetFromUser) {
		if (offSetFromUser == null) {
			offSetFromUser = getOffsetFromUserObject();
		}

		Date localeDate = null;
		try {

			long offset = offSetFromUser * ONE_MINUTE_IN_MILLIS;
			localeDate = new Date(date.getTime() - offset);

			return localeDate;

		} catch (Exception e) {
			LOG.error("Exception Caught " + e.getMessage());
		}
		return null;
	}

	public Date getUserDateInGMT(Date date) {
		Integer offSetFromUser = getOffsetFromUserObject();
		return generateDateUsingOffset(date, offSetFromUser);
	}

	public Date generateDateUsingOffset(Date date, Integer offset) {
		Date gmt = null;
		try {

			long offsetinMiliSec = offset * ONE_MINUTE_IN_MILLIS;
			gmt = new Date(date.getTime() + offsetinMiliSec);
			return gmt;

		} catch (Exception e) {
			LOG.error("Exception Caught " + e.getMessage());
		}
		return null;
	}

	public Date getSystemDateInGMT(Date date) {
		Integer offSetFromSystem = new Date().getTimezoneOffset();
		return generateDateUsingOffset(date, offSetFromSystem);
	}

	private Integer getOffsetFromUserObject() {

		if (SecurityContextHolder.getContext() == null
		        || SecurityContextHolder.getContext().getAuthentication() == null)
			return 0;

		final Object principal = SecurityContextHolder.getContext()
		        .getAuthentication().getPrincipal();
		if (principal != null && (principal instanceof User)) {
			User user = (User) principal;
			if (user.getMinutesOffset() == null) {
				return 0;
			} else {
				return Integer.parseInt(user.getMinutesOffset());
			}
		} else {
			return 0;
		}

	}

	public boolean hasLinkExpired(Date inputTime, int rawOffSet) {

		Calendar tokenExpirationTime = Calendar.getInstance();
		tokenExpirationTime.setTimeInMillis(inputTime.getTime() + rawOffSet);
		tokenExpirationTime.add(Calendar.DAY_OF_MONTH, 3);
		Calendar today = Calendar.getInstance();
		today.setTimeInMillis(System.currentTimeMillis());
		LOG.debug("" + tokenExpirationTime.compareTo(today));
		LOG.debug("Has Token Expired" + tokenExpirationTime.before(today));
		return tokenExpirationTime.before(today);

	}

	// To be used by all modules to fetch the currently logged in user
	public User getLoggedInUser() {

		if (SecurityContextHolder.getContext() == null
		        || SecurityContextHolder.getContext().getAuthentication() == null)
			return null;

		final Object principal = SecurityContextHolder.getContext()
		        .getAuthentication().getPrincipal();
		if (principal != null && principal instanceof User) {
			User user = (User) principal;
			return user;
		}
		return null;
	}

	public static String convertMapToJson(Map<String, Object> map) {
		Gson gson = new Gson();
		String jsonString = gson.toJson(map);
		return jsonString;
	}

	public String generateMessageIdFromAddress(String mongoMessageId, int loanId) {

		return MessageFormat.format("{0}-{1}{2}", mongoMessageId, loanId,
		        CommonConstants.SENDER_DOMAIN);
	}

	public String generateLoanEmail(int loanId) {
		return loanId + CommonConstants.SENDER_DOMAIN;
	}

	public UserRolesEnum getLoggedInUserRole() {
		User loggedInUser = getLoggedInUser();
		if (null != loggedInUser.getInternalUserDetail()) {

			return UserRolesEnum.valueOf(loggedInUser.getInternalUserDetail()
			        .getInternaUserRoleMaster().getRoleName());
		}
		return UserRolesEnum.valueOf(loggedInUser.getUserRole().getRoleCd());

	}

	public String constrtCreditScore(CustomerDetail customerDetail) {
		// TODO Auto-generated method stub

		String creditScore = "";
		String equifaxScore = customerDetail.getEquifaxScore();
		if (equifaxScore != null && !equifaxScore.isEmpty()) {
			creditScore = CommonConstants.EQ + equifaxScore
			        + CommonConstants.CREDIT_SCORE_SEPARATOR;
		} else {
			creditScore = CommonConstants.EQ + CommonConstants.UNKNOWN_SCORE
			        + CommonConstants.CREDIT_SCORE_SEPARATOR;
		}
		String transunionScore = customerDetail.getTransunionScore();
		if (transunionScore != null && !transunionScore.isEmpty()) {
			creditScore = creditScore + CommonConstants.TU + transunionScore
			        + CommonConstants.CREDIT_SCORE_SEPARATOR;
		} else {
			creditScore = creditScore + CommonConstants.TU
			        + CommonConstants.UNKNOWN_SCORE
			        + CommonConstants.CREDIT_SCORE_SEPARATOR;
		}

		String experianScore = customerDetail.getExperianScore();
		if (experianScore != null && !experianScore.isEmpty()) {
			creditScore = creditScore + CommonConstants.EX + experianScore
			        + CommonConstants.CREDIT_SCORE_SEPARATOR;
		} else {
			creditScore = creditScore + CommonConstants.EX
			        + CommonConstants.UNKNOWN_SCORE
			        + CommonConstants.CREDIT_SCORE_SEPARATOR;
		}

		return creditScore;
	}

	public List<String> getUnprotectedUrls() {

		String[] unprotectedUrlsArray = unProtectedUrls.split(",");

		List<String> unprotectedUrls = new ArrayList<String>();
		for (String url : unprotectedUrlsArray) {
			unprotectedUrls.add(url);
		}
		return unprotectedUrls;
	}

	/*
	 * public static void main(String[] args) { String a ="$100,2313";
	 * BigDecimal myBigNum = new BigDecimal(unformatCurrencyField(a));
	 * System.out.println(myBigNum);
	 * 
	 * }
	 */

	public static BigDecimal convertToBigDecimal(String input) {

		if (null != input) {
			BigDecimal myBigNum = new BigDecimal(unformatCurrencyField(input));
			return myBigNum;

		}

		return null;

	}

	public static Integer convertToInteger(String input) {

		if (null != input) {
			Integer myInt = Integer.parseInt(input);
			return myInt;

		}

		return null;

	}

	public static String convertToString(Integer input) {

		if (null != input) {
			return String.valueOf(input);
		}

		return null;
	}

	public static String convertToString(BigDecimal input) {

		if (null != input) {
			return String.valueOf(input);
		}

		return null;
	}

	public Date convertCurrentDateToUtc() {
		Date date = new Date();
		TimeZone timeZone = TimeZone.getDefault();
		int offset = timeZone.getOffset(date.getTime());
		long utcMilliSeconds = date.getTime() - offset;
		Date utcDate = new Date(utcMilliSeconds);
		return utcDate;
	}

	public String getFileUrl(String baseUrl, String uuID) {
		String fileURL = baseUrl + "readFileAsStream.do?uuid=" + uuID
		        + "&isThumb=0";
		return fileURL;
	}

}
