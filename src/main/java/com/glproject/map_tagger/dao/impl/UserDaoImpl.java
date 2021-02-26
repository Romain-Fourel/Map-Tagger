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


	/**
	 * TODO, can't be done while the location is not precisely defined
	 */
	@Override
	public List<Place> getPlaceNear(int radius) {
		
		List<Place> places = null;
		List<Place> detached = new ArrayList<Place>();
		
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		
		try {
			tx.begin();
			
			Query q = pm.newQuery(Place.class);
			q.declareParameters("");
			q.setFilter("");
			
			
			tx.commit();			
		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}
		return detached;	
	}

	@Override
	public User getUser(String name) {
		User user = null;
		User detached = new User();
		
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		
		try {
			tx.begin();
			
			Query q = pm.newQuery(User.class);
			q.declareParameters("String username");
			q.setFilter("name == username");
			
			user = (User) q.execute(name);	
			detached = pm.detachCopy(user);
			
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



















