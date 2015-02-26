package com.nexera.common.entity;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The persistent class for the loandetails database table.
 * 
 */
@Entity
@Table(name = "loandetails")
@NamedQuery(name = "LoanDetail.findAll", query = "SELECT l FROM LoanDetail l")
public class LoanDetail implements Serializable {
	private static final long serialVersionUID = 1L;
	private int id;
	private Double downPayment;
	private Double emi;
	private Double loanAmount;
	private Double rate;
	private Loan loan;

	public LoanDetail() {
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Column(name = "down_payment")
	public Double getDownPayment() {
		return this.downPayment;
	}

	public void setDownPayment(Double downPayment) {
		this.downPayment = downPayment;
	}

	public Double getEmi() {
		return this.emi;
	}

	public void setEmi(Double emi) {
		this.emi = emi;
	}

	@Column(name = "loan_amount")
	public Double getLoanAmount() {
		return this.loanAmount;
	}

	public void setLoanAmount(Double loanAmount) {
		this.loanAmount = loanAmount;
	}

	public Double getRate() {
		return this.rate;
	}

	public void setRate(Double rate) {
		this.rate = rate;
	}

	// bi-directional many-to-one association to Loan
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "loan")
	public Loan getLoan() {
		return loan;
	}

	public void setLoan(Loan loan) {
		this.loan = loan;
	}

}