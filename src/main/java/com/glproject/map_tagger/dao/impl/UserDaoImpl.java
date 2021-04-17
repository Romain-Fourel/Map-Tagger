package com.glproject.map_tagger.dao.impl;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.PersistenceManagerFactory;
import javax.jdo.Query;
import javax.jdo.Transaction;

import com.glproject.map_tagger.dao.Map;
import com.glproject.map_tagger.dao.User;
import com.glproject.map_tagger.dao.UserDao;

public class UserDaoImpl implements UserDao {

	private PersistenceManagerFactory pmf;

	public UserDaoImpl(PersistenceManagerFactory pmf) {
		this.pmf = pmf;
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

	@Override
	public User getUser(Long ID) {
		User user = null;
		User detached = null;

		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();

		try {
			tx.begin();
			user = pm.getObjectById(User.class, ID);
			
			//without this line, items of user are becoming null after the pm.close()
			// weird...
			user.toString();
			
			
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



	@SuppressWarnings("unchecked")
	@Override
	public List<User> getUsers(String name) {
		List<User> users = null;
		List<User> detached = null;

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

	@Override
	public User addUser(User user) {

		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		
		User detached = new User();
		
		try {
			tx.begin();
			user = pm.makePersistent(user);
			
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


	@Override
	public User updateUser(User user) {
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		
		User detached = null;
		
		try {
			tx.begin();
			User userPersistent = pm.getObjectById(User.class, user.getID());
			userPersistent.setName(user.getName());
			userPersistent.setPassword(user.getPassword());
			
			userPersistent.setMapList(null);
			user.getMapList().forEach(map->userPersistent.addMap(pm.getObjectById(Map.class, map.getID())));	
			
			userPersistent.setMapsShared(null);
			user.getMapsShared().forEach(map->userPersistent.addMapShared(pm.getObjectById(Map.class, map.getID())));
			
			userPersistent.setMapsVisibility(user.getMapsVisibility());
			
			detached = pm.detachCopy(userPersistent);
								
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
	public void delete(User user) {

		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();

		try {
			tx.begin();
			
			pm.deletePersistent(user);
			
			tx.commit();

		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}
	}

}
