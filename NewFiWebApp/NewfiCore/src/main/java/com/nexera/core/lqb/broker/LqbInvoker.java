package com.nexera.core.lqb.broker;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.codec.binary.Base64;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class LqbInvoker {

	@Value("${muleUrl}")
	private String muleUrl;

	@Value("${muleUrlForDocs}")
	private String muleUrlForDocs;

	public JSONObject invokeLqbService(String formData) {
		return invokeRestSpringParseObj(formData);
	}

	private JSONObject invokeRestSpringParseObj(String formData) {

		HttpHeaders headers = new HttpHeaders();
		@SuppressWarnings({ "rawtypes", "unchecked" })
		HttpEntity request = new HttpEntity(formData, headers);
		RestTemplate restTemplate = new RestTemplate();

		String returnedUser = restTemplate.postForObject(muleUrl, request,
		        String.class);
		JSONObject jsonObject = new JSONObject(returnedUser);
		return jsonObject;
	}

	public JSONObject invokeRestSpringParseStream(String formData)
	        throws IOException {

		HttpHeaders headers = new HttpHeaders();
		StringBuilder builder = new StringBuilder();
		@SuppressWarnings({ "rawtypes", "unchecked" })
		HttpEntity request = new HttpEntity(formData, headers);
		RestTemplate restTemplate = new RestTemplate();
		String returnedUser = restTemplate.postForObject(muleUrlForDocs,
		        request, String.class);

		/*
		 * Base64 b = new Base64(); byte[] bytes =
		 * b.decode(returnedUser.getBytes());
		 */

		JSONObject jsonObject = new JSONObject(returnedUser);
		byte[] array = Base64.decodeBase64(jsonObject.get("responseMessage")
		        .toString().getBytes());
		InputStream content = new ByteArrayInputStream(array);
		// InputStream content = new
		// ByteArrayInputStream(returnedUser.getBytes());
		// BufferedReader reader = new BufferedReader(new InputStreamReader(
		// content));
		// String line;
		// while ((line = reader.readLine()) != null) {
		// builder.append(line);
		// }
		//
		// JSONObject jsonObject = new JSONObject(builder);
		return jsonObject;
	}

}