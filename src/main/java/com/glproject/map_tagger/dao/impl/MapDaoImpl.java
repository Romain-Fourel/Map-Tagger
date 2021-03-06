package com.glproject.map_tagger.dao.impl;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.PersistenceManagerFactory;
import javax.jdo.Query;
import javax.jdo.Transaction;

import com.glproject.map_tagger.dao.Map;
import com.glproject.map_tagger.dao.MapDao;

public class MapDaoImpl implements MapDao {

	private PersistenceManagerFactory pmf;

	public MapDaoImpl(PersistenceManagerFactory pmf) {
		this.pmf = pmf;
	}

	@Override
	public void addMap(Map map) {
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();

		try {
			tx.begin();
			pm.makePersistent(map);
			tx.commit();

		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}

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

	@Override
	public List<Map> getMaps(String name) {
		// TODO Auto-generated method stub
		return null;
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
	public List<Map> getPublicMaps() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void delete(Map map) {
		// TODO Auto-generated method stub

	}

}
