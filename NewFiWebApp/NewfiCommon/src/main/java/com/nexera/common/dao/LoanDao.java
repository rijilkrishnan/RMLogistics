package com.nexera.common.dao;

import java.util.List;

import com.nexera.common.entity.Loan;
import com.nexera.common.entity.LoanAppForm;
import com.nexera.common.entity.User;

public interface LoanDao extends GenericDao {

	List<Loan> getLoansOfUser(User user);

	boolean addToLoanTeam(Loan loan,User user,User addedBy);

	boolean removeFromLoanTeam(Loan loan,User user);

	List<User> retreiveLoanTeam(Loan loan);

	List<Loan> retreiveLoansAsManager(User loanManager);
	
    public LoanAppForm getLoanAppForm(Integer loanId);
}
