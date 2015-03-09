package com.nexera.mongo.service;

import com.nexera.common.exception.FatalException;
import com.nexera.common.exception.NonFatalException;
import com.nexera.common.vo.mongo.MongoMessageHierarchyVO;
import com.nexera.common.vo.mongo.MongoMessagesVO;
import com.nexera.common.vo.mongo.MongoQueryVO;

public interface MongoCoreMessageService {
	public String saveMessage(MongoMessagesVO messagesVO)
			throws FatalException, NonFatalException;
	
	public MongoMessageHierarchyVO getMessages(MongoQueryVO mongoQueryVO)
			throws FatalException, NonFatalException;
}