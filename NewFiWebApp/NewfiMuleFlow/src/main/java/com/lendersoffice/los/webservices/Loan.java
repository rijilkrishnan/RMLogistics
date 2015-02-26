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
 * 2015-02-12T20:37:58.870+05:30
 * Generated source version: 2.6.16
 * 
 */
@WebServiceClient(name = "Loan", 
                  wsdlLocation = "https://webservices.lendingqb.com/los/webservice/Loan.asmx?WSDL",
                  targetNamespace = "http://www.lendersoffice.com/los/webservices/") 
public class Loan extends Service {

    public final static URL WSDL_LOCATION;

    public final static QName SERVICE = new QName("http://www.lendersoffice.com/los/webservices/", "Loan");
    public final static QName LoanSoap = new QName("http://www.lendersoffice.com/los/webservices/", "LoanSoap");
    public final static QName LoanSoap12 = new QName("http://www.lendersoffice.com/los/webservices/", "LoanSoap12");
    static {
        URL url = null;
        try {
            url = new URL("https://webservices.lendingqb.com/los/webservice/Loan.asmx?WSDL");
        } catch (MalformedURLException e) {
            java.util.logging.Logger.getLogger(Loan.class.getName())
                .log(java.util.logging.Level.INFO, 
                     "Can not initialize the default wsdl from {0}", "https://webservices.lendingqb.com/los/webservice/Loan.asmx?WSDL");
        }
        WSDL_LOCATION = url;
    }

    public Loan(URL wsdlLocation) {
        super(wsdlLocation, SERVICE);
    }

    public Loan(URL wsdlLocation, QName serviceName) {
        super(wsdlLocation, serviceName);
    }

    public Loan() {
        super(WSDL_LOCATION, SERVICE);
    }
    
    //This constructor requires JAX-WS API 2.2. You will need to endorse the 2.2
    //API jar or re-run wsdl2java with "-frontend jaxws21" to generate JAX-WS 2.1
    //compliant code instead.
    public Loan(WebServiceFeature ... features) {
        super(WSDL_LOCATION, SERVICE, features);
    }

    //This constructor requires JAX-WS API 2.2. You will need to endorse the 2.2
    //API jar or re-run wsdl2java with "-frontend jaxws21" to generate JAX-WS 2.1
    //compliant code instead.
    public Loan(URL wsdlLocation, WebServiceFeature ... features) {
        super(wsdlLocation, SERVICE, features);
    }

    //This constructor requires JAX-WS API 2.2. You will need to endorse the 2.2
    //API jar or re-run wsdl2java with "-frontend jaxws21" to generate JAX-WS 2.1
    //compliant code instead.
    public Loan(URL wsdlLocation, QName serviceName, WebServiceFeature ... features) {
        super(wsdlLocation, serviceName, features);
    }

    /**
     *
     * @return
     *     returns LoanSoap
     */
    @WebEndpoint(name = "LoanSoap")
    public LoanSoap getLoanSoap() {
        return super.getPort(LoanSoap, LoanSoap.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns LoanSoap
     */
    @WebEndpoint(name = "LoanSoap")
    public LoanSoap getLoanSoap(WebServiceFeature... features) {
        return super.getPort(LoanSoap, LoanSoap.class, features);
    }
    /**
     *
     * @return
     *     returns LoanSoap
     */
    @WebEndpoint(name = "LoanSoap12")
    public LoanSoap getLoanSoap12() {
        return super.getPort(LoanSoap12, LoanSoap.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns LoanSoap
     */
    @WebEndpoint(name = "LoanSoap12")
    public LoanSoap getLoanSoap12(WebServiceFeature... features) {
        return super.getPort(LoanSoap12, LoanSoap.class, features);
    }

}
