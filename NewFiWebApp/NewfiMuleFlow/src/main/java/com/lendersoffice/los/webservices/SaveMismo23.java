
package com.lendersoffice.los.webservices;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="sTicket" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="loanId" type="{http://microsoft.com/wsdl/types/}guid"/>
 *         &lt;element name="sXmlData" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "sTicket",
    "loanId",
    "sXmlData"
})
@XmlRootElement(name = "SaveMismo23")
public class SaveMismo23 {

    protected String sTicket;
    @XmlElement(required = true)
    protected String loanId;
    protected String sXmlData;

    /**
     * Gets the value of the sTicket property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSTicket() {
        return sTicket;
    }

    /**
     * Sets the value of the sTicket property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSTicket(String value) {
        this.sTicket = value;
    }

    /**
     * Gets the value of the loanId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLoanId() {
        return loanId;
    }

    /**
     * Sets the value of the loanId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLoanId(String value) {
        this.loanId = value;
    }

    /**
     * Gets the value of the sXmlData property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSXmlData() {
        return sXmlData;
    }

    /**
     * Sets the value of the sXmlData property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSXmlData(String value) {
        this.sXmlData = value;
    }

}
