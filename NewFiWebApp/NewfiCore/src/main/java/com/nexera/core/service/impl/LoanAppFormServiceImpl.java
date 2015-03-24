package com.nexera.core.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.nexera.common.dao.LoanAppFormDao;
import com.nexera.common.entity.LoanAppForm;
import com.nexera.common.entity.User;
import com.nexera.common.vo.LoanAppFormVO;
import com.nexera.core.service.LoanAppFormService;

@Component
public class LoanAppFormServiceImpl implements LoanAppFormService {
	@Autowired
	private LoanAppFormDao loanAppFormDao;
	
	

	@Override
	@Transactional
	public void save(LoanAppFormVO loaAppFormVO) {
		System.out.println("Inside 5");
		loanAppFormDao.saveOrUpdate(loaAppFormVO.convertToEntity());
	}

	/*@Override
	@Transactional
	public void create(LoanAppFormVO loaAppFormVO) {
		System.out.println("Inside 6");
		loanAppFormDao.save(loaAppFormVO.convertToEntity());

	}*/
	
	@Override
	@Transactional
	public void create(LoanAppFormVO loaAppFormVO) {
		Integer loanAppFormID = (Integer) loanAppFormDao.saveLoanAppFormWithDetails(loaAppFormVO.convertToEntity());
		LoanAppForm loanAppForm = null;
		if (loanAppFormID != null && loanAppFormID > 0)
			loanAppForm = loanAppFormDao.findLoanAppForm(loanAppFormID);

		//return this.buildLoanAppFormVO(loanAppForm);
	}
}
