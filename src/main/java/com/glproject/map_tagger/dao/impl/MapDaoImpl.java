package com.glproject.map_tagger.dao.impl;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.PersistenceManagerFactory;
import javax.jdo.Query;
import javax.jdo.Transaction;

import com.glproject.map_tagger.dao.Map;
import com.glproject.map_tagger.dao.MapDao;
import com.glproject.map_tagger.dao.User;

public class MapDaoImpl implements MapDao {

	private PersistenceManagerFactory pmf;
	

	public MapDaoImpl(PersistenceManagerFactory pmf) {
		this.pmf = pmf;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Map> getMaps() {
		List<Map> maps = null;
		List<Map> detached = new ArrayList<Map>();

		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();

		try {
			tx.begin();

			Query q = pm.newQuery(Map.class);
			maps = (List<Map>) q.execute();
			detached = (List<Map>) pm.detachCopyAll(maps);

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
	public List<Map> getMaps(String name) {
		List<Map> maps = null;
		List<Map> detached = new ArrayList<Map>();

		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();

		try {
			tx.begin();

			Query q = pm.newQuery(Map.class);
			q.declareParameters("String nameMap");	
			q.setFilter("name.indexOf(nameMap)>-1");
			maps = (List<Map>) q.execute(name);
			detached = (List<Map>) pm.detachCopyAll(maps);

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
	public Map getMap(Long ID) {
		Map map = null;
		Map detached = null;

		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();

		try {
			tx.begin();
			map = pm.getObjectById(Map.class, ID);
			map.toString();
			detached = pm.detachCopy(map);
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
	public List<Map> getPublicMaps() {
		List<Map> maps = null;
		List<Map> detached = null;

		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();

		try {
			tx.begin();
			Query q = pm.newQuery(Map.class);
			q.declareParameters("String conf");
			q.setFilter("confidentiality.toString() == conf");
			
			maps = (List<Map>) q.execute("PUBLIC");
			maps.toString();

			detached = (List<Map>) pm.detachCopyAll(maps);
			
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
	public Map addMapTo(Long userId, Map map) {
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		
		Map detached = null;
		
		try {
			tx.begin();
			User userPersistent = pm.getObjectById(User.class, userId);
			
			//if the map doesn't exists yet in the database:
			if (map.getID()==null) {
				userPersistent.addMap(map);
			}
			else {
				//if the map is already in the database:
				userPersistent.addMap(pm.getObjectById(Map.class,map.getID()));
			}
			userPersistent.setVisibilityOf(map.getID(), true);
			
			userPersistent.toString();
				
			detached = pm.detachCopy(map);
			
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
	public Map addMapSharedTo(Long userId, Map map) {
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		
		Map detached = null;
		
		try {
			tx.begin();
			User userPersistent = pm.getObjectById(User.class, userId);
			
			userPersistent.addMapShared(pm.getObjectById(Map.class,map.getID()));	
			
			userPersistent.toString();
				
			detached = pm.detachCopy(map);
			
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
	public Map updateMap(Map map) {
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		
		Map detached = null;
		
		try {
			tx.begin();
			Map mapPersistent = pm.getObjectById(Map.class, map.getID());
			mapPersistent.setName(map.getName());
			mapPersistent.setDescription(map.getDescription());
			mapPersistent.setConfidentiality(map.getConfidentiality());
			
			mapPersistent.toString();
			
			detached = pm.detachCopy(mapPersistent);
								
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
	public void delete(Map map) {
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();

		try {
			tx.begin();
			
			pm.deletePersistent(map);
			
			tx.commit();

		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}

	}

}
