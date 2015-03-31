package com.lendersoffice.los.webservices;

import java.net.MalformedURLException;
import java.net.URL;
import javax.xml.namespace.QName;
import javax.xml.ws.WebEndpoint;
import javax.xml.ws.WebServiceClient;
import javax.xml.ws.WebServiceFeature;
import javax.xml.ws.Service;

/**
 * This class was generated by Apache CXF 2.6.16
 * 2015-03-30T16:06:00.278+05:30
 * Generated source version: 2.6.16
 * 
 */
@WebServiceClient(name = "AppView", 
                  wsdlLocation = "https://webservices.lendingqb.com/los/webservice/AppView.asmx?WSDL",
                  targetNamespace = "http://www.lendersoffice.com/los/webservices/") 
public class AppView extends Service {

    public final static URL WSDL_LOCATION;

    public final static QName SERVICE = new QName("http://www.lendersoffice.com/los/webservices/", "AppView");
    public final static QName AppViewSoap12 = new QName("http://www.lendersoffice.com/los/webservices/", "AppViewSoap12");
    public final static QName AppViewSoap = new QName("http://www.lendersoffice.com/los/webservices/", "AppViewSoap");
    static {
        URL url = null;
        try {
            url = new URL("https://webservices.lendingqb.com/los/webservice/AppView.asmx?WSDL");
        } catch (MalformedURLException e) {
            java.util.logging.Logger.getLogger(AppView.class.getName())
                .log(java.util.logging.Level.INFO, 
                     "Can not initialize the default wsdl from {0}", "https://webservices.lendingqb.com/los/webservice/AppView.asmx?WSDL");
        }
        WSDL_LOCATION = url;
    }

    public AppView(URL wsdlLocation) {
        super(wsdlLocation, SERVICE);
    }

    public AppView(URL wsdlLocation, QName serviceName) {
        super(wsdlLocation, serviceName);
    }

    public AppView() {
        super(WSDL_LOCATION, SERVICE);
    }
    
    //This constructor requires JAX-WS API 2.2. You will need to endorse the 2.2
    //API jar or re-run wsdl2java with "-frontend jaxws21" to generate JAX-WS 2.1
    //compliant code instead.
    public AppView(WebServiceFeature ... features) {
        super(WSDL_LOCATION, SERVICE, features);
    }

    //This constructor requires JAX-WS API 2.2. You will need to endorse the 2.2
    //API jar or re-run wsdl2java with "-frontend jaxws21" to generate JAX-WS 2.1
    //compliant code instead.
    public AppView(URL wsdlLocation, WebServiceFeature ... features) {
        super(wsdlLocation, SERVICE, features);
    }

    //This constructor requires JAX-WS API 2.2. You will need to endorse the 2.2
    //API jar or re-run wsdl2java with "-frontend jaxws21" to generate JAX-WS 2.1
    //compliant code instead.
    public AppView(URL wsdlLocation, QName serviceName, WebServiceFeature ... features) {
        super(wsdlLocation, serviceName, features);
    }

    /**
     *
     * @return
     *     returns AppViewSoap
     */
    @WebEndpoint(name = "AppViewSoap12")
    public AppViewSoap getAppViewSoap12() {
        return super.getPort(AppViewSoap12, AppViewSoap.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns AppViewSoap
     */
    @WebEndpoint(name = "AppViewSoap12")
    public AppViewSoap getAppViewSoap12(WebServiceFeature... features) {
        return super.getPort(AppViewSoap12, AppViewSoap.class, features);
    }
    /**
     *
     * @return
     *     returns AppViewSoap
     */
    @WebEndpoint(name = "AppViewSoap")
    public AppViewSoap getAppViewSoap() {
        return super.getPort(AppViewSoap, AppViewSoap.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns AppViewSoap
     */
    @WebEndpoint(name = "AppViewSoap")
    public AppViewSoap getAppViewSoap(WebServiceFeature... features) {
        return super.getPort(AppViewSoap, AppViewSoap.class, features);
    }

}
