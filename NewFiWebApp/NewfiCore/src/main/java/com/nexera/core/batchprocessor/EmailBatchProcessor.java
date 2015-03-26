package com.nexera.core.batchprocessor;

import java.util.Properties;

import javax.mail.Flags;
import javax.mail.Flags.Flag;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.NoSuchProviderException;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.search.FlagTerm;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import com.nexera.core.processor.EmailProcessor;

@DisallowConcurrentExecution
public class EmailBatchProcessor extends QuartzJobBean {

	private static final Logger LOGGER = LoggerFactory
	        .getLogger(EmailBatchProcessor.class);

	@Value("${mail.store.protocol}")
	private String protocol;

	@Value("${imap.host}")
	private String imapHost;

	@Value("${email.username}")
	private String username;

	@Value("${email.password}")
	private String password;

	@Value("${email.folderName}")
	private String folderName;

	@Autowired
	private ThreadPoolTaskExecutor emailTaskExecutor;

	@Autowired
	private ApplicationContext applicationContext;

	@Override
	protected void executeInternal(JobExecutionContext arg0)
	        throws JobExecutionException {
		LOGGER.debug("Code inside this will get triggered every 1 min ");
		SpringBeanAutowiringSupport.processInjectionBasedOnCurrentContext(this);
		LOGGER.debug("Spring beans initialized for email Thread ");
		configureEmail();

	}

	public void configureEmail() {
		Properties properties = new Properties();
		properties.setProperty("mail.store.protocol", protocol);
		try {
			LOGGER.debug("Creating session for email with properties "+properties.getProperty("mail.store.protocol"));
			Session session = Session.getDefaultInstance(properties, null);
			Store store = session.getStore(protocol);
			LOGGER.debug("Checking if store is connected "+store.isConnected());
			if (!store.isConnected()){
				LOGGER.debug("Store not connected, connecting");
				store.connect(imapHost, username, password);
			}else{
				LOGGER.debug("Store already connected, reading emails");
			}
				
			LOGGER.debug("Reading emails");
			Folder inbox = store.getFolder(folderName);
			inbox.open(Folder.READ_WRITE);
			LOGGER.debug("Opening Inbox in readWrite");
			fetchUnReadMails(inbox);
			
			/*
			 * inbox.close(true); store.close();
			 */
		} catch (NoSuchProviderException e) {
			// TODO catch this exception a particular table
		} catch (MessagingException e) {
			// TODO catch this exception a particular table
		}

	}

	public void fetchUnReadMails(Folder inbox) {
		LOGGER.debug("Fetching all unread mails ");
		try {
			FlagTerm flagTerm = new FlagTerm(new Flags(Flag.SEEN), false);
			Message msg[] = inbox.search(flagTerm);

			LOGGER.debug("Total Number Of Unread Mails Are " + msg.length);
			for (Message unreadMsg : msg) {
				EmailProcessor emailProcessor = applicationContext
				        .getBean(EmailProcessor.class);
				emailProcessor.setMessage(unreadMsg);
				emailTaskExecutor.execute(emailProcessor);

			}

			/*
			 * emailTaskExecutor.shutdown(); try {
			 * emailTaskExecutor.getThreadPoolExecutor().awaitTermination(
			 * Long.MAX_VALUE, TimeUnit.NANOSECONDS); } catch
			 * (InterruptedException e) {
			 * LOGGER.error("Exception caught while terminating executor " +
			 * e.getMessage()); throw new FatalException(
			 * "Exception caught while terminating executor " + e.getMessage());
			 * }
			 */

		} catch (MessagingException e) {
			LOGGER.error("Exception while reading mails " + e.getMessage());
		}
	}
}
