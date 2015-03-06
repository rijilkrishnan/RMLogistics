package com.nexera.common.vo.mongo;

import java.util.ArrayList;
import java.util.List;

public class MongoMessageHierarchyVO {

	// JSON structure of messageIDs in the hierarchy manner
	private List<MessageId> messageIds;

	//List of all the message objects containing the apropriate data
	private List<MongoMessagesVO> messageList;

	
	public List<MessageId> createMessageIdVO(){
		messageIds = new ArrayList<MongoMessageHierarchyVO.MessageId>();
		
		return messageIds;
	}
//	public void addToMessageId(MessageId object){
//		this.messageIds.add(object);
//	}
	
	
	public static class MessageId {

		//ID of the message to be looked up against messageList
		private String messageId;

		
		//Recursive collection of messages
		private List<MessageId> messageIds;
		public String getMessageId() {
			return messageId;
		}
		public void setMessageId(String messageId) {
			this.messageId = messageId;
		}
		public List<MessageId> getMessageIds() {
			return messageIds;
		}
		public void setMessageIds(List<MessageId> messageIds) {
			this.messageIds = messageIds;
		}
		public List<MessageId> createMessageIdVO(){
			messageIds = new ArrayList<MongoMessageHierarchyVO.MessageId>();
			
			return messageIds;
		}
		
		
	}

	public List<MessageId> getMessageIds() {
		return messageIds;
	}

	public void setMessageIds(List<MessageId> messageIds) {
		this.messageIds = messageIds;
	}

	public List<MongoMessagesVO> getMessageList() {
		return messageList;
	}

	public void setMessageList(List<MongoMessagesVO> messageList) {
		this.messageList = messageList;
	}
	
	
}