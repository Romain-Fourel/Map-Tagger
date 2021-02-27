package com.glproject.map_tagger.dao.impl;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.PersistenceManagerFactory;
import javax.jdo.Transaction;
import javax.jdo.Query;

import com.glproject.map_tagger.dao.Place;
import com.glproject.map_tagger.dao.User;
import com.glproject.map_tagger.dao.UserDao;


public class UserDaoImpl implements UserDao {
	
	private PersistenceManagerFactory pmf;
	
	public UserDaoImpl(PersistenceManagerFactory pmf) {
		this.pmf = pmf;
	}
	
	@Override
	public void addUser(User user) {
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		
		try {
			tx.begin();
			pm.makePersistent(user);
			tx.commit();
			
		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}

	}


	@Override
	@SuppressWarnings("unchecked")
	public List<User> getUsers(String name) {
		List<User> users = null;
		List<User> detached = new ArrayList<User>();
		
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		
		try {
			tx.begin();
			
			Query q = pm.newQuery(User.class);
			q.declareParameters("String username");
			q.setFilter("name == username");
			
			users = (List<User>) q.execute(name);	
			detached = (List<User>) pm.detachCopyAll(users);
			
			tx.commit();
			
		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}
		return detached;	
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<User> getUsers() {
		List<User> users = null;
		List<User> detached = new ArrayList<User>();
		
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		
		try {
			tx.begin();
			
			Query q = pm.newQuery(User.class);			
			users = (List<User>) q.execute();	
			detached = (List<User>) pm.detachCopyAll(users);
			
			tx.commit();
			
		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}
		return detached;	
	}

}



















