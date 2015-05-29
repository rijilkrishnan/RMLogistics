package com.nexera.web.rest;

import java.io.IOException;
import java.io.StringReader;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.google.gson.Gson;
import com.nexera.common.commons.CommonConstants;
import com.nexera.common.vo.lqb.LqbTeaserRateVo;
import com.nexera.common.vo.lqb.TeaserRateResponseVO;
import com.nexera.core.service.LqbInterface;
import com.nexera.web.rest.util.TeaserRateHandler;


@RestController
@RequestMapping(value = "/teaseRate")
public class MarketingTeaseRate {
	
	
	private static final Logger LOG = LoggerFactory.getLogger(MarketingTeaseRate.class);
	
	@Autowired
	LqbInterface lqbCacheInvoker;
	
	
	@RequestMapping(value="/marketingTeaseRate", method = RequestMethod.GET)
	public String findMarkeingTeaseRates(String teaseRate){
		
		System.out.println("hiii");
		
		Gson gson = new Gson();
		String lockRateData = null;
		String lqbResponse = lqbCacheInvoker.invokeRest(createRequestPayload().toString());
		
		if(null != lqbResponse){
			List<TeaserRateResponseVO> teaserRateList = parseLqbResponse(lqbResponse);
			lockRateData = gson.toJson(teaserRateList);
		}else{
			lockRateData = "error";
		}
		return lockRateData;
		
	}
	
	
	private static JSONObject createRequestPayload(){
	
		
		JSONObject json = new JSONObject();
		JSONObject jsonChild = new JSONObject();
		
		HashMap<String, String> hashmap = new HashMap<String, String>();
		hashmap.put("homeWorthToday",CommonConstants.HOMEWORTHTODAY);
		hashmap.put("loanAmount", CommonConstants.LOANAMOUNT);
		hashmap.put("stateFromAPI", CommonConstants.STATEFROMAPI);
		hashmap.put("city", CommonConstants.CITY);
		hashmap.put("zipCode", CommonConstants.ZIPCODE);
		hashmap.put("OccType",CommonConstants.OCCTYPE);
		hashmap.put("subPropType",CommonConstants.SUBPROPTYPE);
		hashmap.put("loanPurpose",CommonConstants.LOANPURPOSE);

		JSONObject jsonObject = new JSONObject(hashmap);
		
		try {
			jsonChild.put("sXmlDataMap", jsonObject);
	        json.put("opName", "RunQuickPricer");
	        json.put("loanVO", jsonChild);
        } catch (JSONException e) {
	       
	        e.printStackTrace();
        }

		return json;
	}
	
	
	public List<TeaserRateResponseVO> parseLqbResponse(
	        String lqbTeaserRateResponse) {

		
		SAXParserFactory spf = SAXParserFactory.newInstance();
		try {

			SAXParser sp = spf.newSAXParser();
			TeaserRateHandler handler = new TeaserRateHandler();
			// parse the file and also register this class for call backs
			sp.parse(new InputSource(new StringReader(lqbTeaserRateResponse)),handler);
			List<TeaserRateResponseVO> teaserRateList = handler.getTeaserRateList();
			for (TeaserRateResponseVO teaserRateResponseVO : teaserRateList) {
				LOG.info("Program Name " + teaserRateResponseVO.getLoanDuration());

				Iterator<LqbTeaserRateVo> itr = teaserRateResponseVO.getRateVO().iterator();
				while (itr.hasNext()) {
					LqbTeaserRateVo resultVo = itr.next();
					LOG.info("Teaser Rate " + resultVo.getTeaserRate()+ "  Closing Cost is " + resultVo.getClosingCost());
				}
				return teaserRateList;
			}

		} catch (SAXException se) {
			se.printStackTrace();
		} catch (ParserConfigurationException pce) {
			pce.printStackTrace();
		} catch (IOException ie) {
			ie.printStackTrace();
		}

		return null;
	}
	
	
	
	public static void main(String[] args) {
	    
		System.out.println(createRequestPayload());
    }
	

}
